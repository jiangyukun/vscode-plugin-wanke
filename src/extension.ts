import * as vscode from 'vscode';
import { TextEditor, TextEditorEdit, Position, TextLine } from 'vscode';
import { type } from 'os';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-plugin-wanke" is now active!');

	let disposable = vscode.commands.registerTextEditorCommand('jiangyu.format', (textEditor: TextEditor, edit: TextEditorEdit) => {

		let importList: string[] = []
		for (let line = 0; line < textEditor.document.lineCount; line++) {
			let textLine: TextLine = textEditor.document.lineAt(line)
			if (textLine.text.indexOf('import ') != -1) {
				importList.push(textLine.text)
			}
		}

		for (let line = 0; line < textEditor.document.lineCount; line++) {
			let textLine: TextLine = textEditor.document.lineAt(line)
			if (textLine.text.indexOf('import ') != -1) {
				edit.delete(textLine.range)
			}
		}

		let thirdModules = []
		let localModules = []
		let helpAndContants = []
		let types = []

		for (let importStr of importList) {
			let match = importStr.match(/'(.*)'/)
			if (match && match[1]) {
				let from = match[1]
				console.log('from ------ ' + from)

				if (from.indexOf('./') == -1 && from.indexOf('../') == -1) {
					thirdModules.push(importStr)
					continue
				}

				if (from.indexOf('type') != -1) {
					types.push(importStr)
					continue
				}
				if (from.indexOf('./') != -1 || from.indexOf('../') != -1) {
					let match1 = from.match(/\/(\w*)$/)
					if (match1 && match1[1]) {
						let moduleName = match1[1]
						console.log('moduleName ---- ' + moduleName)
						if (moduleName.charAt(0) > 'a' && moduleName.charAt(0) < 'z') {
							helpAndContants.push(importStr)
						}
						if (moduleName.charAt(0) > 'A' && moduleName.charAt(0) < 'Z') {
							localModules.push(importStr)
						}
					}
					continue
				}
			}
		}

		let line = 0

		for (let txt of thirdModules) {
			edit.insert(new Position(line++, 0), `${txt}`)
		}
		if (localModules.length > 0) {
			edit.insert(new Position(line++, 0), ``)
			for (let txt of localModules) {
				edit.insert(new Position(line++, 0), `${txt}`)
			}
		}

		if (helpAndContants.length > 0) {
			edit.insert(new Position(line++, 0), ``)
			for (let txt of helpAndContants) {
				edit.insert(new Position(line++, 0), `${txt}`)
			}
		}

		if (types.length > 0) {
			edit.insert(new Position(line++, 0), ``)
			for (let txt of types) {
				edit.insert(new Position(line++, 0), `${txt}`)
			}
		}

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
