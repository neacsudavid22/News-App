import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { AuthProvider } from "./Components/AuthProvider"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ArticleEditorPage from "./Pages/ArticleEditorPage";
import ArticleUploadPage from "./Pages/ArticleUploadPage";
import ArticlePage from "./Pages/ArticlePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/author" element={<ArticleEditorPage />} />
          <Route path="/upload" element={<ArticleUploadPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
