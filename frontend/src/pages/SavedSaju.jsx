import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { sajuAPI } from "../services/api";

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
  background-color: black;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding: 2rem 1rem;
  width: 100%;
`;

const GradientCircle1 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(135, 60, 255, 0.3) 50%,
    #0e0025 100%
  );
  top: -200px;
  right: -100px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    top: -300px;
    right: -200px;
  }
`;

const GradientCircle2 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(135, 60, 255, 0.3) 50%,
    #0e0025 100%
  );
  bottom: -150px;
  left: 100px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    bottom: -200px;
    left: 300px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 1.5rem;
  font-family: "Cinzel", cursive;
  letter-spacing: 1.5px;
  text-align: center;
  position: relative;
  line-height: 1.2;

  @media (min-width: 769px) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1025px) {
    font-size: 3.5rem;
  }
`;

const BackButton = styled.button`
  background: rgba(190, 144, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(200, 160, 255, 0.5);
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  position: absolute;
  top: 25px;
  right: 40px;
  box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(150, 100, 200, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const SavedList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 30px;
`;

const SavedCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(180, 140, 230, 0.6);
    box-shadow: 0 0 25px rgba(150, 100, 200, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CardName = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  font-weight: 600;
`;

const CardInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.8;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoValue = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.8);
`;

const EmptyTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
`;

const CalculateButton = styled.button`
  background: rgba(190, 144, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(200, 160, 255, 0.5);
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(150, 100, 200, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  padding: 40px;
  margin-top: 100px;
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const SavedSaju = () => {
  const navigate = useNavigate();
  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    try {
      setLoading(true);
      const response = await sajuAPI.getSavedResults();
      if (response.success) {
        setSavedResults(response.data);
      }
    } catch {
      alert("저장된 결과를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (sajuId) => {
    try {
      const response = await sajuAPI.getSajuById(sajuId);

      if (response.success) {
        // 결과 페이지로 이동하면서 데이터 전달
        navigate("/saju-result", {
          state: {
            resultData: response.data,
            isFromSaved: true,
          },
        });
      } else {
        alert("사주 결과를 불러오는데 실패했습니다");
      }
    } catch {
      alert("사주 결과를 불러오는데 실패했습니다");
    }
  };

  const handleDelete = async (e, sajuId) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/saju/${sajuId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user"))?.accessToken
          }`,
        },
      });

      if (response.ok) {
        // 삭제 성공 시 목록 새로고침
        loadSavedResults();
      } else {
        alert("삭제에 실패했습니다");
      }
    } catch {
      alert("삭제에 실패했습니다");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (result) => {
    if (result.isTimeUnknown) {
      return "시간 모름";
    }

    if (!result.birthTime) {
      return "시간 모름";
    }

    const timeMap = {
      "00:00": "자시 (23:00 - 01:00)",
      "02:00": "축시 (01:00 - 03:00)",
      "04:00": "인시 (03:00 - 05:00)",
      "06:00": "묘시 (05:00 - 07:00)",
      "08:00": "진시 (07:00 - 09:00)",
      "10:00": "사시 (09:00 - 11:00)",
      "12:00": "오시 (11:00 - 13:00)",
      "14:00": "미시 (13:00 - 15:00)",
      "16:00": "신시 (15:00 - 17:00)",
      "18:00": "유시 (17:00 - 19:00)",
      "20:00": "술시 (19:00 - 21:00)",
      "22:00": "해시 (21:00 - 23:00)",
    };

    return timeMap[result.birthTime] || result.birthTime;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>저장된 사주를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <BackButton onClick={() => navigate("/saju-input")}>
          새로운 사주 계산
        </BackButton>
        <Header>
          <Title>SAVED</Title>
        </Header>

        {savedResults.length === 0 ? (
          <EmptyMessage>
            <EmptyTitle>저장된 사주가 없습니다</EmptyTitle>
            <EmptyDescription>
              새로운 사주를 계산하고 저장해보세요
            </EmptyDescription>
            <CalculateButton onClick={() => navigate("/saju-input")}>
              사주 계산하기
            </CalculateButton>
          </EmptyMessage>
        ) : (
          <SavedList>
            {savedResults.map((result) => (
              <SavedCard
                key={result._id}
                onClick={() => handleCardClick(result._id)}
              >
                <CardHeader>
                  <CardName>{result.name}</CardName>
                  <DeleteButton onClick={(e) => handleDelete(e, result._id)}>
                    삭제
                  </DeleteButton>
                </CardHeader>
                <CardInfo>
                  <InfoRow>
                    <InfoLabel>생년월일:</InfoLabel>
                    <InfoValue>{formatDate(result.birthDate)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>출생시간:</InfoLabel>
                    <InfoValue>{formatTime(result)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>성별:</InfoLabel>
                    <InfoValue>{result.gender}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>저장일:</InfoLabel>
                    <InfoValue>{formatDate(result.createdAt)}</InfoValue>
                  </InfoRow>
                </CardInfo>
              </SavedCard>
            ))}
          </SavedList>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default SavedSaju;
