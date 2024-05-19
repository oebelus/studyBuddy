export function formatstr(text: string | undefined): string {
    if (text === undefined) {
        throw new Error('Text is undefined');
    }

    // Escape special characters such as backslashes and double quotes
    const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Split the text into lines and join them using the JavaScript string format
    const lines = escapedText.split('\n');
    const formattedLines = lines.map(line => `"${line}"`);
    const formattedText = formattedLines.join(' +\n');

    return formattedText;
}
