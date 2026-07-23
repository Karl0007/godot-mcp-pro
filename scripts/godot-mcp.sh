#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
SUBMODULE_DIR="$ROOT_DIR/vendor/godot-mcp-addon"
ADDON_SOURCE="$SUBMODULE_DIR/addons/godot_mcp"
REGISTRATION_FILE="$ROOT_DIR/.godot-mcp/projects.txt"
PROJECT_PATH=""
PORT=6505
MCP_CONFIG_PATH=""
COMMAND=""
ADDON_UPSTREAM=0
ASSUME_YES=0

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage: godot-mcp.sh [install|update|doctor] [options]

Options:
  --project-path PATH   Godot project directory (defaults to the current project)
  --port PORT           Bridge port, 6505-6509 (default: 6505)
  --mcp-config PATH     MCP JSON fragment output path
  --addon-upstream      Fetch upstream/master and merge it in the addon submodule
  --yes                 Replace an existing target addon without prompting
  --help                Show this help
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    install|update|doctor)
      [ -z "$COMMAND" ] || fail "only one command may be specified"
      COMMAND=$1
      ;;
    --project-path|-ProjectPath|--ProjectPath)
      [ "$#" -ge 2 ] || fail "$1 requires a path"
      PROJECT_PATH=$2
      shift
      ;;
    --project-path=*|--ProjectPath=*|-ProjectPath=*) PROJECT_PATH=${1#*=} ;;
    --port|-Port|--Port)
      [ "$#" -ge 2 ] || fail "$1 requires a value"
      PORT=$2
      shift
      ;;
    --port=*|--Port=*|-Port=*) PORT=${1#*=} ;;
    --mcp-config|-McpConfigPath|--McpConfigPath)
      [ "$#" -ge 2 ] || fail "$1 requires a path"
      MCP_CONFIG_PATH=$2
      shift
      ;;
    --mcp-config=*|--McpConfigPath=*|-McpConfigPath=*) MCP_CONFIG_PATH=${1#*=} ;;
    --addon-upstream|-AddonUpstream) ADDON_UPSTREAM=1 ;;
    --yes|-Yes) ASSUME_YES=1 ;;
    --help|-Help|-h) usage; exit 0 ;;
    *) fail "unknown argument: $1" ;;
  esac
  shift
done

[ -n "$COMMAND" ] || COMMAND=install
case "$PORT" in
  ''|*[!0-9]*) fail "port must be an integer between 6505 and 6509" ;;
esac
[ "$PORT" -ge 6505 ] && [ "$PORT" -le 6509 ] || fail "port must be between 6505 and 6509"

require_tools() {
  command -v node >/dev/null 2>&1 || fail "node is required"
  command -v npm >/dev/null 2>&1 || fail "npm is required"
  command -v git >/dev/null 2>&1 || fail "git is required"
}

resolve_path() {
  if [ -n "$1" ]; then
    if [ -d "$1" ]; then
      CDPATH= cd -- "$1" && pwd -P
    else
      fail "directory does not exist: $1"
    fi
  else
    if [ -f "$(pwd)/project.godot" ]; then
      pwd -P
    else
      printf ''
    fi
  fi
}

registered_project() {
  [ -f "$REGISTRATION_FILE" ] || return 0
  while IFS= read -r candidate; do
    [ -n "$candidate" ] || continue
    if [ -f "$candidate/project.godot" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done < "$REGISTRATION_FILE"
}

resolve_project() {
  if [ -n "$PROJECT_PATH" ]; then
    PROJECT_PATH=$(resolve_path "$PROJECT_PATH")
  elif [ -f "$(pwd)/project.godot" ]; then
    PROJECT_PATH=$(pwd -P)
  else
    PROJECT_PATH=$(registered_project || true)
  fi
}

ensure_submodule() {
  git -C "$ROOT_DIR" submodule update --init --recursive
  [ -d "$ADDON_SOURCE" ] || fail "addon source is missing: $ADDON_SOURCE"
}

update_from_upstream() {
  [ "$ADDON_UPSTREAM" -eq 1 ] || return 0
  if ! git -C "$SUBMODULE_DIR" config --get remote.upstream.url >/dev/null 2>&1; then
    git -C "$SUBMODULE_DIR" remote add upstream https://github.com/youichi-uda/godot-mcp-pro.git
  fi
  git -C "$SUBMODULE_DIR" fetch upstream master
  if ! git -C "$SUBMODULE_DIR" merge --ff-only upstream/master; then
    git -C "$SUBMODULE_DIR" merge --no-edit upstream/master
  fi
  printf 'addon submodule now points to %s\n' "$(git -C "$SUBMODULE_DIR" rev-parse --short HEAD)"
}

build_bridge() {
  (
    CDPATH= cd -- "$ROOT_DIR"
    npm ci
    npm run build
  )
}

confirm_addon_copy() {
  [ -d "$1" ] || return 0
  printf 'WARNING: existing addon directory will be overwritten: %s\n' "$1" >&2
  if [ "$ASSUME_YES" -eq 1 ]; then return 0; fi
  if [ ! -t 0 ]; then fail "refusing to overwrite an existing addon without --yes"; fi
  printf 'Continue? [y/N] ' >&2
  IFS= read -r answer || answer=""
  case "$answer" in y|Y|yes|YES) ;; *) fail "addon copy cancelled" ;; esac
}

