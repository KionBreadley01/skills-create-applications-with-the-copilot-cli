const { execSync } = require('child_process');

// Tests for CLI calculator (src/calculator.js)
// Covers: addition, subtraction, multiplication, division, precision,
// modulo, power, square root, and edge cases

function runCmd(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

describe('CLI Calculator', () => {
  test('2 + 3 = 5', () => {
    const out = runCmd('node src/calculator.js add 2 3').trim();
    expect(out).toBe('5');
  });

  test('10 - 4 = 6', () => {
    const out = runCmd('node src/calculator.js subtract 10 4').trim();
    expect(out).toBe('6');
  });

  test('45 * 2 = 90', () => {
    const out = runCmd('node src/calculator.js multiply 45 2').trim();
    expect(out).toBe('90');
  });

  test('20 / 5 = 4', () => {
    const out = runCmd('node src/calculator.js divide 20 5').trim();
    expect(out).toBe('4');
  });

  test('division with precision flag', () => {
    const out = runCmd('node src/calculator.js divide 5 2 --precision 2').trim();
    expect(out).toBe('2.50');
  });

  test('division by zero exits with code 2 and prints error', () => {
    try {
      execSync('node src/calculator.js divide 1 0', { encoding: 'utf8', stdio: 'pipe' });
      // If it didn't throw, force fail
      throw new Error('Expected division by zero to exit with non-zero code');
    } catch (err) {
      // Node's execSync throws a ChildProcessError with status property
      expect(err.status).toBe(2);
      const stderr = err.stderr ? err.stderr.toString() : '';
      expect(stderr).toMatch(/divide by zero|Cannot divide by zero/i);
    }
  });

  test('invalid operation returns exit code 1', () => {
    try {
      execSync('node src/calculator.js unknown 1 2', { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('Expected unknown operation to exit with non-zero code');
    } catch (err) {
      expect(err.status).toBe(1);
      const stderr = err.stderr ? err.stderr.toString() : '';
      expect(stderr).toMatch(/Unknown operation/);
    }
  });

  // --- New tests for extended operations ---
  test('5 % 2 = 1 (modulo)', () => {
    const out = runCmd('node src/calculator.js modulo 5 2').trim();
    expect(out).toBe('1');
  });

  test('2 ^ 3 = 8 (power)', () => {
    const out = runCmd('node src/calculator.js power 2 3').trim();
    expect(out).toBe('8');
  });

  test('sqrt 16 = 4 (square root)', () => {
    const out = runCmd('node src/calculator.js sqrt 16').trim();
    expect(out).toBe('4');
  });

  test('square root of negative number exits with code 3', () => {
    try {
      execSync('node src/calculator.js sqrt -9', { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('Expected sqrt of negative to exit non-zero');
    } catch (err) {
      expect(err.status).toBe(3);
      const stderr = err.stderr ? err.stderr.toString() : '';
      expect(stderr).toMatch(/square root|Cannot take square root/i);
    }
  });

  test('modulo by zero exits with code 2', () => {
    try {
      execSync('node src/calculator.js modulo 5 0', { encoding: 'utf8', stdio: 'pipe' });
      throw new Error('Expected modulo by zero to exit non-zero');
    } catch (err) {
      expect(err.status).toBe(2);
      const stderr = err.stderr ? err.stderr.toString() : '';
      expect(stderr).toMatch(/modulo by zero|Cannot modulo by zero/i);
    }
  });

  // Also test the exported functions directly
  test('exported functions work as expected', () => {
    const calc = require('../calculator');
    expect(typeof calc.modulo).toBe('function');
    expect(calc.modulo(5, 2)).toBe(1);
    expect(typeof calc.power).toBe('function');
    expect(calc.power(2, 3)).toBe(8);
    expect(typeof calc.squareRoot).toBe('function');
    expect(calc.squareRoot(16)).toBe(4);
  });
});
