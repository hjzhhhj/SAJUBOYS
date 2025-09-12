import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { SajuProvider } from '../context/SajuContext'
import SavedSaju from './SavedSaju'
import { sajuAPI } from '../services/api'

// Mock API
jest.mock('../services/api', () => ({
  sajuAPI: {
    getSavedResults: jest.fn(),
    getSajuById: jest.fn()
  }
}))

// Mock navigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SajuProvider>
          {component}
        </SajuProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('SavedSaju Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  test('저장된 사주 목록을 표시해야 함', async () => {
    const mockSavedResults = [
      {
        _id: '1',
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '2',
        name: '김영희',
        gender: '여',
        birthDate: '1995-05-15',
        birthTime: '14:00',
        createdAt: '2024-01-02T00:00:00Z'
      }
    ]

    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: mockSavedResults
    })

    renderWithProviders(<SavedSaju />)

    // 로딩 상태 확인
    expect(screen.getByText(/저장된 사주를 불러오는 중/)).toBeInTheDocument()

    // 데이터 로드 대기
    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument()
      expect(screen.getByText('김영희')).toBeInTheDocument()
    })

    // 생년월일 표시 확인
    expect(screen.getByText(/1990년 1월 1일/)).toBeInTheDocument()
    expect(screen.getByText(/1995년 5월 15일/)).toBeInTheDocument()
  })

  test('저장된 사주가 없을 때 빈 상태 메시지를 표시해야 함', async () => {
    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: []
    })

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('저장된 사주가 없습니다')).toBeInTheDocument()
      expect(screen.getByText('새로운 사주를 계산하고 저장해보세요')).toBeInTheDocument()
    })

    // 사주 계산하기 버튼 확인
    const calculateButton = screen.getByText('사주 계산하기')
    expect(calculateButton).toBeInTheDocument()
  })

  test('사주 카드 클릭시 상세 페이지로 이동해야 함', async () => {
    const mockSavedResult = {
      _id: '1',
      name: '홍길동',
      gender: '남',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      createdAt: '2024-01-01T00:00:00Z'
    }

    const mockDetailResult = {
      ...mockSavedResult,
      fourPillars: {
        year: { heaven: '경', earth: '오' },
        month: { heaven: '정', earth: '축' },
        day: { heaven: '갑', earth: '자' },
        time: { heaven: '경', earth: '오' }
      },
      interpretation: {
        personality: '테스트 성격',
        career: '테스트 직업운',
        relationship: '테스트 연애운',
        wealth: '테스트 재물운',
        health: '테스트 건강운',
        fortune: '테스트 총운'
      }
    }

    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: [mockSavedResult]
    })

    sajuAPI.getSajuById.mockResolvedValue({
      success: true,
      data: mockDetailResult
    })

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument()
    })

    // 카드 클릭
    const card = screen.getByText('홍길동').closest('div[role="button"]') || 
                 screen.getByText('홍길동').parentElement.parentElement
    fireEvent.click(card)

    await waitFor(() => {
      expect(sajuAPI.getSajuById).toHaveBeenCalledWith('1')
      expect(mockNavigate).toHaveBeenCalledWith('/saju-result', {
        state: { resultData: mockDetailResult }
      })
    })
  })

  test('삭제 버튼 클릭시 사주를 삭제해야 함', async () => {
    const mockSavedResult = {
      _id: '1',
      name: '홍길동',
      gender: '남',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      createdAt: '2024-01-01T00:00:00Z'
    }

    sajuAPI.getSavedResults
      .mockResolvedValueOnce({
        success: true,
        data: [mockSavedResult]
      })
      .mockResolvedValueOnce({
        success: true,
        data: []
      })

    // window.confirm mock
    window.confirm = jest.fn(() => true)

    // fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )

    // localStorage에 user 정보 설정
    localStorage.setItem('user', JSON.stringify({
      accessToken: 'test-token'
    }))

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument()
    })

    // 삭제 버튼 클릭
    const deleteButton = screen.getByText('삭제')
    fireEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith('정말로 삭제하시겠습니까?')

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/saju/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer test-token'
          }
        })
      )
    })

    // 목록이 다시 로드되어 빈 상태가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('저장된 사주가 없습니다')).toBeInTheDocument()
    })
  })

  test('시간 모름 케이스를 올바르게 표시해야 함', async () => {
    const mockSavedResult = {
      _id: '1',
      name: '홍길동',
      gender: '남',
      birthDate: '1990-01-01',
      birthTime: '00:00',
      isTimeUnknown: true,
      createdAt: '2024-01-01T00:00:00Z'
    }

    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: [mockSavedResult]
    })

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('시간 모름')).toBeInTheDocument()
    })
  })

  test('새로운 사주 계산 버튼 클릭시 입력 페이지로 이동해야 함', async () => {
    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: []
    })

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('저장된 사주가 없습니다')).toBeInTheDocument()
    })

    const newCalculateButton = screen.getByText('새로운 사주 계산')
    fireEvent.click(newCalculateButton)

    expect(mockNavigate).toHaveBeenCalledWith('/saju-input')
  })

  test('API 에러시 에러 메시지를 표시해야 함', async () => {
    sajuAPI.getSavedResults.mockRejectedValue(new Error('Network error'))

    // console.error를 mock하여 에러 로그 숨기기
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('저장된 사주가 없습니다')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  test('사주 상세 조회 실패시 alert를 표시해야 함', async () => {
    const mockSavedResult = {
      _id: '1',
      name: '홍길동',
      gender: '남',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      createdAt: '2024-01-01T00:00:00Z'
    }

    sajuAPI.getSavedResults.mockResolvedValue({
      success: true,
      data: [mockSavedResult]
    })

    sajuAPI.getSajuById.mockRejectedValue(new Error('Failed to load'))

    // alert mock
    window.alert = jest.fn()

    // console.error를 mock하여 에러 로그 숨기기
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    renderWithProviders(<SavedSaju />)

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument()
    })

    // 카드 클릭
    const card = screen.getByText('홍길동').closest('div[role="button"]') ||
                 screen.getByText('홍길동').parentElement.parentElement
    fireEvent.click(card)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('사주 결과를 불러오는데 실패했습니다')
    })

    consoleSpy.mockRestore()
  })
})