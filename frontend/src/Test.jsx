import { useState } from 'react'
import styled, { keyframes } from 'styled-components'

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
`

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
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 96vh;
  position: relative;
  overflow: hidden;
  padding: 0 0 40px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 3rem;
`

const GradientCircle1 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(98, 0, 255, 0.31) 50%, #0E0025 100%);
  top: -300px;
  right: -200px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
`

const GradientCircle2 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(98, 0, 255, 0.31) 50%, #0E0025 100%);
  bottom: -200px;
  left: 300px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
`

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 2rem;
`

const Input = styled.input`
  color: gray;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0;
  width: 800px;
  padding: 1.25rem 2rem;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  color: white;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const Button = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #ffffff;
  border-radius: 100px;
  font-size: 1.25rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 870px;
  height: 3.75rem;
  
  &#btn1 {
    background-color: #ffffff20;
  }

  &#btn1:hover {
    background: #ffffff30;
  }
  
  &:hover {
    background: #ffffff30;
  }
`

function Test() {
  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>SAJUBOYS</Title>
        <InputWrapper>
          <Label>이름</Label>
          <Input placeholder='이름을 입력해주세요' type='text'></Input>
        </InputWrapper>
        <InputWrapper>
          <Label>생년월일</Label>
          <Input placeholder='생년월일을 입력해주세요' type='text'></Input>
        </InputWrapper>
        <InputWrapper>
          <Label>시간</Label>
          <Input placeholder='태어난 시간을 입력해주세요' type='text'></Input>
        </InputWrapper>
        <InputWrapper>
          <Label>도시명</Label>
          <Input placeholder='도시명을 입력해주세요' type='text'></Input>
        </InputWrapper>
        <Button id='btn1'>사주팔자 확인하기</Button>
        <Button>저장된 사주팔자 보러가기</Button>
      </ContentWrapper>
    </Container>
  )
}

export default Test
