import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts text to uppercase and removes Greek diacritics (tonos/accents).
 * In Greek typography, capital letters do not carry accents.
 *
 * Usage: {{ 'key' | translate | greekUppercase }}
 */
@Pipe({
  name: 'greekUppercase',
  standalone: true
})
export class GreekUppercasePipe implements PipeTransform {
  private static readonly ACCENT_MAP: Record<string, string> = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
    'ΐ': 'ι', 'ΰ': 'υ', 'ϊ': 'ι', 'ϋ': 'υ', 'Ϊ': 'Ι', 'Ϋ': 'Υ'
  };

  transform(value: string | null | undefined): string {
    if (!value) return '';
    const upper = value.toUpperCase();
    return upper.replace(/[ΆΈΉΊΌΎΏΪΫ]/g, ch => GreekUppercasePipe.ACCENT_MAP[ch] || ch);
  }
}
