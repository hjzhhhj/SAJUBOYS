#!/bin/bash

echo "=== 사주 저장 기능 테스트 ==="
echo ""

API_URL="http://localhost:3001/api"
EMAIL="test$(date +%s)@test.com"
PASSWORD="Test1234!"

echo "1. 회원가입..."
SIGNUP_RESPONSE=$(curl -s -X POST $API_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"테스트유저\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "응답: $SIGNUP_RESPONSE"
echo ""

echo "2. 로그인..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "응답: $LOGIN_RESPONSE"

# JWT 토큰 추출
TOKEN=$(echo $LOGIN_RESPONSE | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
echo "토큰: ${TOKEN:0:20}..."
echo ""

echo "3. 사주 계산 (비로그인)..."
CALC_RESPONSE=$(curl -s -X POST $API_URL/saju/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "name":"홍길동",
    "gender":"남",
    "birthDate":"1990-01-01",
    "birthTime":"12:00",
    "calendarType":"양력",
    "city":"서울",
    "isTimeUnknown":false
  }')
echo "응답: ${CALC_RESPONSE:0:100}..."

# 사주 ID 추출
SAJU_ID=$(echo $CALC_RESPONSE | sed -n 's/.*"_id":"\([^"]*\)".*/\1/p')
echo "사주 ID: $SAJU_ID"
echo ""

echo "4. 결과 저장 (인증 없이 - 실패해야 함)..."
SAVE_FAIL=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/saju/$SAJU_ID/save \
  -H "Content-Type: application/json" \
  -d '{}')
echo "HTTP 상태 코드: $SAVE_FAIL (401이어야 함)"
echo ""

echo "5. 결과 저장 (인증 있이 - 성공해야 함)..."
SAVE_SUCCESS=$(curl -s -X POST $API_URL/saju/$SAJU_ID/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')
echo "응답: $SAVE_SUCCESS"
echo ""

echo "6. 저장된 결과 조회..."
SAVED_RESULTS=$(curl -s -X GET $API_URL/saju/saved \
  -H "Authorization: Bearer $TOKEN")
echo "응답: ${SAVED_RESULTS:0:100}..."
echo ""

echo "=== 테스트 완료 ==="