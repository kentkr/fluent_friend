
export interface LTCheckParams {
  language: string
  text: string
  data?: object
  dicts?: string
  motherTongue?: string
  preferredVariants?: string
  enabledRules?: string
  enabledCategories?: string
  disabledCategories?: string
  enabledOnly?: boolean
  level?: string
}

export interface LTCheckResponse {
  software: Software;
  language: Language;
  matches: Match[];
}

// Response Types (based on your earlier structure)
interface Software {
  name: string;
  version: string;
  buildDate: string;
  apiVersion: number;
  status: string;
  premium: boolean;
}

interface DetectedLanguage {
  name: string;
  code: string;
}

interface Language {
  name: string;
  code: string;
  detectedLanguage: DetectedLanguage;
}

export interface Replacement {
  value: string;
}

interface Context {
  text: string;
  offset: number;
  length: number;
}

interface Category {
  id: string;
  name: string;
}

interface Url {
  value: string;
}

interface Rule {
  id: string;
  subId: string;
  description: string;
  urls: Url[];
  issueType: string;
  category: Category;
}

interface Match {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: Replacement[];
  context: Context;
  sentence: string;
  rule: Rule;
}
