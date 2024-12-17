import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter ,Route, Routes, useLocation } from 'react-router-dom'
import MyRoutes from './Routes/Route'

function App() {
  
  return (
    <>
    <BrowserRouter>
      <MyRoutes/>
    </BrowserRouter>
    </>
  )
}

export default App
