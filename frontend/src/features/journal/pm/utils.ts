
// color mapping of correction types
// these won't be perfect but generally are what LT uses
// pulled from https://www.w3.org/International/multilingualweb/lt/drafts/its20/its20.html#lqissue-typevalues:~:text=quality%20types%20natively.-,Value,from%20the%20wrong%20domain%20was%20used%20or%20terms%20are%20used%20inconsistently.,-The%20localization%20had
export const issueClassMap = {
  'terminology': 'warning-dec',
  'mistranslation': 'warning-dec',
  'omission': 'warning-dec',
  'untranslated': 'warning-dec',
  'addition': 'warning-dec',
  'duplication': 'suggestion-dec',
  'inconsistency': 'warning-dec',
  'grammar': 'error-dec',
  'legal': 'warning-dec',
  'register': 'suggestion-dec',
  'locale-specific-content': 'warning-dec',
  'locale-violation': 'warning-dec',
  'style': 'warning-dec',
  'characters': 'warning-dec',
  'misspelling': 'error-dec',
  'typographical': 'warning-dec',
  'formatting': 'warning-dec',
  'inconsistent-entities': 'warning-dec',
  'numbers': 'warning-dec',
  'markup': 'warning-dec',
  'pattern-problem': 'warning-dec',
  'whitespace': 'error-dec',
  'internationalization': 'suggestion-dec',
  'length': 'warning-dec',
  'non-conformance': 'warning-dec',
  'uncategorized': 'warning-dec',
  'other': 'warning-dec',
}

