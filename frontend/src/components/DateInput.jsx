import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  color: gray;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  padding: 1.25rem 2rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #6200ff;
  }
  
  &::placeholder {
    color: #999;
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
    // 숫자와 하이픈만 유지
    const cleaned = input.replace(/[^\d-]/g, '');
    
    // 숫자만 추출
    const numbers = cleaned.replace(/-/g, '');
    
    let formatted = '';
    
    // YYYY-MM-DD 형식으로 자동 포맷팅
    if (numbers.length <= 4) {
      formatted = numbers;
    } else if (numbers.length <= 6) {
      formatted = `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else if (numbers.length <= 8) {
      formatted = `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    } else {
      // 8자리 초과 입력 방지
      return displayValue;
    }
    
    return formatted;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    
    // 직접 하이픈을 입력한 경우 처리
    if (input.length > displayValue.length && input.endsWith('-')) {
      if (input.length === 5 || input.length === 8) {
        setDisplayValue(input);
        return;
      }
    }
    
    const formatted = formatDate(input);
    setDisplayValue(formatted);
    
    // YYYY-MM-DD 형식이 완성되면 Date 객체로 변환하여 부모에 전달
    if (formatted.length === 10) {
      const [year, month, day] = formatted.split('-').map(Number);
      
      // 유효한 범위 체크
      if (year >= 1900 && year <= new Date().getFullYear() && 
          month >= 1 && month <= 12 && 
          day >= 1 && day <= 31) {
        const date = new Date(year, month - 1, day);
        
        // 유효한 날짜인지 확인
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
    // 백스페이스 키 처리
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