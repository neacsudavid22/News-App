import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Components/AuthProvider";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import "./HomePage.css";
import Button from "react-bootstrap/Button"
import ArticleViewCard from "../Components/ArticleViewCard";
import { getArticles } from "../Services/articleService";

const CategoryBar = () => {
  const { user, setUser, removeToken } = useContext(AuthContext); // Access context
  const [category, setCategory] = useState('allNews');  
  
  const CATEGORIES = {
    allNews: ["gray"] ,
    politics: ["red"],
    extern: ["blue"] , 
    finance: ["#c9ac34"] , 
    sports: ["green"] ,
    tech: ["orange"] , 
    lifestyle: ["purple"] 
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  }

  const handleTitle = (title) => {
    return <span style={{color: title === category ? "black": "whitesmoke"}}>
      {title.toString().charAt(0).toUpperCase() + (title.toString().slice(1))}</span>
  }

  const handleLogout = () => {
    removeToken(); 
    setUser(null); 
  }

  const [articles, setArticles] = useState([])

  useEffect( () => {
    const handleArticles = async () => { 
      try {
          const data = await getArticles(category);

          if (data) {
              setArticles(data)
          }
      } catch (err) {
          console.error("Error during getting articles:", err);
      }
    }
    handleArticles()
  }, [category])   


  return (
    <Container fluid className="p-0">
      {/* First Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="w-100 p-2">
        <Container fluid className="d-flex justify-content-between">
          <Badge bg="secondary" as={Button}>
            NewsWebApp
          </Badge>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Navbar.Text className="text-light px-3">@{user?.username}</Navbar.Text>
                <Nav.Link className="text-light pr-2" as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link className="text-light pr-2" as={NavLink} to="/login">Login</Nav.Link>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Second Navbar (Tabs) */}
      <Navbar style={{ background: CATEGORIES[category]?.[0] || "gray", marginBottom: "2rem" }} expand="lg" 
              className="w-100 px-3 py-2 p-lg-0"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="py-1 p-lg-0">
          <Nav 
            variant="tabs" 
            activeKey={category} 
            className="custom-tabs py-1 py-lg-0 w-100 d-flex  justify-content-around"
            onSelect={(selectedKey) => handleCategoryChange(selectedKey)}
            style={{ background: CATEGORIES[category]?.[0] || "gray" }} 
          >
            {Object.keys(CATEGORIES).map((key) => (
              <Nav.Item key={key}>
                <Nav.Link 
                  eventKey={key} 
                  className="tab-custom"
                  style={{ color: key === category ? "black" : "whitesmoke" }} 
                >
                  {handleTitle(key)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/*from here*/}
      <Stack gap={4} className="w-100 d-flex justify-content-center align-items-center"> 
        {
          articles.map( (a) => <ArticleViewCard key={a.id} article={a} /> )
        }
      </Stack>

    </Container>
  );
}

export default CategoryBar;