copy_addon() {
  target_addon="$PROJECT_PATH/addons/godot_mcp"
  confirm_addon_copy "$target_addon"
  mkdir -p "$PROJECT_PATH/addons" "$target_addon"
  cp -R "$ADDON_SOURCE/." "$target_addon/"
}

set_project_port() {
  node - "$1/project.godot" "$PORT" <<'NODE'
const fs = require('node:fs');
const path = process.argv[2];
const port = process.argv[3];
let text = fs.readFileSync(path, 'utf8');
const bom = text.startsWith('\ufeff') ? '\ufeff' : '';
if (bom) text = text.slice(1);
const newline = text.includes('\r\n') ? '\r\n' : '\n';
let normalized = text.replace(/\r\n/g, '\n');
const lines = normalized.split('\n');
let start = -1;
for (let i = 0; i < lines.length; i += 1) {
  if (/^\s*\[godot_mcp\]\s*$/.test(lines[i])) { start = i; break; }
}
if (start < 0) {
  if (normalized.length > 0 && !normalized.endsWith('\n')) normalized += '\n';
  normalized += `[godot_mcp]\n\nbridge_port=${port}\n`;
} else {
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^\s*\[[^\]]+\]\s*$/.test(lines[i])) { end = i; break; }
  }
  let found = false;
  for (let i = start + 1; i < end; i += 1) {
    if (/^\s*bridge_port\s*=/.test(lines[i])) {
      lines[i] = `bridge_port=${port}`;
      found = true;
    }
  }
  if (!found) lines.splice(start + 1, 0, `bridge_port=${port}`);
  normalized = lines.join('\n');
}
fs.writeFileSync(path, bom + normalized.replace(/\n/g, newline), 'utf8');
NODE
}

write_mcp_config() {
  output_path=$1
  mkdir -p "$(dirname -- "$output_path")"
  node - "$output_path" "$ROOT_DIR/dist/src/main.js" "$PORT" "$PROJECT_PATH" <<'NODE'
const fs = require('node:fs');
const path = process.argv[2];
const entry = process.argv[3];
const port = process.argv[4];
const project = process.argv[5];
const config = {mcpServers: {'godot-mcp-pro': {command: 'node', args: [entry], env: {GODOT_MCP_PRO_PORT: String(port), GODOT_MCP_PRO_STATE_DIR: `${project}/.godot-mcp`}}}};
fs.writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
NODE
  printf 'MCP config fragment: %s\n' "$output_path"
}

register_project() {
  mkdir -p "$(dirname -- "$REGISTRATION_FILE")"
  if [ ! -f "$REGISTRATION_FILE" ] || ! grep -Fqx -- "$PROJECT_PATH" "$REGISTRATION_FILE"; then
    printf '%s\n' "$PROJECT_PATH" >> "$REGISTRATION_FILE"
  fi
}

port_state() {
  node - "$1" <<'NODE'
const net = require('node:net');
const port = Number(process.argv[2]);
const socket = net.createConnection({host: '127.0.0.1', port});
let done = false;
const finish = (state) => { if (!done) { done = true; process.stdout.write(`${state}\n`); socket.destroy(); } };
socket.once('connect', () => finish('occupied'));
socket.once('error', () => finish('free'));
socket.setTimeout(500, () => finish('occupied'));
NODE
}

