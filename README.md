# Godot MCP Pro

给 Agent 的安装和使用说明。

## 1. 一键安装

要求 Node.js 18+、Git；目标 Godot 项目必须包含 `project.godot`。

Windows PowerShell：

```powershell
.\scripts\godot-mcp.ps1 install -ProjectPath C:\Games\GameA -Port 6505 -Yes
```

POSIX shell：

```bash
./scripts/godot-mcp.sh install --project-path ~/Games/GameA --port 6505 --yes
```

脚本会初始化 addon submodule、安装 npm 依赖、构建 bridge、复制 addon、写入项目端口，并生成：

```text
<GameA>/.godot-mcp/mcp-config.json
```

手动安装或排查：

```bash
git submodule update --init --recursive
npm ci
npm run build
npm test
```

MCP 入口：

```text
dist/src/main.js
```

## 2. 配置 MCP 客户端

将以下配置合并到 MCP 客户端配置中，并按实际路径修改 `args`：

```json
{
  "mcpServers": {
    "godot-mcp-pro": {
      "command": "node",
      "args": ["C:/Godot/MCP/godot-mcp-pro/dist/src/main.js"],
      "env": {
        "GODOT_MCP_PRO_PORT": "6505"
      }
    }
  }
}
```

不要把日志写入 stdout；stdout 用于 MCP 通信。

## 3. Godot addon

插件通过 Git submodule 引入：

```text
vendor/godot-mcp-addon/addons/godot_mcp
```

同步 fork 的上游更新：

```bash
git -C vendor/godot-mcp-addon remote add upstream https://github.com/youichi-uda/godot-mcp-pro.git
git -C vendor/godot-mcp-addon fetch upstream
git -C vendor/godot-mcp-addon merge upstream/master
git add vendor/godot-mcp-addon
git commit -m "同步 Godot addon 上游更新"
```

## 4. 配置 Godot

`godot-mcp-pro` 是 Godot Editor 插件。Bridge 不会启动 Godot，Godot 插件也不会启动 Bridge。

在目标 Godot 项目中：

1. `install`/`update` 会将 `vendor/godot-mcp-addon/addons/godot_mcp` 复制到目标项目的 `addons/godot_mcp`。
2. 打开项目。
3. 在 `Project > Project Settings > Plugins` 启用 `Godot MCP Pro`。
4. 项目设置 `godot_mcp/bridge_port` 必须与 MCP 配置中的 `GODOT_MCP_PRO_PORT` 一致。

插件只连接项目设置指定的一个端口，默认 `6505`，可用范围 `6505-6509`。

## 5. 启动顺序

```text
1. 运行 install 脚本
2. 启动目标 Godot 项目并启用 Godot MCP Pro 插件
3. 将 .godot-mcp/mcp-config.json 合并到 MCP 客户端配置
4. MCP 客户端启动 dist/src/main.js
5. Agent 通过 MCP 使用 174 个 Godot 工具
```

多项目使用不同端口：

```powershell
.\scripts\godot-mcp.ps1 install -ProjectPath C:\Games\GameA -Port 6505 -Yes
.\scripts\godot-mcp.ps1 install -ProjectPath C:\Games\GameB -Port 6506 -Yes
```

更新 bridge；指定 `ProjectPath` 时同步该 Godot 项目：

```powershell
.\scripts\godot-mcp.ps1 update
# 需要同步 addon fork 的 upstream/master 时：
.\scripts\godot-mcp.ps1 update -AddonUpstream
```

POSIX shell 使用同名命令和长参数：

```bash
./scripts/godot-mcp.sh update
./scripts/godot-mcp.sh doctor
```

手动启动 Bridge：

```bash
GODOT_MCP_PRO_PORT=6505 node dist/src/main.js
```

PowerShell：

```powershell
$env:GODOT_MCP_PRO_PORT = "6505"
node dist/src/main.js
```

可配置环境变量：

```text
GODOT_MCP_PRO_HOST                  默认 127.0.0.1
GODOT_MCP_PRO_PORT                  默认 6505，范围 6505-6509
GODOT_MCP_PRO_CONNECTION_TIMEOUT   默认 10000 ms
GODOT_MCP_PRO_REQUEST_TIMEOUT       默认 30000 ms
GODOT_MCP_PRO_LOG_LEVEL             silent/error/info/debug，默认 error
```

## 6. Agent 工作流

先探索，再修改：

```text
get_project_info
get_filesystem_tree
get_project_settings
get_scene_tree
```

创建或修改场景：

```text
create_scene
add_node / add_scene_instance
update_property / add_resource
attach_script
save_scene
```

运行和调试：

```text
play_scene
get_game_screenshot
simulate_action / simulate_key
get_game_scene_tree
get_game_node_properties
get_editor_errors
stop_scene
```

规则：

- 修改场景后调用 `save_scene`。
- 运行时工具先调用 `play_scene`。
- 不要直接编辑 `project.godot`，使用项目设置工具。
- 删除、批量修改或执行脚本前确认目标和副作用。
- CLI 不提供通用 `call`、`invoke` 或 `exec`；Agent 使用 MCP 工具。

## 7. 诊断和 CLI

一键诊断：

```powershell
.\scripts\godot-mcp.ps1 doctor -ProjectPath C:\Games\GameA -Port 6505
```

```bash
./scripts/godot-mcp.sh doctor --project-path ~/Games/GameA --port 6505
```

CLI 只提供显式领域别名：

```bash
node dist/src/main.js --help
node dist/src/main.js --version
node dist/src/main.js status --json
node dist/src/main.js doctor --json
node dist/src/main.js project info --json
node dist/src/main.js project tree --json
```

## 8. 故障排查

### 未连接 Godot

检查：

- Godot 项目已打开。
- `Godot MCP Pro` 插件已启用。
- Bridge 与 MCP 客户端使用同一个端口。
- 端口在 `6505-6509` 范围内。

### 端口被占用

使用其他端口，例如：

```powershell
$env:GODOT_MCP_PRO_PORT = "6506"
node dist/src/main.js
```

然后在 MCP 客户端配置中使用相同的端口。

### 构建失败

```bash
node --version
npm ci
npm run build
```

### 验证插件

使用隔离测试项目：

```text
fixture-project/project.godot
```

该项目已启用 `Godot MCP Pro` 插件，可用于验证连接和工具调用。
