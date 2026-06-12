#!/usr/bin/env node
"use strict";

// Node.js CLI Calculator
// Supported operations: add, subtract, multiply, divide
// Usage examples:
//   node src/calculator.js add 2 3
//   node src/calculator.js subtract 5 2
//   node src/calculator.js multiply 3 4
//   node src/calculator.js divide 10 2
// Optional precision flag: --precision N or -p N

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage: node src/calculator.js <operation> <num1> <num2> [--precision N]

Operations:
  add       Add two numbers (num1 + num2)
  subtract  Subtract two numbers (num1 - num2)
  multiply  Multiply two numbers (num1 * num2)
  divide    Divide two numbers (num1 / num2)

Options:
  --precision, -p  Number of decimal places to round the result to (optional)
  --help           Show this help message
`);
}

if (args.length === 0 || args.includes('--help')) {
  printUsage();
  process.exit(0);
}

// Parse precision flag if present
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

if (filteredArgs.length < 3) {
  console.error('Error: Missing arguments. Expected: <operation> <num1> <num2>');
  printUsage();
  process.exit(1);
}

const [operation, aStr, bStr] = filteredArgs;
const a = Number(aStr);
const b = Number(bStr);

if (!isFinite(a) || !isFinite(b) || isNaN(a) || isNaN(b)) {
  console.error('Error: Both operands must be valid numbers');
  process.exit(1);
}

function formatResult(n) {
  if (precision === null) return String(n);
  return Number(n).toFixed(precision);
}

let result;
switch (operation.toLowerCase()) {
  case 'add':
    result = a + b;
    break;
  case 'subtract':
    result = a - b;
    break;
  case 'multiply':
    result = a * b;
    break;
  case 'divide':
    if (b === 0) {
      console.error('Error: Division by zero');
      process.exit(2);
    }
    result = a / b;
    break;
  default:
    console.error(`Error: Unknown operation '${operation}'.`);
    printUsage();
    process.exit(1);
}

console.log(formatResult(result));
