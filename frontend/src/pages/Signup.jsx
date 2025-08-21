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
  padding: 2rem 0;
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

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 400px;
  z-index: 1;
`

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: #150137;
    background-color: white;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #150137;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1e0250;
    transform: translateY(-2px);
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
      <SignupForm onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호 (6자 이상)"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '가입하기'}
        </Button>
        <LinkText>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </LinkText>
      </SignupForm>
    </Container>
  )
}

export default Signup