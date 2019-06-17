// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import { TextEncoder, TextDecoder } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "git-log-p" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.gitLogP', () => {
		const t = vscode.window.activeTextEditor;
		if (t === undefined) { return; }

		const r = spawnSync("git", ["log", "-p", t.document.fileName], {cwd: vscode.workspace.rootPath, encoding: "buffer"});
		if (r.status !== 0) {
			const s = new TextDecoder().decode(r.stderr);
			vscode.window.showErrorMessage(s);
			return;
		}

		const s = new TextDecoder().decode(r.stdout);
		vscode.workspace.openTextDocument({ content: s, language: "diff" }).then((doc) => {
			vscode.window.showTextDocument(doc, { preview: true });
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
