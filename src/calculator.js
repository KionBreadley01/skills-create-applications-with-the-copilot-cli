// addition
function add(a, b) {
  return a + b;
}

// subtraction
function subtract(a, b) {
  return a - b;
}

// multiplication
function multiply(a, b) {
  return a * b;
}

// division
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

function addition(a, b) { return add(a, b); }
function subtraction(a, b) { return subtract(a, b); }
function multiplication(a, b) { return multiply(a, b); }
function division(a, b) { return divide(a, b); }

module.exports = { addition, subtraction, multiplication, division, add, subtract, multiply, divide };