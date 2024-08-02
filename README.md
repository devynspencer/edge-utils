# Microsoft Edge Utilities

Utility extensions for Microsoft Edge. See below for feature list.

| Status      | Feature                     | Description                                                                                                                           |
| ----------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Not Started | Session Organization        | Organize pins, tabs, and tab groups using a configuration file. Shortcut and menu button to reset organization.                       |
| Complete    | Pin Active Tab              | Pin active tab in current window. Shortcut and menu button.                                                                           |
| Active      | Sort Tabs                   | Sort tabs in current window based on specified criteria. Shortcut and menu button.                                                    |
| Not Started | Toggle All Tab Groups       | Expand/collapse tab groups in current window. Shortcut and menu button.                                                               |
| Not Started | Toggle Primary Tab Groups   | Expand/collapse "primary" tab groups in current window. Primary tabs are defined in configuration file. Shortcut and menu button.     |
| Not Started | Toggle Secondary Tab Groups | Expand/collapse "secondary" tab groups in current window. Secondary tabs are defined in configuration file. Shortcut and menu button. |
| Not Started | Toggle Tertiary Tab Groups  | Expand/collapse "tertiary" tab groups in current window. Tertiary tabs are defined in configuration file. Shortcut and menu button.   |
| Not Started | Split Active Tab            | Split active tab in current window. Shortcut and menu button.                                                                         |
| Not Started | Remove Duplicates           | Remove duplicate tabs in current window. Shortcut and menu button.                                                                    |
| Not Started | Extension Options           | Toggle extension features, configure extension options, import or generate a configuration file, and specify hotkeys.                 |
| Not Started | Extension Help              | View extension help and documentation.                                                                                                |
| Not Started | Toggle Hotkeys Overlay      | Display an overlay with information on keybinds, available key chords, and suggested/default keybindings.                             |
| Not Started | Export Current Layout       | Export the current arrangement of pins, tabs, and tab groups.                                                                         |

## Configuration

```json
{
  "tabs": [
    {
      "url": "https://github.com/devynspencer",
      "pinned": true
    },
    {
      "url": "https://docs.github.com",
      "pinned": true
    },
    {
      "url": "https://docs.github.com/en/actions",
      "pinned": false
    },
    {
      "url": "https://docs.github.com/en/copilot"
    }
  ],
  "tab_groups": [
    {
      "name": "Example 1 - tabs specified by url",
      "color": "Pink",
      "tabs": [
        "https://google.com"
      ]
    },
    {
      "name": "Tab Group 4",
      "color": "Royal Blue",
      "tabs": []
    },
    {
      "name": "Tab Group 7",
      "color": "Yellow",
      "tabs": []
    }
  ]
}
```
