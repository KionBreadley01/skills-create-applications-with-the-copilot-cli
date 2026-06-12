const { execSync } = require('child_process');

// Tests for CLI calculator (src/calculator.js)
// Covers: addition, subtraction, multiplication, division, precision, and division-by-zero

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
      expect(stderr).toMatch(/Division by zero/);
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
});
