export interface LanguageConfig {
  code: string;
  name: string;
  isDefault: boolean;
}

export const LANGUAGE_CONFIG: LanguageConfig[] = [
  { code: 'el', name: 'Ελληνικά', isDefault: true },
  { code: 'en', name: 'English', isDefault: false }
];

export const DEFAULT_LANGUAGE = 'el';
export const STORAGE_KEY = 'app_language';
