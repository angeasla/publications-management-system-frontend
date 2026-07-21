import { GreekUppercasePipe } from './greek-uppercase.pipe';

describe('GreekUppercasePipe', () => {
  const pipe = new GreekUppercasePipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert to uppercase and remove diacritics from greek text', () => {
    expect(pipe.transform('καλημέρα')).toBe('ΚΑΛΗΜΕΡΑ');
    expect(pipe.transform('Άνθρωπος')).toBe('ΑΝΘΡΩΠΟΣ');
    expect(pipe.transform('ώρες')).toBe('ΩΡΕΣ');
  });

  it('should handle null, undefined and empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
