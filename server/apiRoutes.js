const express = require('express');

// Для работы с базой данных
const mongoDb = global.mongoDb;

const router = express.Router();

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', (req, res) => {
  try {
    const { number1, number2, operation } = req.body;

    // Проверка на наличие всех необходимых параметров
    if (number1 === undefined || number2 === undefined || !operation) {
      return res.status(400).json({
        error: 'Missing required parameters. Please provide number1, number2, and operation.'
      });
    }

    // Преобразование входных данных в числа
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    // Проверка на валидность чисел
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: 'Invalid numbers provided. Please ensure number1 and number2 are valid numbers.'
      });
    }

    let result;

    // Выполнение операции
    switch (operation) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        if (num2 === 0) {
          return res.status(400).json({
            error: 'Division by zero is not allowed.'
          });
        }
        result = num1 / num2;
        break;
      default:
        return res.status(400).json({
          error: 'Invalid operation. Supported operations are: add, subtract, multiply, divide.'
        });
    }

    // Возврат результата
    res.json({
      result,
      operation,
      number1: num1,
      number2: num2
    });
  } catch (error) {
    console.error('Error processing calculation:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

module.exports = router;
