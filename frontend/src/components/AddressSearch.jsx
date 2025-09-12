import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import debounce from "lodash/debounce";

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.25rem 3rem 1.25rem 2rem;
  border: 1px solid #ffffff;
  border-radius: 16px;
  font-size: 1rem;
  background-color: #ffffff;
  color: gray;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ffffff;
  }

  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  fill: #666;
  pointer-events: none;
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
`;

const ResultItem = styled.li`
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const PlaceName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const AddressSearch = ({
  value,
  onChange,
  placeholder = "주소를 입력하세요",
}) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  // 검색 함수
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/api/saju/search-address",
          {
            params: { query: searchQuery },
            timeout: 3000, // 3초 타임아웃 설정
          }
        );
        setResults(response.data.data || []);
        setShowResults(true);
      } catch {
        // API 실패 시 빈 결과 표시
        setResults([]);
        setShowResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    debouncedSearch(newValue);
  };

  // 주소 선택 처리
  const handleSelectAddress = (address) => {
    const displayText = address.placeName || address.address;
    setQuery(displayText);
    onChange(displayText);
    setShowResults(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // value prop 변경 시 query 업데이트
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  return (
    <Container ref={containerRef}>
      <InputContainer>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
        />
        <SearchIcon viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </SearchIcon>
      </InputContainer>

      {showResults && (
        <ResultsList>
          {isLoading ? (
            <LoadingSpinner>검색 중...</LoadingSpinner>
          ) : results.length > 0 ? (
            results.map((address, index) => (
              <ResultItem
                key={index}
                onClick={() => handleSelectAddress(address)}
              >
                <PlaceName>{address.placeName}</PlaceName>
              </ResultItem>
            ))
          ) : query.length >= 2 ? (
            <NoResults>검색 결과가 없습니다</NoResults>
          ) : null}
        </ResultsList>
      )}
    </Container>
  );
};

export default AddressSearch;
