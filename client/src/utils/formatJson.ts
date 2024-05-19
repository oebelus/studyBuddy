export function formatJson(jsonString: string) {
    const braceIndex = jsonString.indexOf('{');
    if (braceIndex !== -1) {
      return jsonString.substring(braceIndex);
    } else {
      // No brace found, return the original string
      return jsonString;
    }
  }