import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 100vh;
`

const SubTitle = styled.h1`
  color: white;
  font-size: 1.4rem;
  font-weight: 400;
`

const Title = styled.h1`
  color: white;
  font-size: 6.5rem;
  font-weight: 900;
`

const Button = styled.button`
  background-color: #ffffff10;
  color: white;
  border: 1px solid #ffffff;
  border-radius: 100px;
  font-size: 1.25rem;
  cursor: pointer;
  margin-top: 5rem;
  width: 28rem;
  height: 4rem;
  
  &:hover {
    background: #ffffff20;
  }
`

function Starting() {
  return (
    <Container>
      <SubTitle>오늘 당신의 사주를 확인해보세요</SubTitle>
      <Title>SAJUBOYS</Title>
      <Button>사주팔자 보러가기</Button>
    </Container>
  )
}

export default Starting
