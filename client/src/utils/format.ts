export function formatJson(jsonString: string) {
  if (!jsonString) {
    return ''; // Return an empty string if jsonString is undefined or null
  }
  const braceIndex = jsonString.indexOf('{');
  if (braceIndex !== -1) {
    return jsonString.substring(braceIndex);
  } else {
    // No brace found, return the original string
    return jsonString;
  }
}

export default function formatString(string: string, numlines: number) {
  const paraLength = Math.round((string.length)/numlines);
  const paragraphs = [];
  for (let i=0; i<numlines; i++) {
      let marker = paraLength;
      //if the marker is right after a space, move marker back one character
      if (string.charAt(marker-1) == " ") {
          marker--; 
      }
      //move marker to end of a word if it's in the middle
      while(string.charAt(marker) != " " && string.charAt(marker) != "") {
          marker++;
      }
      const nextPara = string.substring(0, marker)
      paragraphs.push(nextPara)
      string = string.substring((nextPara.length+1),string.length)
  }
  return paragraphs
}
