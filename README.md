# Node Execute Function Extension

## erview

The Node Execute Function Extension for Visual Studio Code allows users to quickly execute JavaScript functions directly from their code editor. It detects function declarations in the active file and provides a simple interface for running these functions in a separate environment.

## Features

- Function Detection: Detects both traditional and arrow function declarations in the active file.
- Quick Execution: Easily execute any detected function with a few clicks.
- Terminal Integration: Functions are executed in a VS Code terminal, allowing for live output observation.
- Temporary File Creation: Generates a temporary file for function execution to avoid altering the original source code.
- Auto Clean-up: Automatically deletes temporary files after the terminal is closed.

## Usage

1. Open a JavaScript File: Open and focus on a JavaScript file in your editor.

2. Trigger the Command: Run the command node-exec-function.executeFunction from the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).

3. Select a Function: Choose a function from the list of detected functions in your file.

4. Watch the Output: The function will run in a new terminal window. Monitor the output in real time.

5. Close the Terminal: Press Enter in the terminal after execution to close it and trigger the clean-up of temporary files.

## Installation

Install directly from the Visual Studio Code Marketplace. Search for "Node Execute Function" and click install.

## Requirements

- Visual Studio Code
- Node.js environment
- Permissions to create and delete temporary files in your work directory
- Limitations
- Supports only simple function execution without arguments.
- Designed for JavaScript files; other file types are not supported.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the repository for bug fixes, improvements, or new features.

## License

This extension is released under MIT, see the LICENSE file for more details.
