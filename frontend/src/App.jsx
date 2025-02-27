import { BrowserRouter, Routes, Route } from "react-router-dom" 
import LoginPage from "./Pages/LoginPage"
import HomePage from "./Pages/HomePage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/home' element={<HomePage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App