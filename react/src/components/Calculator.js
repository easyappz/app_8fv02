import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const CalculatorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  maxWidth: '400px',
  margin: 'auto',
  backgroundColor: '#f5f5f5',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const Display = styled(TextField)({
  width: '100%',
  marginBottom: '20px',
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '1.5rem',
    padding: '10px',
  },
});

const ButtonsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '10px',
  width: '100%',
});

const CalcButton = styled(Button)({
  padding: '20px',
  fontSize: '1.2rem',
  backgroundColor: '#e0e0e0',
  color: '#000',
  '&:hover': {
    backgroundColor: '#d5d5d5',
  },
});

const OperationButton = styled(CalcButton)({
  backgroundColor: '#ff9500',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#e68a00',
  },
});

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num) => {
    if (display === '0' && num !== '.') {
      setDisplay(num);
    } else if (waitingForSecondOperand) {
      setDisplay(num);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperationClick = (op) => {
    setFirstOperand(parseFloat(display));
    setOperation(op);
    setWaitingForSecondOperand(true);
  };

  const calculateResult = async () => {
    if (!firstOperand || !operation) return;

    const secondOperand = parseFloat(display);
    setLoading(true);

    try {
      // Map operation symbols to API operation names
      let apiOperation;
      if (operation === '+') {
        apiOperation = 'add';
      } else if (operation === '-') {
        apiOperation = 'subtract';
      } else if (operation === '*') {
        apiOperation = 'multiply';
      } else if (operation === '/') {
        apiOperation = 'divide';
      }

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number1: firstOperand,
          number2: secondOperand,
          operation: apiOperation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      setDisplay(data.result.toString());
      setFirstOperand(null);
      setOperation(null);
      setWaitingForSecondOperand(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to calculate result');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const handleCloseSnackbar = () => {
    setError(false);
  };

  return (
    <CalculatorContainer>
      <Typography variant="h4" gutterBottom>
        Calculator
      </Typography>
      <Display
        value={display}
        variant="outlined"
        disabled
        inputProps={{ 'aria-label': 'Calculator Display' }}
      />
      <ButtonsGrid>
        <CalcButton onClick={() => handleClear()} variant="contained">C</CalcButton>
        <CalcButton onClick={() => handleNumberClick('7')} variant="contained">7</CalcButton>
        <CalcButton onClick={() => handleNumberClick('8')} variant="contained">8</CalcButton>
        <CalcButton onClick={() => handleNumberClick('9')} variant="contained">9</CalcButton>
        <OperationButton onClick={() => handleOperationClick('/')} variant="contained">/</OperationButton>
        <CalcButton onClick={() => handleNumberClick('4')} variant="contained">4</CalcButton>
        <CalcButton onClick={() => handleNumberClick('5')} variant="contained">5</CalcButton>
        <CalcButton onClick={() => handleNumberClick('6')} variant="contained">6</CalcButton>
        <OperationButton onClick={() => handleOperationClick('*')} variant="contained">*</OperationButton>
        <CalcButton onClick={() => handleNumberClick('1')} variant="contained">1</CalcButton>
        <CalcButton onClick={() => handleNumberClick('2')} variant="contained">2</CalcButton>
        <CalcButton onClick={() => handleNumberClick('3')} variant="contained">3</CalcButton>
        <OperationButton onClick={() => handleOperationClick('-')} variant="contained">-</OperationButton>
        <CalcButton onClick={() => handleNumberClick('0')} variant="contained">0</CalcButton>
        <CalcButton onClick={() => handleNumberClick('.')} variant="contained">.</CalcButton>
        <CalcButton 
          onClick={calculateResult} 
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '='}
        </CalcButton>
        <OperationButton onClick={() => handleOperationClick('+')} variant="contained">+</OperationButton>
      </ButtonsGrid>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </CalculatorContainer>
  );
};

export default Calculator;
