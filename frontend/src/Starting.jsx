import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  margin-top: 5rem;
`;

const GradientCircle1 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(98, 0, 255, 0.31) 50%,
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
    rgba(98, 0, 255, 0.31) 50%,
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

const SubTitle = styled.h1`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 6.5rem;
  font-weight: 900;
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
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4.5rem;
  padding: 1rem 3.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 28rem;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.25),
      rgba(118, 75, 162, 0.25)
    );
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

function Starting() {
  const navigate = useNavigate();

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <SubTitle>오늘 당신의 사주를 확인해보세요</SubTitle>
        <Title>SAJUBOYS</Title>
        <Button onClick={() => navigate("/login")}>사주팔자 보러가기</Button>
      </ContentWrapper>
    </Container>
  );
}

export default Starting;
