import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import styled, { createGlobalStyle } from 'styled-components'
import Starting from './Starting.jsx'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    background-color: black;
    font-family: "Pretendard";
  }
`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
      <Starting />
  </StrictMode>,
)
