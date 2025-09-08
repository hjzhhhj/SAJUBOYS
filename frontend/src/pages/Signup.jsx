import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 3rem;
`

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 840px;
`

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 3rem;
  font-family: 'Cinzel Decorative', cursive;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
`

const Label = styled.label`
  color: white;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  color: gray;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
  padding: 1.25rem 2rem;
  box-sizing: border-box;
  
  &::placeholder {
    color: #a7a7a7;
  }
  
  &:focus {
    outline: none;
    background-color: white;
  }
`

const Button = styled.button`
  background-color: #ffffff20;
  color: white;
  border: 1px solid #ffffff;
  border-radius: 100px;
  font-size: 1.25rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  height: 3.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffffff30;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const LinkText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`

const SuccessMessage = styled.p`
  color: #51cf66;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`

function Signup() {
  const navigate = useNavigate()
  const { signup, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const result = await signup(formData.name, formData.email, formData.password)
    
    if (result.success) {
      setSuccess('회원가입이 완료되었습니다!')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setError(result.error || '회원가입에 실패했습니다')
    }
  }

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>SAJUBOYS</Title>
        <SignupForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <InputWrapper>
            <Label>이름</Label>
            <Input
              type="text"
              name="name"
              placeholder="이름을 입력해주세요"
              value={formData.name}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>이메일</Label>
            <Input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요 (6자 이상)"
              value={formData.password}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </Button>
          <LinkText>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </LinkText>
        </SignupForm>
      </ContentWrapper>
    </Container>
  )
}

export default Signup