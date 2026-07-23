// Generated from C:/Godot/MCP/godot-mcp-pro/addons/godot_mcp/commands by scripts/generate-manifest.ts.
import type { ToolManifestEntry } from './manifest.js';

export const GENERATED_TOOL_MANIFEST: readonly ToolManifestEntry[] = [
  {
    "name": "add_animation_track",
    "description": "Add animation track",
    "inputSchema": {
      "type": "object",
      "properties": {
        "track_type": {
          "type": "string"
        },
        "update_mode": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "animation": {
          "type": "string"
        },
        "track_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "animation",
        "track_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_audio_bus",
    "description": "Add audio bus",
    "inputSchema": {
      "type": "object",
      "properties": {
        "volume_db": {
          "type": "number"
        },
        "solo": {
          "type": "boolean"
        },
        "mute": {
          "type": "boolean"
        },
        "at_position": {
          "type": "integer"
        },
        "send": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_audio_bus_effect",
    "description": "Add audio bus effect",
    "inputSchema": {
      "type": "object",
      "properties": {
        "params": {
          "type": "object",
          "additionalProperties": true
        },
        "room_size": {
          "type": "number"
        },
        "damping": {},
        "wet": {},
        "dry": {},
        "spread": {},
        "voice_count": {
          "type": "integer"
        },
        "tap1_active": {
          "type": "boolean"
        },
        "tap1_delay_ms": {
          "type": "number"
        },
        "tap1_level_db": {
          "type": "number"
        },
        "tap2_active": {
          "type": "boolean"
        },
        "tap2_delay_ms": {
          "type": "number"
        },
        "tap2_level_db": {
          "type": "number"
        },
        "threshold": {
          "type": "integer"
        },
        "ratio": {},
        "attack_us": {
          "type": "number"
        },
        "release_ms": {
          "type": "number"
        },
        "gain": {},
        "mix": {},
        "ceiling_db": {
          "type": "number"
        },
        "threshold_db": {
          "type": "number"
        },
        "soft_clip_db": {
          "type": "number"
        },
        "soft_clip_ratio": {
          "type": "number"
        },
        "range_min_hz": {
          "type": "number"
        },
        "range_max_hz": {
          "type": "number"
        },
        "rate_hz": {
          "type": "number"
        },
        "feedback": {},
        "depth": {},
        "mode": {
          "type": "string"
        },
        "pre_gain": {
          "type": "number"
        },
        "post_gain": {
          "type": "number"
        },
        "keep_hf_hz": {
          "type": "number"
        },
        "drive": {},
        "cutoff_hz": {
          "type": "number"
        },
        "resonance": {},
        "volume_db": {
          "type": "number"
        },
        "at_position": {
          "type": "integer"
        },
        "bus": {
          "type": "string"
        },
        "effect_type": {
          "type": "string"
        }
      },
      "required": [
        "bus",
        "effect_type"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_audio_player",
    "description": "Add audio player",
    "inputSchema": {
      "type": "object",
      "properties": {
        "volume_db": {
          "type": "number"
        },
        "autoplay": {
          "type": "boolean"
        },
        "max_distance": {
          "type": "number"
        },
        "attenuation": {
          "type": "number"
        },
        "attenuation_model": {
          "type": "integer"
        },
        "unit_size": {
          "type": "number"
        },
        "type": {
          "type": "string"
        },
        "stream": {
          "type": "string"
        },
        "bus": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_autoload",
    "description": "Add autoload",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_gridmap",
    "description": "Add gridmap",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mesh_library_path": {
          "type": "string"
        },
        "cell_size": {
          "type": "object",
          "additionalProperties": true
        },
        "cells": {
          "type": "array",
          "items": {}
        },
        "parent_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "position": {
          "type": "object",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_mesh_instance",
    "description": "Add mesh instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mesh_properties": {
          "type": "object",
          "additionalProperties": true
        },
        "parent_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "mesh_type": {
          "type": "string"
        },
        "mesh_file": {
          "type": "string"
        },
        "position": {
          "type": "object",
          "additionalProperties": true
        },
        "rotation": {
          "type": "object",
          "additionalProperties": true
        },
        "scale": {
          "type": "object",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_node",
    "description": "Add node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "object",
          "additionalProperties": true
        },
        "parent_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "type": {
          "type": "string"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "node",
        "add"
      ],
      "summary": "Add a node to the current scene"
    },
    "risk": "write"
  },
  {
    "name": "add_raycast",
    "description": "Add raycast",
    "inputSchema": {
      "type": "object",
      "properties": {
        "target_x": {
          "type": "number"
        },
        "target_y": {
          "type": "number"
        },
        "target_z": {
          "type": "number"
        },
        "dimension": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "enabled": {
          "type": "boolean"
        },
        "collision_mask": {
          "type": "integer"
        },
        "collide_with_areas": {
          "type": "boolean"
        },
        "collide_with_bodies": {
          "type": "boolean"
        },
        "hit_from_inside": {
          "type": "boolean"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_resource",
    "description": "Add resource",
    "inputSchema": {
      "type": "object",
      "properties": {
        "resource_properties": {
          "type": "object",
          "additionalProperties": true
        },
        "node_path": {
          "type": "string"
        },
        "property": {
          "type": "string"
        },
        "resource_type": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "property",
        "resource_type"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_scene_instance",
    "description": "Add scene instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "scene_path": {
          "type": "string"
        }
      },
      "required": [
        "scene_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_state_machine_state",
    "description": "Add state machine state",
    "inputSchema": {
      "type": "object",
      "properties": {
        "position_x": {
          "type": "number"
        },
        "position_y": {
          "type": "number"
        },
        "state_machine_path": {
          "type": "string"
        },
        "state_type": {
          "type": "string"
        },
        "animation": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "state_name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "state_name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "add_state_machine_transition",
    "description": "Add state machine transition",
    "inputSchema": {
      "type": "object",
      "properties": {
        "xfade_time": {
          "type": "number"
        },
        "state_machine_path": {
          "type": "string"
        },
        "switch_mode": {
          "type": "string"
        },
        "advance_mode": {
          "type": "string"
        },
        "advance_expression": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "from_state": {
          "type": "string"
        },
        "to_state": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "from_state",
        "to_state"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "analyze_scene_complexity",
    "description": "Analyze scene complexity",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "analyze_signal_flow",
    "description": "Analyze signal flow",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "apply_particle_preset",
    "description": "Apply particle preset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "preset": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "preset"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "assert_node_state",
    "description": "Assert node state",
    "inputSchema": {
      "type": "object",
      "properties": {
        "expected": {},
        "operator": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "property": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "property",
        "expected"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "assert_screen_text",
    "description": "Assert screen text",
    "inputSchema": {
      "type": "object",
      "properties": {
        "partial": {
          "type": "boolean"
        },
        "case_sensitive": {
          "type": "boolean"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "assign_shader_material",
    "description": "Assign shader material",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "shader_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "shader_path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "attach_script",
    "description": "Attach script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "script_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "script_path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "bake_navigation_mesh",
    "description": "Bake navigation mesh",
    "inputSchema": {
      "type": "object",
      "properties": {
        "outline": {
          "type": "array",
          "items": {}
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "batch_add_nodes",
    "description": "Batch add nodes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "nodes": {
          "type": "array",
          "items": {}
        }
      },
      "required": [
        "nodes"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "batch_get_properties",
    "description": "Batch get properties",
    "inputSchema": {
      "type": "object",
      "properties": {
        "nodes": {
          "type": "array",
          "items": {}
        }
      },
      "required": [
        "nodes"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "batch_set_property",
    "description": "Batch set property",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "property": {
          "type": "string"
        }
      },
      "required": [
        "type",
        "property",
        "value"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "capture_frames",
    "description": "Capture frames",
    "inputSchema": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "frame_interval": {
          "type": "integer"
        },
        "half_resolution": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "clear_editor_selection",
    "description": "Clear editor selection",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "clear_output",
    "description": "Clear output",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "click_button_by_text",
    "description": "Click button by text",
    "inputSchema": {
      "type": "object",
      "properties": {
        "partial": {
          "type": "boolean"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "compare_screenshots",
    "description": "Compare screenshots",
    "inputSchema": {
      "type": "object",
      "properties": {
        "threshold": {
          "type": "integer"
        },
        "image_a": {
          "type": "string"
        },
        "image_b": {
          "type": "string"
        }
      },
      "required": [
        "image_a",
        "image_b"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "connect_signal",
    "description": "Connect signal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deferred": {
          "type": "boolean"
        },
        "one_shot": {
          "type": "boolean"
        },
        "source_path": {
          "type": "string"
        },
        "signal_name": {
          "type": "string"
        },
        "target_path": {
          "type": "string"
        },
        "method_name": {
          "type": "string"
        }
      },
      "required": [
        "source_path",
        "signal_name",
        "target_path",
        "method_name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "create_animation",
    "description": "Create animation",
    "inputSchema": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "loop_mode": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "create_animation_tree",
    "description": "Create animation tree",
    "inputSchema": {
      "type": "object",
      "properties": {
        "anim_player": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "create_particles",
    "description": "Create particles",
    "inputSchema": {
      "type": "object",
      "properties": {
        "lifetime": {
          "type": "number"
        },
        "explosiveness": {
          "type": "number"
        },
        "randomness": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "is_3d": {
          "type": "boolean"
        },
        "amount": {
          "type": "integer"
        },
        "one_shot": {
          "type": "boolean"
        },
        "emitting": {
          "type": "boolean"
        },
        "parent_path": {
          "type": "string"
        }
      },
      "required": [
        "parent_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "create_resource",
    "description": "Create resource",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "object",
          "additionalProperties": true
        },
        "overwrite": {
          "type": "boolean"
        },
        "path": {
          "type": "string"
        },
        "type": {
          "type": "string"
        }
      },
      "required": [
        "path",
        "type"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "create_scene",
    "description": "Create scene",
    "inputSchema": {
      "type": "object",
      "properties": {
        "root_type": {
          "type": "string"
        },
        "root_name": {
          "type": "string"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "create"
      ],
      "summary": "Create a scene"
    },
    "risk": "write"
  },
  {
    "name": "create_script",
    "description": "Create script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string"
        },
        "extends": {
          "type": "string"
        },
        "class_name": {
          "type": "string"
        },
        "force": {
          "type": "boolean"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "script",
        "create"
      ],
      "summary": "Create a script"
    },
    "risk": "code"
  },
  {
    "name": "create_shader",
    "description": "Create shader",
    "inputSchema": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string"
        },
        "shader_type": {
          "type": "string"
        },
        "force": {
          "type": "boolean"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "create_theme",
    "description": "Create theme",
    "inputSchema": {
      "type": "object",
      "properties": {
        "default_font_size": {
          "type": "integer"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "cross_scene_set_property",
    "description": "Cross scene set property",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "path_filter": {
          "type": "string"
        },
        "exclude_addons": {
          "type": "boolean"
        },
        "force": {
          "type": "boolean"
        },
        "dry_run": {
          "type": "boolean"
        },
        "type": {
          "type": "string"
        },
        "property": {
          "type": "string"
        }
      },
      "required": [
        "type",
        "property",
        "value"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "delete_node",
    "description": "Delete node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "node",
        "delete"
      ],
      "summary": "Delete a node from the current scene"
    },
    "risk": "destructive"
  },
  {
    "name": "delete_scene",
    "description": "Delete scene",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "deploy_to_android",
    "description": "Deploy to android",
    "inputSchema": {
      "type": "object",
      "properties": {
        "preset_name": {
          "type": "string"
        },
        "preset_index": {
          "type": "integer"
        },
        "device_serial": {
          "type": "string"
        },
        "debug": {
          "type": "boolean"
        },
        "launch": {
          "type": "boolean"
        },
        "skip_export": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "detect_circular_dependencies",
    "description": "Detect circular dependencies",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "include_addons": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "disconnect_signal",
    "description": "Disconnect signal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "source_path": {
          "type": "string"
        },
        "signal_name": {
          "type": "string"
        },
        "target_path": {
          "type": "string"
        },
        "method_name": {
          "type": "string"
        }
      },
      "required": [
        "source_path",
        "signal_name",
        "target_path",
        "method_name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "duplicate_node",
    "description": "Duplicate node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "edit_resource",
    "description": "Edit resource",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "object",
          "additionalProperties": true
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path",
        "properties"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "edit_script",
    "description": "Edit script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "replacements": {
          "type": "array",
          "items": {}
        },
        "content": {
          "type": "string"
        },
        "start_line": {
          "type": "integer"
        },
        "end_line": {
          "type": "integer"
        },
        "insert_at_line": {
          "type": "integer"
        },
        "text": {
          "type": "string"
        },
        "force": {
          "type": "boolean"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "script",
        "edit"
      ],
      "summary": "Edit a script"
    },
    "risk": "code"
  },
  {
    "name": "edit_shader",
    "description": "Edit shader",
    "inputSchema": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string"
        },
        "replacements": {
          "type": "array",
          "items": {}
        },
        "force": {
          "type": "boolean"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "execute_editor_script",
    "description": "Execute editor script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "allow_unsafe_editor_io": {
          "type": "boolean"
        },
        "code": {
          "type": "string"
        }
      },
      "required": [
        "code"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "execute_game_script",
    "description": "Execute game script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        }
      },
      "required": [
        "code"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "export_project",
    "description": "Export project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "preset_index": {
          "type": "integer"
        },
        "preset_name": {
          "type": "string"
        },
        "debug": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "export",
        "project"
      ],
      "summary": "Prepare a project export"
    },
    "risk": "write"
  },
  {
    "name": "find_nearby_nodes",
    "description": "Find nearby nodes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "position": {
          "type": "object",
          "additionalProperties": true
        },
        "radius": {
          "type": "number"
        },
        "max_results": {
          "type": "integer"
        },
        "type_filter": {
          "type": "string"
        },
        "group_filter": {
          "type": "string"
        }
      },
      "required": [
        "position"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_node_references",
    "description": "Find node references",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pattern": {
          "type": "string"
        }
      },
      "required": [
        "pattern"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_nodes_by_script",
    "description": "Find nodes by script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "array",
          "items": {}
        },
        "script": {
          "type": "string"
        }
      },
      "required": [
        "script"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "find_nodes_by_type",
    "description": "Find nodes by type",
    "inputSchema": {
      "type": "object",
      "properties": {
        "recursive": {
          "type": "boolean"
        },
        "type": {
          "type": "string"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_nodes_in_group",
    "description": "Find nodes in group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group": {
          "type": "string"
        }
      },
      "required": [
        "group"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_script_references",
    "description": "Find script references",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "include_addons": {
          "type": "boolean"
        },
        "query": {
          "type": "string"
        }
      },
      "required": [
        "query"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "find_signal_connections",
    "description": "Find signal connections",
    "inputSchema": {
      "type": "object",
      "properties": {
        "signal_name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_ui_elements",
    "description": "Find ui elements",
    "inputSchema": {
      "type": "object",
      "properties": {
        "type_filter": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "find_unused_resources",
    "description": "Find unused resources",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "include_addons": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_android_preset_info",
    "description": "Get android preset info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "preset_name": {
          "type": "string"
        },
        "preset_index": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_animation_info",
    "description": "Get animation info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "animation": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "animation"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_animation_tree_structure",
    "description": "Get animation tree structure",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_audio_bus_layout",
    "description": "Get audio bus layout",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_audio_info",
    "description": "Get audio info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_autoload",
    "description": "Get autoload",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "array",
          "items": {}
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_collision_info",
    "description": "Get collision info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "include_children": {
          "type": "boolean"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_editor_camera",
    "description": "Get editor camera",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_editor_errors",
    "description": "Get editor errors",
    "inputSchema": {
      "type": "object",
      "properties": {
        "max_lines": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_editor_performance",
    "description": "Get editor performance",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_editor_screenshot",
    "description": "Get editor screenshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "save_path": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_editor_selection",
    "description": "Get editor selection",
    "inputSchema": {
      "type": "object",
      "properties": {
        "top_only": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_export_info",
    "description": "Get export info",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "export",
        "info"
      ],
      "summary": "Show export information"
    },
    "risk": "read"
  },
  {
    "name": "get_filesystem_tree",
    "description": "Get filesystem tree",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "filter": {
          "type": "string"
        },
        "max_depth": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "project",
        "tree"
      ],
      "summary": "Show the project filesystem tree"
    },
    "risk": "read"
  },
  {
    "name": "get_game_node_properties",
    "description": "Get game node properties",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "array",
          "items": {}
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "game",
        "inspect"
      ],
      "summary": "Inspect a running game node"
    },
    "risk": "read"
  },
  {
    "name": "get_game_scene_tree",
    "description": "Get game scene tree",
    "inputSchema": {
      "type": "object",
      "properties": {
        "script_filter": {
          "type": "string"
        },
        "type_filter": {
          "type": "string"
        },
        "named_only": {
          "type": "boolean"
        },
        "max_depth": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "game",
        "tree"
      ],
      "summary": "Show the running game scene tree"
    },
    "risk": "read"
  },
  {
    "name": "get_game_screenshot",
    "description": "Get game screenshot",
    "inputSchema": {
      "type": "object",
      "properties": {
        "save_path": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "game",
        "screenshot"
      ],
      "summary": "Capture the running game"
    },
    "risk": "read"
  },
  {
    "name": "get_input_actions",
    "description": "Get input actions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "filter": {
          "type": "string"
        },
        "include_builtin": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_navigation_info",
    "description": "Get navigation info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_node_groups",
    "description": "Get node groups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_node_properties",
    "description": "Get node properties",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "node",
        "get-property"
      ],
      "summary": "Read node properties"
    },
    "risk": "read"
  },
  {
    "name": "get_open_scripts",
    "description": "Get open scripts",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "get_output_log",
    "description": "Get output log",
    "inputSchema": {
      "type": "object",
      "properties": {
        "max_lines": {
          "type": "integer"
        },
        "filter": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_particle_info",
    "description": "Get particle info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_performance_monitors",
    "description": "Get performance monitors",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_physics_layers",
    "description": "Get physics layers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_project_info",
    "description": "Get project info",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "project",
        "info"
      ],
      "summary": "Show project information"
    },
    "risk": "read"
  },
  {
    "name": "get_project_settings",
    "description": "Get project settings",
    "inputSchema": {
      "type": "object",
      "properties": {
        "section": {
          "type": "string"
        },
        "key": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "project",
        "settings"
      ],
      "summary": "Show project settings"
    },
    "risk": "read"
  },
  {
    "name": "get_project_statistics",
    "description": "Get project statistics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "include_addons": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_resource_preview",
    "description": "Get resource preview",
    "inputSchema": {
      "type": "object",
      "properties": {
        "max_size": {
          "type": "integer"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_scene_dependencies",
    "description": "Get scene dependencies",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_scene_exports",
    "description": "Get scene exports",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_scene_file_content",
    "description": "Get scene file content",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_scene_tree",
    "description": "Get scene tree",
    "inputSchema": {
      "type": "object",
      "properties": {
        "max_depth": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "tree"
      ],
      "summary": "Show the current scene tree"
    },
    "risk": "read"
  },
  {
    "name": "get_shader_params",
    "description": "Get shader params",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "get_signals",
    "description": "Get signals",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_test_report",
    "description": "Get test report",
    "inputSchema": {
      "type": "object",
      "properties": {
        "clear": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "get_theme_info",
    "description": "Get theme info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "list_android_devices",
    "description": "List android devices",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "list_animations",
    "description": "List animations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "list_export_presets",
    "description": "List export presets",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "export",
        "list"
      ],
      "summary": "List export presets"
    },
    "risk": "read"
  },
  {
    "name": "list_scripts",
    "description": "List scripts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "recursive": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "monitor_properties",
    "description": "Monitor properties",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "array",
          "items": {}
        },
        "frame_count": {
          "type": "integer"
        },
        "frame_interval": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "properties"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "move_node",
    "description": "Move node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "new_parent_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "new_parent_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "move_to",
    "description": "Move to",
    "inputSchema": {
      "type": "object",
      "properties": {
        "target": {
          "type": "object",
          "additionalProperties": true
        },
        "arrival_radius": {
          "type": "number"
        },
        "timeout": {
          "type": "number"
        },
        "run": {
          "type": "boolean"
        },
        "look_at_target": {
          "type": "boolean"
        },
        "player_path": {
          "type": "string"
        },
        "camera_path": {
          "type": "string"
        }
      },
      "required": [
        "target"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "navigate_to",
    "description": "Navigate to",
    "inputSchema": {
      "type": "object",
      "properties": {
        "target": {
          "type": "object",
          "additionalProperties": true
        },
        "move_speed": {
          "type": "number"
        },
        "player_path": {
          "type": "string"
        },
        "camera_path": {
          "type": "string"
        }
      },
      "required": [
        "target"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "open_scene",
    "description": "Open scene",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "open"
      ],
      "summary": "Open a scene"
    },
    "risk": "write"
  },
  {
    "name": "play_scene",
    "description": "Play scene",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mode": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "play"
      ],
      "summary": "Play a scene"
    },
    "risk": "write"
  },
  {
    "name": "project_path_to_uid",
    "description": "Project path to uid",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "read_resource",
    "description": "Read resource",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "read_script",
    "description": "Read script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "script",
        "read"
      ],
      "summary": "Read a script"
    },
    "risk": "code"
  },
  {
    "name": "read_shader",
    "description": "Read shader",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "reload_plugin",
    "description": "Reload plugin",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "reload_project",
    "description": "Reload project",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "remove_animation",
    "description": "Remove animation",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "remove_autoload",
    "description": "Remove autoload",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "remove_state_machine_state",
    "description": "Remove state machine state",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state_machine_path": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "state_name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "state_name"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "remove_state_machine_transition",
    "description": "Remove state machine transition",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state_machine_path": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "from_state": {
          "type": "string"
        },
        "to_state": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "from_state",
        "to_state"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "rename_node",
    "description": "Rename node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        },
        "new_name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "new_name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "replay_recording",
    "description": "Replay recording",
    "inputSchema": {
      "type": "object",
      "properties": {
        "events": {
          "type": "array",
          "items": {}
        },
        "speed": {
          "type": "number"
        }
      },
      "required": [
        "events"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "run_stress_test",
    "description": "Run stress test",
    "inputSchema": {
      "type": "object",
      "properties": {
        "duration": {
          "type": "number"
        },
        "actions": {
          "type": "array",
          "items": {}
        }
      },
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "run_test_scenario",
    "description": "Run test scenario",
    "inputSchema": {
      "type": "object",
      "properties": {
        "steps": {
          "type": "array",
          "items": {}
        },
        "scene_path": {
          "type": "string"
        }
      },
      "required": [
        "steps"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "test",
        "run"
      ],
      "summary": "Run a test scenario"
    },
    "risk": "write"
  },
  {
    "name": "save_scene",
    "description": "Save scene",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "save"
      ],
      "summary": "Save the current scene"
    },
    "risk": "write"
  },
  {
    "name": "search_files",
    "description": "Search files",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "file_type": {
          "type": "string"
        },
        "max_results": {
          "type": "integer"
        },
        "query": {
          "type": "string"
        }
      },
      "required": [
        "query"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "search_in_files",
    "description": "Search in files",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "max_results": {
          "type": "integer"
        },
        "regex": {
          "type": "boolean"
        },
        "file_type": {
          "type": "string"
        },
        "query": {
          "type": "string"
        }
      },
      "required": [
        "query"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "select_nodes",
    "description": "Select nodes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mode": {
          "type": "string"
        },
        "inspect": {
          "type": "boolean"
        },
        "focus": {
          "type": "boolean"
        },
        "inspector_only": {
          "type": "boolean"
        },
        "for_property": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_anchor_preset",
    "description": "Set anchor preset",
    "inputSchema": {
      "type": "object",
      "properties": {
        "keep_offsets": {
          "type": "boolean"
        },
        "node_path": {
          "type": "string"
        },
        "preset": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "preset"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_animation_keyframe",
    "description": "Set animation keyframe",
    "inputSchema": {
      "type": "object",
      "properties": {
        "track_index": {
          "type": "integer"
        },
        "time": {
          "type": "number"
        },
        "value": {
          "type": "string"
        },
        "easing": {
          "type": "number"
        },
        "node_path": {
          "type": "string"
        },
        "animation": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "animation"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_audio_bus",
    "description": "Set audio bus",
    "inputSchema": {
      "type": "object",
      "properties": {
        "volume_db": {
          "type": "number"
        },
        "solo": {
          "type": "boolean"
        },
        "mute": {
          "type": "boolean"
        },
        "bypass_effects": {
          "type": "boolean"
        },
        "rename": {
          "type": "string"
        },
        "send": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_auto_dismiss",
    "description": "Set auto dismiss",
    "inputSchema": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_blend_tree_node",
    "description": "Set blend tree node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "position_x": {
          "type": "number"
        },
        "position_y": {
          "type": "number"
        },
        "state_machine_path": {
          "type": "string"
        },
        "animation": {
          "type": "string"
        },
        "connect_to": {
          "type": "string"
        },
        "connect_port": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        },
        "blend_tree_state": {
          "type": "string"
        },
        "bt_node_name": {
          "type": "string"
        },
        "bt_node_type": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "blend_tree_state",
        "bt_node_name",
        "bt_node_type"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_editor_camera",
    "description": "Set editor camera",
    "inputSchema": {
      "type": "object",
      "properties": {
        "position": {
          "type": "object",
          "additionalProperties": true
        },
        "rotation_degrees": {
          "type": "object",
          "additionalProperties": true
        },
        "look_at": {
          "type": "object",
          "additionalProperties": true
        },
        "fov": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_game_node_property",
    "description": "Set game node property",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "property": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "property",
        "value"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_input_action",
    "description": "Set input action",
    "inputSchema": {
      "type": "object",
      "properties": {
        "events": {
          "type": "array",
          "items": {}
        },
        "deadzone": {
          "type": "number"
        },
        "action": {
          "type": "string"
        }
      },
      "required": [
        "action",
        "events"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_material_3d",
    "description": "Set material 3d",
    "inputSchema": {
      "type": "object",
      "properties": {
        "albedo_texture": {
          "type": "string"
        },
        "metallic_texture": {
          "type": "string"
        },
        "roughness_texture": {
          "type": "string"
        },
        "normal_texture": {
          "type": "string"
        },
        "emission": {
          "type": "object",
          "additionalProperties": true
        },
        "emission_color": {
          "type": "object",
          "additionalProperties": true
        },
        "emission_texture": {
          "type": "string"
        },
        "transparency": {
          "type": "string"
        },
        "cull_mode": {
          "type": "string"
        },
        "surface_index": {
          "type": "integer"
        },
        "metallic": {
          "type": "number"
        },
        "roughness": {
          "type": "number"
        },
        "emission_energy": {
          "type": "number"
        },
        "albedo_color": {
          "type": "object",
          "additionalProperties": true
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_navigation_layers",
    "description": "Set navigation layers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "layers": {
          "type": "integer"
        },
        "layer_bits": {
          "type": "array",
          "items": {}
        },
        "layer_names": {
          "type": "array",
          "items": {}
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_node_groups",
    "description": "Set node groups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "groups": {
          "type": "array",
          "items": {}
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "groups"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_particle_color_gradient",
    "description": "Set particle color gradient",
    "inputSchema": {
      "type": "object",
      "properties": {
        "stops": {
          "type": "array",
          "items": {}
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "stops"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_particle_material",
    "description": "Set particle material",
    "inputSchema": {
      "type": "object",
      "properties": {
        "direction": {},
        "spread": {
          "type": "number"
        },
        "initial_velocity_min": {
          "type": "number"
        },
        "initial_velocity_max": {
          "type": "number"
        },
        "gravity": {},
        "scale_min": {
          "type": "number"
        },
        "scale_max": {
          "type": "number"
        },
        "color": {
          "type": "string"
        },
        "emission_shape": {
          "type": "string"
        },
        "emission_sphere_radius": {
          "type": "number"
        },
        "emission_box_extents": {},
        "emission_ring_radius": {
          "type": "number"
        },
        "emission_ring_inner_radius": {
          "type": "number"
        },
        "emission_ring_height": {
          "type": "number"
        },
        "angular_velocity_min": {
          "type": "number"
        },
        "angular_velocity_max": {
          "type": "number"
        },
        "orbit_velocity_min": {
          "type": "number"
        },
        "orbit_velocity_max": {
          "type": "number"
        },
        "damping_min": {
          "type": "number"
        },
        "damping_max": {
          "type": "number"
        },
        "attractor_interaction_enabled": {
          "type": "boolean"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_physics_layers",
    "description": "Set physics layers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "collision_layer": {},
        "collision_mask": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_project_setting",
    "description": "Set project setting",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "key": {
          "type": "string"
        }
      },
      "required": [
        "key",
        "value"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_shader_param",
    "description": "Set shader param",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "param": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "param"
      ],
      "additionalProperties": false
    },
    "risk": "code"
  },
  {
    "name": "set_theme_color",
    "description": "Set theme color",
    "inputSchema": {
      "type": "object",
      "properties": {
        "theme_type": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "color": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name",
        "color"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_theme_constant",
    "description": "Set theme constant",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_theme_font_size",
    "description": "Set theme font size",
    "inputSchema": {
      "type": "object",
      "properties": {
        "size": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_theme_stylebox",
    "description": "Set theme stylebox",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bg_color": {
          "type": "string"
        },
        "border_color": {
          "type": "string"
        },
        "border_width": {
          "type": "integer"
        },
        "corner_radius": {
          "type": "integer"
        },
        "padding": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "name"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "set_tree_parameter",
    "description": "Set tree parameter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "parameter": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "parameter",
        "value"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_camera_3d",
    "description": "Setup camera 3d",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fov": {
          "type": "number"
        },
        "size": {
          "type": "number"
        },
        "near": {
          "type": "number"
        },
        "far": {
          "type": "number"
        },
        "cull_mask": {
          "type": "integer"
        },
        "rotation": {
          "type": "object",
          "additionalProperties": true
        },
        "look_at": {
          "type": "object",
          "additionalProperties": true
        },
        "environment_path": {
          "type": "string"
        },
        "parent_path": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "projection": {
          "type": "string"
        },
        "current": {
          "type": "boolean"
        },
        "position": {
          "type": "object",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_collision",
    "description": "Setup collision",
    "inputSchema": {
      "type": "object",
      "properties": {
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        },
        "radius": {
          "type": "number"
        },
        "ax": {
          "type": "number"
        },
        "ay": {
          "type": "number"
        },
        "bx": {
          "type": "number"
        },
        "by": {
          "type": "number"
        },
        "points": {
          "type": "array",
          "items": {}
        },
        "depth": {
          "type": "number"
        },
        "dimension": {
          "type": "string"
        },
        "disabled": {
          "type": "boolean"
        },
        "one_way_collision": {
          "type": "boolean"
        },
        "node_path": {
          "type": "string"
        },
        "shape": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "shape"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_control",
    "description": "Setup control",
    "inputSchema": {
      "type": "object",
      "properties": {
        "margins": {
          "type": "object",
          "additionalProperties": true
        },
        "separation": {
          "type": "integer"
        },
        "anchor_preset": {
          "type": "string"
        },
        "min_size": {
          "type": "string"
        },
        "size_flags_h": {
          "type": "string"
        },
        "size_flags_v": {
          "type": "string"
        },
        "grow_h": {
          "type": "string"
        },
        "grow_v": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_environment",
    "description": "Setup environment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sky": {
          "type": "object",
          "additionalProperties": true
        },
        "sun_angle_max": {},
        "sky_curve": {},
        "ambient_light_color": {
          "type": "object",
          "additionalProperties": true
        },
        "ambient_light_energy": {
          "type": "number"
        },
        "ambient_light_source": {
          "type": "string"
        },
        "tonemap_mode": {
          "type": "string"
        },
        "tonemap_exposure": {
          "type": "number"
        },
        "tonemap_white": {
          "type": "number"
        },
        "fog_enabled": {
          "type": "boolean"
        },
        "fog_light_color": {
          "type": "object",
          "additionalProperties": true
        },
        "fog_density": {
          "type": "number"
        },
        "fog_light_energy": {
          "type": "number"
        },
        "glow_enabled": {
          "type": "boolean"
        },
        "glow_intensity": {
          "type": "number"
        },
        "glow_strength": {
          "type": "number"
        },
        "glow_bloom": {
          "type": "number"
        },
        "ssao_enabled": {
          "type": "boolean"
        },
        "ssao_radius": {
          "type": "number"
        },
        "ssao_intensity": {
          "type": "number"
        },
        "ssr_enabled": {
          "type": "boolean"
        },
        "ssr_max_steps": {
          "type": "integer"
        },
        "ssr_fade_in": {
          "type": "number"
        },
        "ssr_fade_out": {
          "type": "number"
        },
        "sdfgi_enabled": {
          "type": "boolean"
        },
        "parent_path": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "background_mode": {
          "type": "string"
        },
        "background_color": {
          "type": "object",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_lighting",
    "description": "Setup lighting",
    "inputSchema": {
      "type": "object",
      "properties": {
        "rotation": {
          "type": "object",
          "additionalProperties": true
        },
        "parent_path": {
          "type": "string"
        },
        "light_type": {
          "type": "string"
        },
        "preset": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "energy": {
          "type": "number"
        },
        "shadows": {
          "type": "boolean"
        },
        "range": {
          "type": "number"
        },
        "attenuation": {
          "type": "number"
        },
        "spot_angle": {
          "type": "number"
        },
        "spot_angle_attenuation": {
          "type": "number"
        },
        "color": {
          "type": "object",
          "additionalProperties": true
        },
        "position": {
          "type": "object",
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_navigation_agent",
    "description": "Setup navigation agent",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path_desired_distance": {
          "type": "number"
        },
        "target_desired_distance": {
          "type": "number"
        },
        "radius": {
          "type": "number"
        },
        "neighbor_distance": {
          "type": "number"
        },
        "max_neighbors": {
          "type": "integer"
        },
        "max_speed": {
          "type": "number"
        },
        "avoidance_enabled": {
          "type": "boolean"
        },
        "navigation_layers": {
          "type": "integer"
        },
        "mode": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_navigation_region",
    "description": "Setup navigation region",
    "inputSchema": {
      "type": "object",
      "properties": {
        "agent_radius": {
          "type": "number"
        },
        "agent_height": {
          "type": "number"
        },
        "agent_max_climb": {
          "type": "number"
        },
        "agent_max_slope": {
          "type": "number"
        },
        "cell_size": {
          "type": "number"
        },
        "cell_height": {
          "type": "number"
        },
        "navigation_layers": {
          "type": "integer"
        },
        "source_geometry_mode": {
          "type": "string"
        },
        "mode": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "setup_physics_body",
    "description": "Setup physics body",
    "inputSchema": {
      "type": "object",
      "properties": {
        "floor_stop_on_slope": {
          "type": "boolean"
        },
        "floor_max_angle": {
          "type": "number"
        },
        "floor_snap_length": {
          "type": "number"
        },
        "wall_min_slide_angle": {
          "type": "number"
        },
        "motion_mode": {
          "type": "integer"
        },
        "max_slides": {
          "type": "integer"
        },
        "slide_on_ceiling": {
          "type": "boolean"
        },
        "mass": {
          "type": "number"
        },
        "gravity_scale": {
          "type": "number"
        },
        "linear_damp": {
          "type": "number"
        },
        "angular_damp": {
          "type": "number"
        },
        "freeze": {
          "type": "boolean"
        },
        "freeze_mode": {
          "type": "integer"
        },
        "continuous_cd": {
          "type": "boolean"
        },
        "contact_monitor": {
          "type": "boolean"
        },
        "max_contacts_reported": {
          "type": "integer"
        },
        "physics_material_override": {},
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "simulate_action",
    "description": "Simulate action",
    "inputSchema": {
      "type": "object",
      "properties": {
        "strength": {
          "type": "number"
        },
        "pressed": {
          "type": "boolean"
        },
        "action": {
          "type": "string"
        }
      },
      "required": [
        "action"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "game",
        "input",
        "action"
      ],
      "summary": "Simulate an input action"
    },
    "risk": "write"
  },
  {
    "name": "simulate_key",
    "description": "Simulate key",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pressed": {
          "type": "boolean"
        },
        "shift": {
          "type": "boolean"
        },
        "ctrl": {
          "type": "boolean"
        },
        "alt": {
          "type": "boolean"
        },
        "keycode": {
          "type": "string"
        }
      },
      "required": [
        "keycode"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "game",
        "input",
        "key"
      ],
      "summary": "Simulate a key event"
    },
    "risk": "write"
  },
  {
    "name": "simulate_mouse_click",
    "description": "Simulate mouse click",
    "inputSchema": {
      "type": "object",
      "properties": {
        "x": {
          "type": "integer"
        },
        "y": {
          "type": "integer"
        },
        "button": {
          "type": "integer"
        },
        "pressed": {
          "type": "boolean"
        },
        "double_click": {
          "type": "boolean"
        },
        "auto_release": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "simulate_mouse_move",
    "description": "Simulate mouse move",
    "inputSchema": {
      "type": "object",
      "properties": {
        "x": {
          "type": "integer"
        },
        "y": {
          "type": "integer"
        },
        "relative_x": {
          "type": "integer"
        },
        "relative_y": {
          "type": "integer"
        },
        "unhandled": {
          "type": "boolean"
        },
        "button_mask": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "simulate_sequence",
    "description": "Simulate sequence",
    "inputSchema": {
      "type": "object",
      "properties": {
        "events": {
          "type": "array",
          "items": {}
        },
        "frame_delay": {
          "type": "integer"
        }
      },
      "required": [
        "events"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "start_recording",
    "description": "Start recording",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "stop_recording",
    "description": "Stop recording",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "stop_scene",
    "description": "Stop scene",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "scene",
        "stop"
      ],
      "summary": "Stop the running scene"
    },
    "risk": "write"
  },
  {
    "name": "tilemap_clear",
    "description": "Tilemap clear",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "destructive"
  },
  {
    "name": "tilemap_fill_rect",
    "description": "Tilemap fill rect",
    "inputSchema": {
      "type": "object",
      "properties": {
        "x1": {
          "type": "integer"
        },
        "y1": {
          "type": "integer"
        },
        "x2": {
          "type": "integer"
        },
        "y2": {
          "type": "integer"
        },
        "source_id": {
          "type": "integer"
        },
        "atlas_x": {
          "type": "integer"
        },
        "atlas_y": {
          "type": "integer"
        },
        "alternative": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "tilemap_get_cell",
    "description": "Tilemap get cell",
    "inputSchema": {
      "type": "object",
      "properties": {
        "x": {
          "type": "integer"
        },
        "y": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "tilemap_get_info",
    "description": "Tilemap get info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "tilemap_get_used_cells",
    "description": "Tilemap get used cells",
    "inputSchema": {
      "type": "object",
      "properties": {
        "max_count": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "tilemap_set_cell",
    "description": "Tilemap set cell",
    "inputSchema": {
      "type": "object",
      "properties": {
        "x": {
          "type": "integer"
        },
        "y": {
          "type": "integer"
        },
        "source_id": {
          "type": "integer"
        },
        "atlas_x": {
          "type": "integer"
        },
        "atlas_y": {
          "type": "integer"
        },
        "alternative": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "uid_to_project_path",
    "description": "Uid to project path",
    "inputSchema": {
      "type": "object",
      "properties": {
        "uid": {
          "type": "string"
        }
      },
      "required": [
        "uid"
      ],
      "additionalProperties": false
    },
    "risk": "read"
  },
  {
    "name": "update_property",
    "description": "Update property",
    "inputSchema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "node_path": {
          "type": "string"
        },
        "property": {
          "type": "string"
        }
      },
      "required": [
        "node_path",
        "property",
        "value"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "node",
        "set-property"
      ],
      "summary": "Update a node property"
    },
    "risk": "write"
  },
  {
    "name": "validate_script",
    "description": "Validate script",
    "inputSchema": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    },
    "cli": {
      "path": [
        "script",
        "validate"
      ],
      "summary": "Validate a script"
    },
    "risk": "code"
  },
  {
    "name": "wait_for_node",
    "description": "Wait for node",
    "inputSchema": {
      "type": "object",
      "properties": {
        "timeout": {
          "type": "number"
        },
        "poll_frames": {
          "type": "integer"
        },
        "node_path": {
          "type": "string"
        }
      },
      "required": [
        "node_path"
      ],
      "additionalProperties": false
    },
    "risk": "write"
  },
  {
    "name": "watch_signals",
    "description": "Watch signals",
    "inputSchema": {
      "type": "object",
      "properties": {
        "node_paths": {
          "type": "array",
          "items": {}
        },
        "signal_filter": {
          "type": "array",
          "items": {}
        },
        "duration_ms": {
          "type": "integer"
        }
      },
      "additionalProperties": false
    },
    "risk": "write"
  }
] as const;
