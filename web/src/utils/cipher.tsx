export function strongCipher(str: string, shift: number): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const charCode = char.charCodeAt(0);
    const base = charCode >= 65 && charCode <= 90 ? 65 : 97; // 65 for 'A', 97 for 'a'

    return String.fromCharCode(
      ((((charCode - base + shift) % 26) + 26) % 26) + base
    );
  });
}
