import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
    if (waitingForSecondOperand) {
      setWaitingForSecondOperand(false);
    }
  };

  const handleOperationClick = (op) => {
    setFirstOperand(parseFloat(display));
    setOperation(op);
    setWaitingForSecondOperand(true);
    setDisplay('0');
  };

  const handleClearClick = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const handleEqualClick = () => {
    if (firstOperand === null || operation === null) return;

    const secondOperand = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = firstOperand + secondOperand;
    } else if (operation === '-') {
      result = firstOperand - secondOperand;
    } else if (operation === '*') {
      result = firstOperand * secondOperand;
    } else if (operation === '/') {
      if (secondOperand === 0) {
        setDisplay('Error');
        setFirstOperand(null);
        setOperation(null);
        setWaitingForSecondOperand(false);
        return;
      }
      result = firstOperand / secondOperand;
    }

    setDisplay(result.toString());
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{
        width: 320,
        padding: 2,
        borderRadius: 3,
        backgroundColor: '#ffffff'
      }}>
        <Box sx={{
          backgroundColor: '#333',
          color: 'white',
          padding: 2,
          borderRadius: 1,
          marginBottom: 2,
          textAlign: 'right',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
            {display}
          </Typography>
        </Box>
        <Grid container spacing={1}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: 60,
                  fontSize: 20,
                  backgroundColor: btn === 'C' ? '#f44336' : btn === '=' ? '#4caf50' : '#e0e0e0',
                  color: btn === 'C' || btn === '=' ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: btn === 'C' ? '#d32f2f' : btn === '=' ? '#388e3c' : '#d5d5d5'
                  }
                }}
                onClick={() => {
                  if (btn === 'C') handleClearClick();
                  else if (btn === '=') handleEqualClick();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                  else handleNumberClick(btn);
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
