const vscode = require("vscode");

function activate(context) {
  vscode.window.showInformationMessage("Equilix is now active!");

  const disposable = vscode.workspace.onWillSaveTextDocument((event) => {
    const document = event.document;
    const text = document.getText();
    const convertedText = convertEquals(text);
    if (text !== convertedText) {
      const edit = new vscode.TextEdit(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        convertedText
      );
      event.waitUntil(Promise.resolve([edit]));
      const lineNumbers = getConvertedLineNumbers(text, convertedText);

      vscode.window.showInformationMessage(
        `Equilix fixed line no: ${lineNumbers.join(", ")}`
      );
      5;
    }
  });

  context.subscriptions.push(disposable);
}

function convertEquals(text) {
  const convertedText = text.replace(/ == /g, " === ");
  return convertedText.replace(/ != /g, " !== ");
}
function getConvertedLineNumbers(originalText, convertedText) {
  const originalLines = originalText.split("\n");
  const convertedLines = convertedText.split("\n");

  const lineNumbers = [];
  for (let i = 0; i < originalLines.length; i++) {
    if (originalLines[i] !== convertedLines[i]) {
      lineNumbers.push(i + 1); // Add 1 to adjust for zero-based index
    }
  }

  return lineNumbers;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
