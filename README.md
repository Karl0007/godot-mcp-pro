# Godot MCP Pro Bridge

给 Agent 的安装和使用说明。

## 1. 安装

要求 Node.js 18+。

```bash
cd C:/Godot/MCP/godot-mcp-pro-bridge
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
      "args": ["C:/Godot/MCP/godot-mcp-pro-bridge/dist/src/main.js"],
      "env": {
        "GODOT_MCP_PRO_PORT": "6505"
      }
    }
  }
}
```

不要把日志写入 stdout；stdout 用于 MCP 通信。

## 3. 配置 Godot

`godot-mcp-pro` 是 Godot Editor 插件。Bridge 不会启动 Godot，Godot 插件也不会启动 Bridge。

在目标 Godot 项目中：

1. 将 `addons/godot_mcp` 放入项目的 `addons/` 目录。
2. 打开项目。
3. 在 `Project > Project Settings > Plugins` 启用 `Godot MCP Pro`。
4. 保持 MCP 客户端中的 `GODOT_MCP_PRO_PORT` 与 Bridge 端口一致。

插件会连接本机 `127.0.0.1:6505-6514`。Bridge 实例可使用 `6505-6509`，每个 Bridge 实例使用不同端口。

## 4. 启动顺序

```text
1. 启动 Godot 项目并启用 Godot MCP Pro 插件
2. 启动 MCP 客户端
3. MCP 客户端启动 dist/src/main.js
4. Agent 通过 MCP 使用 174 个 Godot 工具
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

## 5. Agent 工作流

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

## 6. CLI 检查

CLI 只提供显式领域别名：

```bash
node dist/src/main.js --help
node dist/src/main.js --version
node dist/src/main.js status --json
node dist/src/main.js doctor --json
node dist/src/main.js project info --json
node dist/src/main.js project tree --json
```

## 7. 故障排查

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
