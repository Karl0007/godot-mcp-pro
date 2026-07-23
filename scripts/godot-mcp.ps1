#requires -Version 5.1
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('install', 'update', 'doctor')]
    [string]$Command = 'install',
    [string]$ProjectPath,
    [int]$Port = 6505,
    [string]$McpConfigPath,
    [switch]$AddonUpstream,
    [switch]$Yes,
    [Alias('h')]
    [switch]$Help
)

$ErrorActionPreference = 'Stop'
$RootDir = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$SubmoduleDir = Join-Path $RootDir 'vendor/godot-mcp-addon'
$AddonSource = Join-Path $SubmoduleDir 'addons/godot_mcp'
$RegistrationFile = Join-Path $RootDir '.godot-mcp/projects.txt'

function Show-Usage {
    @'
Usage: godot-mcp.ps1 [install|update|doctor] [options]

Options:
  -ProjectPath PATH     Godot project directory (defaults to the current project)
  -Port PORT            Bridge port, 6505-6509 (default: 6505)
  -McpConfigPath PATH   MCP JSON fragment output path
  -AddonUpstream        Fetch upstream/master and merge it in the addon submodule
  -Yes                  Replace an existing target addon without prompting
  -Help                 Show this help
'@
}

function Fail([string]$Message) {
    throw $Message
}

function Invoke-Checked([string]$File, [string[]]$Arguments) {
    & $File @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$File failed with exit code $LASTEXITCODE"
    }
}

function Require-Tools {
    foreach ($tool in @('node', 'npm', 'git')) {
        if (-not (Get-Command $tool -CommandType Application -ErrorAction SilentlyContinue)) {
            Fail "$tool is required"
        }
    }
}

function Resolve-Project {
    if ($ProjectPath) {
        $full = [IO.Path]::GetFullPath($ProjectPath)
        if (-not (Test-Path -LiteralPath $full -PathType Container)) { Fail "directory does not exist: $ProjectPath" }
        $script:ProjectPath = $full
        return
    }
    $currentProject = Join-Path (Get-Location) 'project.godot'
    if (Test-Path -LiteralPath $currentProject -PathType Leaf) {
        $script:ProjectPath = (Get-Location).Path
        return
    }
    if (Test-Path -LiteralPath $RegistrationFile -PathType Leaf) {
        foreach ($candidate in Get-Content -LiteralPath $RegistrationFile) {
            if ($candidate -and (Test-Path -LiteralPath (Join-Path $candidate 'project.godot') -PathType Leaf)) {
                $script:ProjectPath = $candidate
                return
            }
        }
    }
    $script:ProjectPath = ''
}

function Ensure-Submodule {
    Invoke-Checked 'git' @('-C', $RootDir, 'submodule', 'update', '--init', '--recursive')
    if (-not (Test-Path -LiteralPath $AddonSource -PathType Container)) { Fail "addon source is missing: $AddonSource" }
}

function Update-From-Upstream {
    if (-not $AddonUpstream) { return }
    & git -C $SubmoduleDir config --get remote.upstream.url *> $null
    if ($LASTEXITCODE -ne 0) {
        Invoke-Checked 'git' @('-C', $SubmoduleDir, 'remote', 'add', 'upstream', 'https://github.com/youichi-uda/godot-mcp-pro.git')
    }
    Invoke-Checked 'git' @('-C', $SubmoduleDir, 'fetch', 'upstream', 'master')
    & git -C $SubmoduleDir merge --ff-only upstream/master
    if ($LASTEXITCODE -ne 0) {
        Invoke-Checked 'git' @('-C', $SubmoduleDir, 'merge', '--no-edit', 'upstream/master')
    }
    $revision = (& git -C $SubmoduleDir rev-parse --short HEAD).Trim()
    Write-Host "addon submodule now points to $revision"
}

function Build-Bridge {
    Push-Location $RootDir
    try {
        Invoke-Checked 'npm' @('ci')
        Invoke-Checked 'npm' @('run', 'build')
    } finally {
        Pop-Location
    }
}

function Confirm-AddonCopy([string]$TargetAddon) {
    if (-not (Test-Path -LiteralPath $TargetAddon -PathType Container)) { return }
    Write-Warning "Existing addon directory will be overwritten: $TargetAddon"
    if ($Yes) { return }
    if ([Console]::IsInputRedirected) { Fail 'refusing to overwrite an existing addon without -Yes' }
    $answer = Read-Host 'Continue? [y/N]'
    if ($answer -notmatch '^(?i:y|yes)$') { Fail 'addon copy cancelled' }
}

