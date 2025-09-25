import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSaju } from "../context/SajuContext";
import { useAuth } from "../context/AuthContext";
import styled, { keyframes } from "styled-components";
import AddressSearch from "../components/AddressSearch";
import DateInput from "../components/DateInput";
import LoadingSpinner from "../components/LoadingSpinner";

const float1 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-300px) translateY(100px);
  }
  50% {
    transform: translateX(-150px) translateY(-100px);
  }
  75% {
    transform: translateX(-250px) translateY(50px);
  }
`;

const float2 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(250px) translateY(-80px);
  }
  50% {
    transform: translateX(300px) translateY(100px);
  }
  75% {
    transform: translateX(150px) translateY(-50px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  margin-top: 1rem;
`;

const GradientCircle1 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(98, 0, 255, 0.31) 50%,
    #0e0025 100%
  );
  top: -300px;
  right: -200px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
`;

const GradientCircle2 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(98, 0, 255, 0.31) 50%,
    #0e0025 100%
  );
  bottom: -200px;
  left: 300px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  font-family: "Cinzel Decorative", cursive;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
  position: relative;

  &::after {
    content: "SAJUBOYS";
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background: none;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 80px rgba(118, 75, 162, 0.5);
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.8rem;
  width: 800px;
`;

const Input = styled.input`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
  padding: 1.25rem 2rem;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
  }
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin-bottom: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const Button = styled.button`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.2),
    rgba(118, 75, 162, 0.2)
  );
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 100px;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  width: 800px;
  height: 3.75rem;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &#btn1 {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.4),
      rgba(118, 75, 162, 0.4)
    );
    border-color: rgba(102, 126, 234, 0.3);
  }

  &#btn1:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.5),
      rgba(118, 75, 162, 0.5)
    );
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.3),
      rgba(118, 75, 162, 0.3)
    );
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  padding: 4px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4))"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.$active ? "500" : "400")};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))"
        : "rgba(255, 255, 255, 0.05)"};
    color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.7)")};
  }
`;

const DateToggleWrapper = styled.div`
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  width: 180px;
  box-sizing: border-box;
  padding: 4px;
`;

const DateToggleButton = styled.button`
  flex: 1;
  padding: 1.1rem 0.8rem;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4))"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.$active ? "500" : "400")};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))"
        : "rgba(255, 255, 255, 0.05)"};
    color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.7)")};
  }
`;

const DateInputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const DateInputWrapper = styled.div`
  flex: 1;
`;

const TimeSelect = styled.select`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  width: 240px;
  padding: 1.15rem 1.5rem;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
  }

  option {
    background-color: #1a1a1a;
    color: white;
  }
