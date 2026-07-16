import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE } from '../config/language.config';

/**
 * Custom handler for missing translation keys.
 * Fallback strategy:
 * 1. Look up the key in the default language (el) translations
 * 2. If found, return the default language value
 * 3. If not found in any language, return the raw key as last resort
 */
export class AppMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const translations = params.translateService.translations[DEFAULT_LANGUAGE];

    if (translations) {
      const value = this.resolveNestedKey(translations, params.key);
      if (value !== undefined && value !== null && typeof value === 'string') {
        return value;
      }
    }

    // Last resort: return the raw key
    return params.key;
  }

  /**
   * Traverses a nested object using a dot-separated key path.
   * E.g., 'sidebar.books' → obj['sidebar']['books']
   */
  private resolveNestedKey(obj: Record<string, unknown>, key: string): unknown {
    const segments = key.split('.');
    let current: unknown = obj;

    for (const segment of segments) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }
}
