#!/usr/bin/env node
"use strict";

// Calculator core functions and CLI
// Supported operations (named exports):
// addition, subtraction, multiplication, division, modulo, power, squareRoot

// Basic operations
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { if (b === 0) throw new Error('Cannot divide by zero'); return a / b; }

// New operations
function modulo(a, b) { if (b === 0) throw new Error('Cannot modulo by zero'); return a % b; }
function power(base, exponent) { return Math.pow(base, exponent); }
function squareRoot(n) { if (n < 0) throw new Error('Cannot take square root of negative number'); return Math.sqrt(n); }

// Backwards-compatible named wrappers
function addition(a, b) { return add(a, b); }
function subtraction(a, b) { return subtract(a, b); }
function multiplication(a, b) { return multiply(a, b); }
function division(a, b) { return divide(a, b); }

module.exports = {
  // CLI-friendly names
  addition, subtraction, multiplication, division,
  // New names
  modulo, power, squareRoot,
  // low-level names
  add, subtract, multiply, divide
};

// CLI runner (only when executed directly)
if (require.main === module) {
  const args = process.argv.slice(2);

  function printUsage() {
    console.log(`Usage: node src/calculator.js <operation> <num1> <num2?> [--precision N]

Operations:
  add, addition        Add two numbers (num1 + num2)
  subtract             Subtract two numbers (num1 - num2)
  multiply             Multiply two numbers (num1 * num2)
  divide               Divide two numbers (num1 / num2)
  modulo               Remainder of num1 / num2
  power                Exponentiation: base exponent
  sqrt, squareroot     Square root of a single number

Options:
  --precision, -p  Number of decimal places to round the result to (optional)
  --help           Show this help message
`);
  }

  if (args.length === 0 || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  // Parse precision flag
  let precision = null;
  let filteredArgs = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === '--precision' || a === '-p') && i + 1 < args.length) {
      const p = Number(args[i + 1]);
      if (Number.isInteger(p) && p >= 0) {
        precision = p;
        i++; // skip next
        continue;
      } else {
        console.error('Error: --precision requires a non-negative integer');
        process.exit(1);
      }
    }
    filteredArgs.push(a);
  }

  if (filteredArgs.length < 2) {
    console.error('Error: Missing arguments. Expected: <operation> <num1> [<num2>]');
    printUsage();
    process.exit(1);
  }

  const operation = filteredArgs[0].toLowerCase();
  const opArgs = filteredArgs.slice(1);

  // Helper to format result
  function formatResult(n) {
    if (precision === null) return String(n);
    return Number(n).toFixed(precision);
  }

  try {
    let result;
    switch (operation) {
      case 'add':
      case 'addition':
        if (opArgs.length < 2) throw new Error('add requires two operands');
        result = add(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'subtract':
      case 'subtraction':
        if (opArgs.length < 2) throw new Error('subtract requires two operands');
        result = subtract(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'multiply':
      case 'multiplication':
        if (opArgs.length < 2) throw new Error('multiply requires two operands');
        result = multiply(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'divide':
      case 'division':
        if (opArgs.length < 2) throw new Error('divide requires two operands');
        result = divide(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'modulo':
        if (opArgs.length < 2) throw new Error('modulo requires two operands');
        result = modulo(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'power':
        if (opArgs.length < 2) throw new Error('power requires base and exponent');
        result = power(Number(opArgs[0]), Number(opArgs[1]));
        break;
      case 'sqrt':
      case 'squareroot':
      case 'squareroot':
      case 'squareRoot':
        if (opArgs.length < 1) throw new Error('square root requires one operand');
        result = squareRoot(Number(opArgs[0]));
        break;
      default:
        console.error(`Error: Unknown operation '${operation}'.`);
        printUsage();
        process.exit(1);
    }

    console.log(formatResult(result));
    process.exit(0);
  } catch (err) {
    // Provide specific exit codes for different failures
    const msg = err && err.message ? err.message : String(err);
    console.error('Error:', msg);
    if (/divide/i.test(msg) && /zero/i.test(msg)) process.exit(2);
    if (/modulo/i.test(msg) && /zero/i.test(msg)) process.exit(2);
    if (/square root/i.test(msg) || /square root/i.test(msg)) process.exit(3);
    process.exit(1);
  }
}
