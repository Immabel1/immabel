// passwordGenerator.test.ts

// --- Password Generator Implementation ---

export type Strength = 'low' | 'medium' | 'high';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?/~',
};

export function generatePassword(length: number, strength: Strength): string {
  if (length <= 0) {
    throw new Error('Password length must be greater than 0');
  }

  let characterPool = '';

  switch (strength) {
    case 'low':
      characterPool = CHAR_SETS.lowercase;
      break;
    case 'medium':
      characterPool = CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers;
      break;
    case 'high':
      characterPool =
        CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers + CHAR_SETS.symbols;
      break;
    default:
      throw new Error('Invalid strength level');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    password += characterPool[randomIndex];
  }

  return password;
}

// --- Jest Tests ---

describe('generatePassword', () => {
  const strengthLevels: Strength[] = ['low', 'medium', 'high'];

  test('should generate password of correct length', () => {
    for (let length of [1, 5, 10, 20]) {
      for (let strength of strengthLevels) {
        const pwd = generatePassword(length, strength);
        expect(pwd.length).toBe(length);
      }
    }
  });

  test('should generate only lowercase characters for low strength', () => {
    const pwd = generatePassword(50, 'low');
    expect(/^[a-z]+$/.test(pwd)).toBe(true);
  });

  test('should include uppercase and numbers for medium strength', () => {
    const pwd = generatePassword(100, 'medium');
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[^a-zA-Z0-9]/.test(pwd)).toBe(false);
  });

  test('should include symbols for high strength', () => {
    const pwd = generatePassword(100, 'high');
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[^a-zA-Z0-9]/.test(pwd)).toBe(true);
  });

  test('should throw error for invalid length', () => {
    expect(() => generatePassword(0, 'low')).toThrow('Password length must be greater than 0');
    expect(() => generatePassword(-5, 'high')).toThrow('Password length must be greater than 0');
  });

  test('should throw error for invalid strength', () => {
    // @ts-expect-error on purpose to simulate invalid input
    expect(() => generatePassword(10, 'superstrong')).toThrow('Invalid strength level');
  });
});