`;

function SajuInput() {
  const navigate = useNavigate();
  const { calculateSaju, loading, setLoading } = useSaju();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState("male");
  const [calendarType, setCalendarType] = useState("solar");
  const [birthDate, setBirthDate] = useState(null);
  const [birthTime, setBirthTime] = useState("");
  const [city, setCity] = useState("");
  const [resultData, setResultData] = useState(null);

  const handleSajuAnalysis = async () => {
    // 입력값 검증
    if (!name || !name.trim()) {
      alert("이름을 입력해주세요");
      return;
    }

    if (!birthDate) {
      alert("생년월일을 선택해주세요");
      return;
    }

    if (!birthTime) {
      alert("태어난 시간을 선택해주세요");
      return;
    }

    if (!city || !city.trim()) {
      alert("태어난 도시를 입력해주세요");
      return;
    }

    // 시간 처리 (API 형식에 맞게)
    let formattedTime = "00:00"; // 시간 모름일 때는 사용되지 않지만 빈 값 방지용
    if (birthTime !== "unknown") {
      const timeMap = {
        "23-01": "00:00",
        "01-03": "02:00",
        "03-05": "04:00",
        "05-07": "06:00",
        "07-09": "08:00",
        "09-11": "10:00",
        "11-13": "12:00",
        "13-15": "14:00",
        "15-17": "16:00",
        "17-19": "18:00",
        "19-21": "20:00",
        "21-23": "22:00",
      };
      formattedTime = timeMap[birthTime] || "00:00";
    }

    // API 형식에 맞게 데이터 포맷팅
    const formData = {
      name: name.trim(),
      gender: gender === "male" ? "남" : "여",
      birthDate: `${birthDate.getFullYear()}-${String(
        birthDate.getMonth() + 1
      ).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`, // YYYY-MM-DD 형식 (로컬 시간 기준)
      birthTime: formattedTime, // HH:MM 형식
      calendarType: calendarType === "solar" ? "양력" : "음력",
      city: city.trim(),
    };

    // 시간 모름일 때만 isTimeUnknown 추가
    if (birthTime === "unknown") {
      formData.isTimeUnknown = true;
    }

    try {
      const result = await calculateSaju(formData);

      if (result.success) {
        setResultData(result.data);
        // 버튼 클릭으로 이동
      } else {
        alert(result.error || "사주 계산에 실패했습니다");
      }
    } catch {
      alert("사주 계산 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSavedResults = () => {
    navigate("/saved-saju");
  };

  const timeOptions = [
    { value: "", label: "시간을 선택해주세요" },
    { value: "unknown", label: "시간 모름" },
    { value: "23-01", label: "자시 (23:00 - 01:00)" },
    { value: "01-03", label: "축시 (01:00 - 03:00)" },
    { value: "03-05", label: "인시 (03:00 - 05:00)" },
    { value: "05-07", label: "묘시 (05:00 - 07:00)" },
    { value: "07-09", label: "진시 (07:00 - 09:00)" },
    { value: "09-11", label: "사시 (09:00 - 11:00)" },
    { value: "11-13", label: "오시 (11:00 - 13:00)" },
    { value: "13-15", label: "미시 (13:00 - 15:00)" },
    { value: "15-17", label: "신시 (15:00 - 17:00)" },
    { value: "17-19", label: "유시 (17:00 - 19:00)" },
    { value: "19-21", label: "술시 (19:00 - 21:00)" },
    { value: "21-23", label: "해시 (21:00 - 23:00)" },
  ];

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>SAJUBOYS</Title>

        <InputWrapper>
          <Label>이름</Label>
          <Input
            placeholder="이름을 입력해주세요"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>성별</Label>
          <ToggleWrapper>
            <ToggleButton
              $active={gender === "male"}
              onClick={() => setGender("male")}
            >
              남성
            </ToggleButton>
            <ToggleButton
              $active={gender === "female"}
              onClick={() => setGender("female")}
            >
              여성
            </ToggleButton>
          </ToggleWrapper>
        </InputWrapper>

        <InputWrapper>
          <Label>생년월일시</Label>
          <DateInputRow>
            <DateToggleWrapper>
              <DateToggleButton
                $active={calendarType === "solar"}
                onClick={() => setCalendarType("solar")}
              >
                양력
              </DateToggleButton>
              <DateToggleButton
                $active={calendarType === "lunar"}
                onClick={() => setCalendarType("lunar")}
              >
                음력
              </DateToggleButton>
            </DateToggleWrapper>
            <DateInputWrapper>
              <DateInput
                value={birthDate}
                onChange={(date) => setBirthDate(date)}
                placeholder="생년월일 8자리를 입력해주세요"
              />
            </DateInputWrapper>
            <TimeSelect
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TimeSelect>
          </DateInputRow>
        </InputWrapper>

        <InputWrapper>
          <Label>도시명</Label>
          <AddressSearch
            placeholder="도시명을 입력해주세요"
            value={city}
            onChange={(value) => setCity(value)}
          />
        </InputWrapper>

        <Button id="btn1" onClick={handleSajuAnalysis} disabled={loading}>
          {loading ? "분석 중..." : "사주팔자 확인하기"}
        </Button>
        <Button onClick={handleSavedResults}>저장된 사주팔자 보러가기</Button>
      </ContentWrapper>

      {loading && (
        <LoadingSpinner
          message={resultData ? "사주 팔자 계산 완료!" : "사주 팔자 계산 중..."}
          subMessage={
            resultData
              ? "결과를 확인해보세요"
              : "당신의 운명을 분석하고 있습니다"
          }
          onSkip={
            resultData
              ? () => {
                  setLoading(false); // 버튼 클릭 시 로딩 상태 해제
                  navigate("/saju-result", { state: resultData });
                }
              : null
          }
        />
      )}
    </Container>
  );
}

export default SajuInput;
