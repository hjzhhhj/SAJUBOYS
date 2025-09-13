import { createContext, useContext, useReducer } from "react";
import { sajuAPI } from "../services/api";

const SajuContext = createContext();

const sajuReducer = (state, action) => {
  switch (action.type) {
    case "SET_RESULT_DATA":
      return { ...state, resultData: action.payload }; // loading을 false로 바꾸지 않음
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  resultData: null,
  loading: false,
  error: null,
};

export const SajuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sajuReducer, initialState);

  const calculateSaju = async (inputData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // 최소 로딩 시간 보장
      const [response] = await Promise.all([
        sajuAPI.calculate(inputData),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      if (response.success) {
        dispatch({ type: "SET_RESULT_DATA", payload: response.data });
        return { success: true, data: response.data };
      }
      throw new Error(response.message || "사주 계산에 실패했습니다");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "사주 계산에 실패했습니다";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  return (
    <SajuContext.Provider value={{ ...state, calculateSaju, setLoading }}>
      {children}
    </SajuContext.Provider>
  );
};

export const useSaju = () => {
  const context = useContext(SajuContext);
  if (!context)
    throw new Error("useSaju는 SajuProvider 내에서 사용되어야 합니다");
  return context;
};

export default SajuContext;
