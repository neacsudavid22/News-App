import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { AuthContext, AuthProvider } from "./Components/AuthProvider"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ArticleEditorPage from "./Pages/ArticleEditorPage";
import ArticleUploadPage from "./Pages/ArticleUploadPage";
import ArticlePage from "./Pages/ArticlePage";
import { useContext } from "react";

function App() {

  function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    return user?.account === "author" ? children : <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/author" element={<ProtectedRoute> <ArticleEditorPage /> </ProtectedRoute>} />
          <Route path="/author/upload" element={<ProtectedRoute> <ArticleUploadPage /> </ProtectedRoute>} />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
