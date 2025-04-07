// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copy-object-name" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('copy-object-name.copyObjectName', async (uri?: vscode.Uri) => {
		let path: string;
		
		// If command was triggered from explorer context menu, uri will be provided
		if (uri && uri.fsPath) {
			path = uri.fsPath;
		} 
		// Otherwise try to get the explorer selection directly
		else {
			try {
				// Get all selected items from the explorer
				await vscode.commands.executeCommand('copyFilePath');
				
				// Copy the text currently in the clipboard, which should be the file path
				// from the copyFilePath command
				const clipboardText = await vscode.env.clipboard.readText();
				
				if (clipboardText) {
					// Extract the file/folder name from the full path
					path = clipboardText;
				} else {
					// Fall back to editor if clipboard is empty
					const activeEditor = vscode.window.activeTextEditor;
					if (activeEditor) {
						path = activeEditor.document.uri.fsPath;
					} else {
						vscode.window.showWarningMessage('No file or folder selected');
						return;
					}
				}
			} catch (error) {
				// Fall back to editor if there's an error
				const activeEditor = vscode.window.activeTextEditor;
				if (activeEditor) {
					path = activeEditor.document.uri.fsPath;
				} else {
					vscode.window.showWarningMessage('No file or folder selected');
					return;
				}
			}
		}
		
		// Get just the name without the path
		const name = path.split(/[/\\]/).pop() as string;
		
		// Now write just the name to the clipboard, replacing the full path
		await vscode.env.clipboard.writeText(name);
		
		// Check if it's likely a folder (no file extension) for better messaging
		const isLikelyFolder = !name.includes('.');
		const itemType = isLikelyFolder ? 'folder' : 'file';
		vscode.window.showInformationMessage(`Copied ${itemType} name: ${name}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
