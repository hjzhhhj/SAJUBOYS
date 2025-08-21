import { createContext, useContext, useReducer } from 'react'
import { sajuAPI } from '../services/api'

const SajuContext = createContext()

const sajuReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INPUT_DATA':
      return {
        ...state,
        inputData: action.payload
      }
    case 'SET_RESULT_DATA':
      return {
        ...state,
        resultData: action.payload,
        loading: false
      }
    case 'ADD_SAVED_RESULT':
      return {
        ...state,
        savedResults: [...state.savedResults, action.payload]
      }
    case 'SET_SAVED_RESULTS':
      return {
        ...state,
        savedResults: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const initialState = {
  inputData: null,
  resultData: null,
  savedResults: [],
  loading: false,
  error: null
}

export const SajuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sajuReducer, initialState)

  const setInputData = (data) => {
    dispatch({ type: 'SET_INPUT_DATA', payload: data })
  }

  const calculateSaju = async (inputData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await sajuAPI.calculate(inputData)
      
      if (response.success) {
        dispatch({ type: 'SET_RESULT_DATA', payload: response.data })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || '사주 계산에 실패했습니다')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '사주 계산에 실패했습니다'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const saveResult = async (resultData) => {
    try {
      // TODO: 실제 저장 API 호출
      // const response = await fetch('/api/saju/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(resultData)
      // })
      
      // 임시로 로컬 스토리지에 저장
      const savedResults = JSON.parse(localStorage.getItem('savedSajuResults') || '[]')
      const newResult = { ...resultData, savedAt: new Date().toISOString() }
      savedResults.push(newResult)
      localStorage.setItem('savedSajuResults', JSON.stringify(savedResults))
      
      dispatch({ type: 'ADD_SAVED_RESULT', payload: newResult })
      return { success: true }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const getSavedResults = async () => {
    try {
      const response = await sajuAPI.getSavedResults()
      
      if (response.success) {
        dispatch({ type: 'SET_SAVED_RESULTS', payload: response.data })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || '저장된 결과를 가져오는데 실패했습니다')
      }
    } catch (error) {
      // 로그인하지 않은 경우 로컬 스토리지에서 가져오기
      if (error.response?.status === 401) {
        const savedResults = JSON.parse(localStorage.getItem('savedSajuResults') || '[]')
        dispatch({ type: 'SET_SAVED_RESULTS', payload: savedResults })
        return { success: true, data: savedResults }
      }
      
      const errorMessage = error.response?.data?.message || error.message || '저장된 결과를 가져오는데 실패했습니다'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    setInputData,
    calculateSaju,
    saveResult,
    getSavedResults,
    clearError
  }

  return (
    <SajuContext.Provider value={value}>
      {children}
    </SajuContext.Provider>
  )
}

export const useSaju = () => {
  const context = useContext(SajuContext)
  if (!context) {
    throw new Error('useSaju must be used within a SajuProvider')
  }
  return context
}

export default SajuContext