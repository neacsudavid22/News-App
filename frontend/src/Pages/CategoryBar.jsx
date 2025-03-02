import { useState, useContext } from "react";
import { AuthContext } from "../Components/AuthProvider";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import "./CategoryBar.css"

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
    console.log("Category changed to:", CATEGORIES[category]?.[0]);
  }

  const handleTitle = (title) => {
    return <span style={{color: title === category ? "black": "whitesmoke"}}>
      {title.toString().charAt(0).toUpperCase() + (title.toString().slice(1))}</span>
  }

  const handleLogout = () => {
    removeToken(); 
    setUser(null); 
  }

  return (
    <Container fluid className="vh-100 bg-light p-0">
     <Navbar bg="dark" variant="dark" expand="lg" className="w-100 p-2">
      <Container fluid className="d-flex justify-content-between ">
  
          <Navbar.Brand as={Link} to="/" >NewsApp</Navbar.Brand>
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

        <Tabs
          defaultActiveKey="allNews"
          id="category-tabs"
          className="custom-tabs mb-3"
          style={{background: CATEGORIES[category]?.[0] || "gray"}}
          fill
          transition
          variant="tabs"
          onSelect={(selectedKey) => handleCategoryChange(selectedKey)} 
        > 
          {Object.keys(CATEGORIES).map((key) => (
            <Tab key={key} eventKey={key} title={handleTitle(key)} tabClassName="tab-custom" />
        ))}
        </Tabs> 
      </Container>
  );
}

export default CategoryBar;
