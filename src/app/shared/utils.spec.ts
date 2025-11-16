import { isValidAnswer } from "./utils";
  describe('isValidAnswer', () => {
    it('returns false for null or undefined', () => {
      expect(isValidAnswer(null)).toBeFalse();
      expect(isValidAnswer(undefined)).toBeFalse();
    });

    it('returns true for empty strings', () => {
      expect(isValidAnswer('')).toBeTrue();
      expect(isValidAnswer('\t')).toBeTrue();
    });

    it('returns true for non-empty strings', () => {
      expect(isValidAnswer('answer')).toBeTrue();
      expect(isValidAnswer('hello world')).toBeTrue();
      expect(isValidAnswer('0')).toBeTrue();
    });

    it('returns false for NaN numbers', () => {
      expect(isValidAnswer(NaN)).toBeFalse();
    });

    it('returns true for valid numbers including zero', () => {
      expect(isValidAnswer(0)).toBeTrue();
      expect(isValidAnswer(1)).toBeTrue();
      expect(isValidAnswer(-5)).toBeTrue();
      expect(isValidAnswer(3.14)).toBeTrue();
    });

    it('returns true for boolean values', () => {
      expect(isValidAnswer(true)).toBeTrue();
      expect(isValidAnswer(false)).toBeTrue();
    });

    it('returns false for objects and arrays', () => {
      expect(isValidAnswer({})).toBeFalse();
      expect(isValidAnswer([])).toBeFalse();
      expect(isValidAnswer({ key: 'value' })).toBeFalse();
    });
  });