import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSaju } from '../context/SajuContext'
import { useAuth } from '../context/AuthContext'
import { sajuAPI } from '../services/api'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: 600;
`

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SavedList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`

const SavedCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const CardName = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
`

const CardDate = styled.span`
  color: #666;
  font-size: 12px;
`

const CardInfo = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`

const InfoLabel = styled.span`
  font-weight: 500;
`

const InfoValue = styled.span`
  color: #764ba2;
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
`

const EmptyTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`

const EmptyDescription = styled.p`
  font-size: 16px;
  opacity: 0.9;
`

const CalculateButton = styled.button`
  background: white;
  color: #764ba2;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  color: white;
  font-size: 18px;
  padding: 40px;
`

const DeleteButton = styled.button`
  background: #ff5252;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff1744;
  }
`

const SavedSaju = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [savedResults, setSavedResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSavedResults()
  }, [])

  const loadSavedResults = async () => {
    try {
      setLoading(true)
      const response = await sajuAPI.getSavedResults()
      if (response.success) {
        setSavedResults(response.data)
      } else {
        setError(response.message || '저장된 결과를 불러오는데 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to load saved results:', error)
      setError('저장된 결과를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = async (sajuId) => {
    try {
      const response = await sajuAPI.getSajuById(sajuId)
      if (response.success) {
        // 결과 페이지로 이동하면서 데이터 전달
        navigate('/saju-result', { state: { resultData: response.data } })
      } else {
        alert('사주 결과를 불러오는데 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to load saju:', error)
      alert('사주 결과를 불러오는데 실패했습니다')
    }
  }

  const handleDelete = async (e, sajuId) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/saju/${sajuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.accessToken}`
        }
      })

      if (response.ok) {
        // 삭제 성공 시 목록 새로고침
        loadSavedResults()
      } else {
        alert('삭제에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('삭제에 실패했습니다')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00') return '시간 모름'
    return timeString
  }

  if (loading) {
    return (
      <Container>
        <LoadingMessage>저장된 사주를 불러오는 중...</LoadingMessage>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>저장된 사주</Title>
        <BackButton onClick={() => navigate('/saju-input')}>
          새로운 사주 계산
        </BackButton>
      </Header>

      <Content>
        {savedResults.length === 0 ? (
          <EmptyMessage>
            <EmptyTitle>저장된 사주가 없습니다</EmptyTitle>
            <EmptyDescription>
              새로운 사주를 계산하고 저장해보세요
            </EmptyDescription>
            <CalculateButton onClick={() => navigate('/saju-input')}>
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
                    <InfoValue>{formatTime(result.birthTime)}</InfoValue>
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
      </Content>
    </Container>
  )
}

export default SavedSaju