function Copy-Addon {
    $targetAddon = Join-Path $ProjectPath 'addons/godot_mcp'
    Confirm-AddonCopy $targetAddon
    New-Item -ItemType Directory -Path $targetAddon -Force | Out-Null
    foreach ($item in Get-ChildItem -LiteralPath $AddonSource -Force) {
        Copy-Item -LiteralPath $item.FullName -Destination $targetAddon -Recurse -Force
    }
}

function Set-ProjectPort {
    $projectFile = Join-Path $ProjectPath 'project.godot'
    $content = [IO.File]::ReadAllText($projectFile)
    $bom = $false
    while ($content.Length -gt 0 -and $content[0] -eq [char]0xFEFF) {
        $bom = $true
        $content = $content.Substring(1)
    }
    $newline = if ($content.Contains("`r`n")) { "`r`n" } else { "`n" }
    $normalized = $content.Replace("`r`n", "`n")
    $lines = [Collections.Generic.List[string]]($normalized -split "`n", -1)
    $start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*\[godot_mcp\]\s*$') { $start = $i; break }
    }
    if ($start -lt 0) {
        if ($normalized.Length -gt 0 -and -not $normalized.EndsWith("`n")) { $normalized += "`n" }
        $normalized += "[godot_mcp]`n`nbridge_port=$Port`n"
    } else {
        $end = $lines.Count
        for ($i = $start + 1; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^\s*\[[^\]]+\]\s*$') { $end = $i; break }
        }
        $found = $false
        for ($i = $start + 1; $i -lt $end; $i++) {
            if ($lines[$i] -match '^\s*bridge_port\s*=') {
                $lines[$i] = "bridge_port=$Port"
                $found = $true
            }
        }
        if (-not $found) { $lines.Insert($start + 1, "bridge_port=$Port") }
        $normalized = [string]::Join("`n", $lines)
    }
    $output = $normalized.Replace("`n", $newline)
    if ($bom) { $output = [char]0xFEFF + $output }
    $encoding = New-Object System.Text.UTF8Encoding($false)
    if ($bom) { $encoding = New-Object System.Text.UTF8Encoding($true) }
    [IO.File]::WriteAllText($projectFile, $output, $encoding)
}

function Resolve-ConfigPath {
    if ($McpConfigPath) {
        return [IO.Path]::GetFullPath($McpConfigPath)
    }
    return Join-Path $ProjectPath '.godot-mcp/mcp-config.json'
}

