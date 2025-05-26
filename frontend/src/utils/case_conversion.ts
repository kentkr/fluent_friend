
/**
 * Converts the javascript naming conventions of variables to
 * pep8 conventions. Used before backend api calls.
 */
export function javaToPepCase(s: string): string {
  // first letter uppercase then return
  if (s[0].toUpperCase() == s[0]) {
    return s 
  }

  let pepString = []
  for (var char of s) {
    if (char.toUpperCase() == char) {
      pepString.push('_')
      pepString.push(char.toLowerCase())
      continue
    }
    pepString.push(char)
  }
  console.log(s, 'to', pepString.join(''))
  return pepString.join('')
}
