import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { AuthProvider } from "./Components/AuthProvider"; 
import "bootstrap/dist/css/bootstrap.min.css";
import ArticleUploaderPage from "./Pages/ArticleUploaderPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/author" element={<ArticleUploaderPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
