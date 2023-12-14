import * as vscode from "vscode";
import * as fs from "fs/promises";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  const log = (...args: Parameters<typeof console.log>) => {
    return console.log("node-exec-function", ...args);
  };

  let disposable = vscode.commands.registerCommand(
    "node-exec-function.executeFunction",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No open text editor");
        return;
      }

      const document = editor.document;
      const documentText = document.getText();

      const functionList = findFunctions(documentText);
      const item = await vscode.window.showQuickPick(functionList, {
        placeHolder: "Select a function to execute",
        canPickMany: false,
      });
      if (!item) {
        return;
      }
      await executeNodeFunction(item.label, document.fileName, documentText);
    }
  );

  context.subscriptions.push(disposable);
}

function findFunctions(text: string): vscode.QuickPickItem[] {
  // Regular expression to match function declarations
  const functionPattern = /function\s(\w+)/g;
  const arrowFunctionPattern = /(\w+)\s=\s(?:async\s)?\(\)\s=>/g;
  let functions: vscode.QuickPickItem[] = [];

  // Line by line search for function declarations
  const lines = text.split("\n");
  for (let line of lines) {
    const functionMatch = functionPattern.exec(line);
    if (functionMatch) {
      functions.push({ label: functionMatch[1] });
    }
    const arrowFunctionMatch = arrowFunctionPattern.exec(line);
    if (arrowFunctionMatch) {
      functions.push({ label: arrowFunctionMatch[1] });
    }
  }

  return functions;
}

async function executeNodeFunction(
  functionName: string,
  filePath: string,
  fileContent: string
) {
  // Show a temporary status bar message
  const status = vscode.window.setStatusBarMessage(
    `Executing function: ${functionName}`
  );

  // Create a temporary file to execute the function
  const splitted = filePath.split("/");
  const tempFilePath = `${splitted.slice(0, -1).join("/")}/.${splitted.at(-1)}`;
  // Write the file content to the temporary file
  const newFileContent = `${fileContent}\n${functionName}();`;
  await fs.writeFile(tempFilePath, newFileContent);
  // Open a new terminal
  const terminal = vscode.window.createTerminal(
    `node-exec-function: ${functionName}`
  );
  // Execute the function
  const functionCmd = `npx tsx ${tempFilePath} && echo "\nPress enter to close the terminal" && read && exit`;
  terminal.sendText(functionCmd);

  // Remove the temporary file when the terminal is closed
  vscode.window.onDidCloseTerminal((t) => {
    if (t === terminal) {
      fs.unlink(tempFilePath);
    }
  });
  // Show the terminal
  terminal.show();
  // Remove the status bar message
  status.dispose();
}

export function deactivate() {}
