import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const loading = document.getElementById('loading');

let currentInput = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

async function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        currentInput += value;
        updateDisplay();
    } else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '') {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
                currentInput = '';
                operator = value;
            } else {
                await performCalculation();
                operator = value;
            }
        }
    } else if (value === '=') {
        if (currentInput !== '' && firstOperand !== null) {
            await performCalculation();
        }
    } else if (value === 'Clear') {
        clear();
    }
}

function updateDisplay() {
    display.value = currentInput;
}

async function performCalculation() {
    if (firstOperand === null || operator === '' || currentInput === '') return;

    const secondOperand = parseFloat(currentInput);
    let result;

    loading.classList.remove('hidden');

    try {
        switch (operator) {
            case '+':
                result = await backend.add(firstOperand, secondOperand);
                break;
            case '-':
                result = await backend.subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = await backend.multiply(firstOperand, secondOperand);
                break;
            case '/':
                const divisionResult = await backend.divide(firstOperand, secondOperand);
                if (divisionResult === null) {
                    throw new Error('Division by zero');
                }
                result = divisionResult;
                break;
        }

        currentInput = result.toString();
        firstOperand = null;
        operator = '';
        updateDisplay();
    } catch (error) {
        console.error('Calculation error:', error);
        currentInput = 'Error';
        updateDisplay();
    } finally {
        loading.classList.add('hidden');
    }
}

function clear() {
    currentInput = '';
    operator = '';
    firstOperand = null;
    updateDisplay();
}
