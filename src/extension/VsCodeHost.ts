import * as FS from "fs";
import * as vscode from "vscode";

import { Host } from "./Host";
import { Result } from "./Result";
import { ResultUtils } from "./ResultUtils";

export class VsCodeHost implements Host {
    public async findFilePaths(filePattern: string): Promise<Set<string>> {
        const files: vscode.Uri[] = await vscode.workspace.findFiles(filePattern);
        return new Set<string>(files.map(file => file.fsPath));
    }

    public hasOpenFolders(): boolean {
        return !!vscode.workspace.workspaceFolders;
    }

    public readFile(filePath: string): string {
        return FS.readFileSync(filePath, "utf8");
    }

    public showErrorMessage(errorMessage: string): void {
        vscode.window.showErrorMessage(errorMessage);
    }

    public showInformationMessage(informationMessage: string): void {
        vscode.window.showInformationMessage(informationMessage);
    }

    public tryGetScriptText(): Result<string> {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

        if (!editor) {
            return ResultUtils.failure(
                "There is no active text editor. " +
                "Make sure to run the command when your script is in the active text editor.");
        }

        const document: vscode.TextDocument = editor.document;
        return ResultUtils.success(document.getText());
    }

    public writeFile(filePath: string, content: string): void {
        FS.writeFileSync(filePath, content, "utf8");
    }
}