function Write-McpConfig([string]$OutputPath) {
    $parent = Split-Path -Parent $OutputPath
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    $config = [ordered]@{
        mcpServers = [ordered]@{
            'godot-mcp-pro' = [ordered]@{
                command = 'node'
                args = @((Join-Path $RootDir 'dist/src/main.js'))
                env = [ordered]@{
                    GODOT_MCP_PRO_PORT = [string]$Port
                    GODOT_MCP_PRO_STATE_DIR = (Join-Path $ProjectPath '.godot-mcp')
                }
            }
        }
    }
    $json = $config | ConvertTo-Json -Depth 5
    [IO.File]::WriteAllText($OutputPath, "$json`n", (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "MCP config fragment: $OutputPath"
}

function Register-Project {
    New-Item -ItemType Directory -Path (Split-Path -Parent $RegistrationFile) -Force | Out-Null
    $registered = @()
    if (Test-Path -LiteralPath $RegistrationFile -PathType Leaf) { $registered = @(Get-Content -LiteralPath $RegistrationFile) }
    if ($registered -notcontains $ProjectPath) { Add-Content -LiteralPath $RegistrationFile -Value $ProjectPath -Encoding UTF8 }
}

function Test-PortOccupied([int]$CheckPort) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync('127.0.0.1', $CheckPort)
        if ($task.Wait(500) -and $client.Connected) { return $true }
        return $task.Status -ne 'RanToCompletion'
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

function Run-Doctor {
    $failures = 0
    foreach ($tool in @('node', 'npm', 'git')) {
        if (Get-Command $tool -CommandType Application -ErrorAction SilentlyContinue) { Write-Host "[ok] $tool" } else { Write-Host "[fail] $tool is missing"; $failures++ }
    }
    & git -C $RootDir submodule status -- $SubmoduleDir *> $null
    if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $AddonSource -PathType Container)) {
        Write-Host "[ok] addon submodule and source: $AddonSource"
    } else {
        Write-Host '[fail] addon submodule/source is unavailable'; $failures++
    }
    if (Test-Path -LiteralPath (Join-Path $RootDir 'dist/src/main.js') -PathType Leaf) { Write-Host '[ok] bridge build entry' } else { Write-Host '[fail] bridge build entry is missing: dist/src/main.js'; $failures++ }
    Resolve-Project
    if ($ProjectPath) {
        if (Test-Path -LiteralPath (Join-Path $ProjectPath 'project.godot') -PathType Leaf) { Write-Host "[ok] target project: $ProjectPath" } else { Write-Host '[fail] target project.godot is missing'; $failures++ }
        if (Test-Path -LiteralPath (Join-Path $ProjectPath 'addons/godot_mcp') -PathType Container) { Write-Host '[ok] target addon' } else { Write-Host '[fail] target addon is missing'; $failures++ }
        $outputPath = Resolve-ConfigPath
        if (Test-Path -LiteralPath $outputPath -PathType Leaf) { Write-Host "[info] MCP config fragment: $outputPath"; Get-Content -LiteralPath $outputPath } else { Write-Host "[info] MCP config fragment not generated: $outputPath" }
    } else {
        Write-Host '[info] no target project supplied or registered'
    }
    $stateDir = if ($ProjectPath) { Join-Path $ProjectPath '.godot-mcp' } else { Join-Path $RootDir '.godot-mcp' }
    $logFile = Join-Path $stateDir "logs/bridge-$Port.jsonl"
    $artifactDir = Join-Path $stateDir 'artifacts'
    Write-Host "[info] state_dir: $stateDir"
    Write-Host "[info] log_file: $logFile"
    Write-Host "[info] artifact_dir: $artifactDir"
    if (Test-Path -LiteralPath $logFile -PathType Leaf) {
        $recentErrors = @(Get-Content -LiteralPath $logFile -Tail 50 | ForEach-Object {
            try { $entry = $_ | ConvertFrom-Json; if ($entry.direction -eq 'error') { $entry } } catch { }
        } | Select-Object -Last 10)
        if ($recentErrors.Count -gt 0) {
            Write-Host '[info] recent_errors:'
            $recentErrors | ForEach-Object { Write-Host (($_ | ConvertTo-Json -Compress)) }
        }
    }
    $state = if (Test-PortOccupied $Port) { 'occupied' } else { 'free' }
    $level = if ($state -eq 'occupied') { 'warning' } else { 'ok' }
    Write-Host "[$level] 127.0.0.1:$Port ($state)"
    if ($failures -gt 0) { throw "doctor found $failures failure(s)" }
}

if ($Help) { Show-Usage; exit 0 }
if ($Port -lt 6505 -or $Port -gt 6509) { Fail 'port must be between 6505 and 6509' }

try {
    Require-Tools
    switch ($Command) {
        'install' {
            Resolve-Project
            if (-not $ProjectPath) { Fail 'install needs -ProjectPath or a current directory containing project.godot' }
            if (-not (Test-Path -LiteralPath (Join-Path $ProjectPath 'project.godot') -PathType Leaf)) { Fail "project.godot is missing: $ProjectPath" }
            Ensure-Submodule
            Update-From-Upstream
            Build-Bridge
            Copy-Addon
            Set-ProjectPort
            Write-McpConfig (Resolve-ConfigPath)
            Register-Project
            Write-Host "installed addon and bridge port $Port in $ProjectPath"
        }
        'update' {
            Ensure-Submodule
            Update-From-Upstream
            Build-Bridge
            Resolve-Project
            if ($ProjectPath) {
                if (-not (Test-Path -LiteralPath (Join-Path $ProjectPath 'project.godot') -PathType Leaf)) { Fail "project.godot is missing: $ProjectPath" }
                Copy-Addon
                Set-ProjectPort
                Write-McpConfig (Resolve-ConfigPath)
                Register-Project
                Write-Host "updated target project: $ProjectPath"
            } else {
                Write-Host 'updated bridge and submodule; no target project supplied or registered'
            }
        }
        'doctor' { Run-Doctor }
    }
    exit 0
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
