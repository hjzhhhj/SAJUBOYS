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

const SubTitle = styled.h1`
  color: #e2c8ff;
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 1.25rem;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #bfa8ff, #9d7bff, #e2c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 6rem;
  font-weight: 900;
  font-family: "Cinzel Decorative", cursive;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
  position: relative;
  margin-bottom: 1rem;

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
    rgba(102, 126, 234, 0.3),
    rgba(118, 75, 162, 0.3)
  );
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 5rem;
  width: 450px;
  height: 4rem;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.4),
      rgba(118, 75, 162, 0.4)
    );
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }
`;

function Starting() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <SubTitle>오늘 당신의 사주를 확인해보세요</SubTitle>
        <Title>SAJUBOYS</Title>
        <Button onClick={handleClick}>사주팔자 보러가기</Button>
      </ContentWrapper>
    </Container>
  );
}

export default Starting;
