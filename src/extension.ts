import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const name = "node-exec-function";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    `${name}.executeFunction`,
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      const document = editor.document;
      const filePath = document.fileName;
      const fileExtension = path.extname(filePath);

      if (fileExtension !== ".js" && fileExtension !== ".ts") {
        vscode.window.showErrorMessage("Only .js and .ts files are supported.");
        return;
      }

      const fileContent = document.getText();
      const functions = findFunctions(fileContent);

      if (functions.length === 0) {
        vscode.window.showErrorMessage(
          "No functions found in the current file."
        );
        return;
      }

      const selectedFunction = await vscode.window.showQuickPick(functions, {
        placeHolder: "Select a function to execute",
      });

      if (!selectedFunction) {
        return;
      }

      try {
        const functionName = selectedFunction.split("(")[0].trim(); // Extract function name
        const terminal = vscode.window.createTerminal(
          `node-exec-function: ${functionName}`
        );

        // Create a temporary file path
        const splitted = filePath.split("/");
        const tempFilePath = `${splitted.slice(0, -1).join("/")}/.${splitted.at(
          -1
        )}`;

        // Write the file content with the function call
        const newFileContent = `${fileContent}\n${functionName}();`;
        await fs.promises.writeFile(tempFilePath, newFileContent);

        // Execute the function using tsx
        const functionCmd = `npx -y tsx ${tempFilePath} && echo "\nPress enter to close the terminal" && read && exit`;
        terminal.sendText(functionCmd);

        // Clean up temp file when terminal closes
        vscode.window.onDidCloseTerminal((t) => {
          if (t === terminal) {
            fs.promises.unlink(tempFilePath);
          }
        });

        terminal.show();
      } catch (error) {
        vscode.window.showErrorMessage(`Error executing function: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function findFunctions(code: string): string[] {
  // Match both traditional functions and arrow functions
  const functionRegex =
    /(?:function|const|let|var)\s+(\w+)\s*(?:\(.*?\)\s*{|\s*=\s*\(.*?\)\s*=>)/g;
  let match;
  const functions = [];
  while ((match = functionRegex.exec(code)) !== null) {
    functions.push(match[1]);
  }
  return functions;
}

export function deactivate() {}