run_doctor() {
  failures=0
  for tool in node npm git; do
    if command -v "$tool" >/dev/null 2>&1; then printf '[ok] %s\n' "$tool"; else printf '[fail] %s is missing\n' "$tool"; failures=$((failures + 1)); fi
  done
  if git -C "$ROOT_DIR" submodule status -- "$SUBMODULE_DIR" >/dev/null 2>&1 && [ -d "$ADDON_SOURCE" ]; then
    printf '[ok] addon submodule and source: %s\n' "$ADDON_SOURCE"
  else
    printf '[fail] addon submodule/source is unavailable\n'
    failures=$((failures + 1))
  fi
  if [ -f "$ROOT_DIR/dist/src/main.js" ]; then printf '[ok] bridge build entry\n'; else printf '[fail] bridge build entry is missing: dist/src/main.js\n'; failures=$((failures + 1)); fi
  resolve_project
  if [ -n "$PROJECT_PATH" ]; then
    if [ -f "$PROJECT_PATH/project.godot" ]; then printf '[ok] target project: %s\n' "$PROJECT_PATH"; else printf '[fail] target project.godot is missing\n'; failures=$((failures + 1)); fi
    if [ -d "$PROJECT_PATH/addons/godot_mcp" ]; then printf '[ok] target addon\n'; else printf '[fail] target addon is missing\n'; failures=$((failures + 1)); fi
    output_path=$MCP_CONFIG_PATH
    [ -n "$output_path" ] || output_path="$PROJECT_PATH/.godot-mcp/mcp-config.json"
    [ "${output_path#/}" = "$output_path" ] && case "$output_path" in [A-Za-z]:/*) ;; *) output_path="$PROJECT_PATH/$output_path" ;; esac
    if [ -f "$output_path" ]; then printf '[info] MCP config fragment: %s\n' "$output_path"; cat "$output_path"; else printf '[info] MCP config fragment not generated: %s\n' "$output_path"; fi
  else
    printf '[info] no target project supplied or registered\n'
  fi
  if [ -n "$PROJECT_PATH" ]; then state_dir="$PROJECT_PATH/.godot-mcp"; else state_dir="$ROOT_DIR/.godot-mcp"; fi
  log_file="$state_dir/logs/bridge-$PORT.jsonl"
  artifact_dir="$state_dir/artifacts"
  printf '[info] state_dir: %s\n' "$state_dir"
  printf '[info] log_file: %s\n' "$log_file"
  printf '[info] artifact_dir: %s\n' "$artifact_dir"
  if [ -f "$log_file" ]; then
    recent_errors=$(grep '"direction":"error"' "$log_file" | tail -10 || true)
    if [ -n "$recent_errors" ]; then
      printf '[info] recent_errors:\n%s\n' "$recent_errors"
    fi
  fi
  state=$(port_state "$PORT")
  printf '[%s] 127.0.0.1:%s (%s)\n' "$([ "$state" = occupied ] && printf warning || printf ok)" "$PORT" "$state"
  [ "$failures" -eq 0 ]
}

require_tools
case "$COMMAND" in
  install)
    resolve_project
    [ -n "$PROJECT_PATH" ] || fail 'install needs --project-path or a current directory containing project.godot'
    [ -f "$PROJECT_PATH/project.godot" ] || fail "project.godot is missing: $PROJECT_PATH"
    ensure_submodule
    update_from_upstream
    build_bridge
    copy_addon
    set_project_port "$PROJECT_PATH"
    output_path=$MCP_CONFIG_PATH
    [ -n "$output_path" ] || output_path="$PROJECT_PATH/.godot-mcp/mcp-config.json"
    [ "${output_path#/}" = "$output_path" ] && case "$output_path" in [A-Za-z]:/*) ;; *) output_path="$PROJECT_PATH/$output_path" ;; esac
    write_mcp_config "$output_path"
    register_project
    printf 'installed addon and bridge port %s in %s\n' "$PORT" "$PROJECT_PATH"
    ;;
  update)
    ensure_submodule
    update_from_upstream
    build_bridge
    resolve_project
    if [ -n "$PROJECT_PATH" ]; then
      [ -f "$PROJECT_PATH/project.godot" ] || fail "project.godot is missing: $PROJECT_PATH"
      copy_addon
      set_project_port "$PROJECT_PATH"
      output_path=$MCP_CONFIG_PATH
      [ -n "$output_path" ] || output_path="$PROJECT_PATH/.godot-mcp/mcp-config.json"
      [ "${output_path#/}" = "$output_path" ] && case "$output_path" in [A-Za-z]:/*) ;; *) output_path="$PROJECT_PATH/$output_path" ;; esac
      write_mcp_config "$output_path"
      register_project
      printf 'updated target project: %s\n' "$PROJECT_PATH"
    else
      printf 'updated bridge and submodule; no target project supplied or registered\n'
    fi
    ;;
  doctor) run_doctor ;;
esac
