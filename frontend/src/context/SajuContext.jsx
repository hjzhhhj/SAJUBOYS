import { createContext, useContext, useReducer } from 'react'
import { sajuAPI } from '../services/api'

const SajuContext = createContext()

const sajuReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESULT_DATA':
      return { ...state, resultData: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

const initialState = {
  resultData: null,
  loading: false,
  error: null
}

export const SajuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sajuReducer, initialState)

  const calculateSaju = async (inputData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await sajuAPI.calculate(inputData)
      
      if (response.success) {
        dispatch({ type: 'SET_RESULT_DATA', payload: response.data })
        return { success: true, data: response.data }
      }
      throw new Error(response.message || '사주 계산에 실패했습니다')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '사주 계산에 실패했습니다'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  return (
    <SajuContext.Provider value={{ ...state, calculateSaju }}>
      {children}
    </SajuContext.Provider>
  )
}

export const useSaju = () => {
  const context = useContext(SajuContext)
  if (!context) throw new Error('useSaju must be used within a SajuProvider')
  return context
}

export default SajuContext