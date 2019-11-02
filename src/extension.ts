import * as vscode from 'vscode';
import { TextEditor, TextEditorEdit, Range,Position, TextLine } from 'vscode';

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
				edit.delete(new Range(line, 0 ,line+1, 0))
			} else if (textLine.text.trim() == '') {
				edit.delete(new Range(line, 0 ,line+1, 0))
			} else {
				break
			}
		}


		let thirdModules = []
		let localModules = []
		let helpAndContants = []
		let typeModules = []
		let otherModules = []

		for (let importStr of importList) {
			let match = importStr.match(/'(.*)'/)
			if (match && match[1]) {
				let from = match[1]

				if (from.indexOf('./') == -1 && from.indexOf('../') == -1) {
					thirdModules.push(importStr)
					continue
				}

				if (from.indexOf('api-ts') != -1 || from.indexOf('interfaces') != -1) {
					typeModules.push(importStr)
					continue
				}
				if (from.indexOf('./') != -1 || from.indexOf('../') != -1) {
					let index = from.lastIndexOf('/')
					let moduleName = from.substring(index + 1)

					if (moduleName.charAt(0) >= 'a' && moduleName.charAt(0) <= 'z') {
						helpAndContants.push(importStr)
					}
					if (moduleName.charAt(0) >= 'A' && moduleName.charAt(0) <= 'Z') {
						localModules.push(importStr)
					}
					continue
				}
				otherModules.push(importStr)
			}
		}

		let line = 0

		if(thirdModules.length > 0) {
			for (let txt of thirdModules) {
				edit.insert(new Position(line++, 0), `${txt}\n`)
			}
			edit.insert(new Position(line++, 0), `\n`)
		}
		
		if (localModules.length > 0) {
			for (let txt of localModules) {
				edit.insert(new Position(line++, 0), `${txt}\n`)
			}
			edit.insert(new Position(line++, 0), `\n`)
		}

		if (helpAndContants.length > 0) {
			for (let txt of helpAndContants) {
				edit.insert(new Position(line++, 0), `${txt}\n`)
			}
			edit.insert(new Position(line++, 0), `\n`)
		}

		if (typeModules.length > 0) {
			for (let txt of typeModules) {
				edit.insert(new Position(line++, 0), `${txt}\n`)
			}
			edit.insert(new Position(line++, 0), `\n`)
		}
		if (otherModules.length > 0) {
			for (let txt of otherModules) {
				edit.insert(new Position(line++, 0), `${txt}\n`)
			}
			edit.insert(new Position(line++, 0), `\n`)
		}

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
