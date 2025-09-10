import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SajuProvider } from './context/SajuContext.jsx'
import Starting from './Starting.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import SajuInput from './pages/SajuInput.jsx'
import SajuResult from './pages/SajuResult.jsx'
import SavedSaju from './pages/SavedSaju.jsx'


const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: "Pretendard";
  }
`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      <SajuProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Starting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/saju-input" element={<SajuInput />} />
            <Route path="/saju-result" element={<SajuResult />} />
            <Route path="/saved-saju" element={<SavedSaju />} />
          </Routes>
        </BrowserRouter>
      </SajuProvider>
    </AuthProvider>
  </StrictMode>,
)
