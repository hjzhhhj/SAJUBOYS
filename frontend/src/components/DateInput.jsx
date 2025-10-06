import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  padding: 1.15rem 2rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const DateInput = ({ value, onChange, placeholder = "1990-01-01" }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setDisplayValue(`${year}-${month}-${day}`);
    }
  }, [value]);

  const formatDate = (input) => {
    const cleaned = input.replace(/[^\d-]/g, '');
    const numbers = cleaned.replace(/-/g, '');

    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
    return displayValue;
  };

  const handleChange = (e) => {
    const input = e.target.value;

    if (input.length > displayValue.length && input.endsWith('-')) {
      if (input.length === 5 || input.length === 8) {
        setDisplayValue(input);
        return;
      }
    }

    const formatted = formatDate(input);
    setDisplayValue(formatted);

    if (formatted.length === 10) {
      const [year, month, day] = formatted.split('-').map(Number);

      if (year >= 1900 && year <= new Date().getFullYear() &&
          month >= 1 && month <= 12 &&
          day >= 1 && day <= 31) {
        const date = new Date(year, month - 1, day);

        if (date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day) {
          onChange(date);
        }
      }
    } else {
      onChange(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && displayValue.endsWith('-')) {
      e.preventDefault();
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={10}
    />
  );
};

export default DateInput;