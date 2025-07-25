import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { AuthContext, AuthProvider } from "./Components/AuthProvider"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ArticleEditorPage from "./Pages/ArticleEditorPage";
import ArticleUploadPage from "./Pages/ArticleUploadPage";
import ArticlePage from "./Pages/ArticlePage";
import { useContext } from "react";
import ProfilePage from "./Pages/ProfilePage";
import DashboardPage from "./Pages/DashboardPage";
import SavePage from "./Pages/SavePage";
import ChartsPage from "./Pages/ChartsPage";

function App() {

  function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    return (user?.account === "author" || user?.account === "admin") ? children : <LoginPage />;
  }

  function ProtectedRouteAdmin({ children }) {
    const { user } = useContext(AuthContext);
    return user?.account === "admin" ? children : <LoginPage />;
  }

  function ProtectedRouteLoggedIn({ children }) {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    return user?._id === id ? children : <HomePage />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/author" element={<ProtectedRoute> <ArticleEditorPage /> </ProtectedRoute>} />
          <Route path="/author/upload" element={<ProtectedRoute> <ArticleUploadPage /> </ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRouteLoggedIn> <ProfilePage /> </ProtectedRouteLoggedIn>} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/saved/:id" element={<ProtectedRouteLoggedIn> <SavePage /> </ProtectedRouteLoggedIn>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRouteAdmin><ChartsPage/></ProtectedRouteAdmin>}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
