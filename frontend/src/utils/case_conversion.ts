
/**
 * Converts the javascript naming conventions of variables to
 * pep8 conventions. Used before backend api calls.
 */
export function javaToPepCase(s: string): string {
  // first letter uppercase then return
  if (isUpperCase(s[0])) {
    return s 
  }

  let pepString = []
  for (var char of s) {
    if (isUpperCase(char)) {
      pepString.push('_')
      pepString.push(char.toLowerCase())
      continue
    }
    pepString.push(char)
  }
  return pepString.join('')
}

function isUpperCase(s: string): boolean {
  return s !== s.toLowerCase() && s === s.toUpperCase()
}
