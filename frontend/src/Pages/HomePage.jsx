import { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import "./HomePage.css";
import ArticleViewCard from "../Components/ArticleViewCard";
import { getArticles } from "../Services/articleService";
import MainNavbar from "../Components/MainNavBar";

const CategoryBar = () => {
  const [category, setCategory] = useState('allNews');  
  const [page, setPage] = useState(1);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setInnerWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  
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
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    setPage(1)
  }

  const handleTitle = (title) => {
    return <span style={{color: title === category ? "black": "whitesmoke"}}>
      {title.toString().charAt(0).toUpperCase() + (title.toString().slice(1))}</span>
  }

  const [articles, setArticles] = useState([])

  useEffect( () => {
    const handleArticles = async () => { 
      try {
          const data = await getArticles(category, page);

          if (data) {
              setArticles(data)
          }
      } catch (err) {
          console.error("Error during getting articles:", err);
      }
    }
    handleArticles()
  }, [category, page])   

  const articleGridAuto = () => {
    const articleGrid = [];
    let articleRow = []; 

    articles.forEach((articleItem, index) => {
        articleRow.push(articleItem);

        if (articleRow.length === 3 || index === articles.length - 1) {
            articleGrid.push(
              <>
              <Row>
                  <Col className="mb-3 mt-2" xs={12} sm={10} md={8} lg={12} xl={12}>
                      <ArticleViewCard key={articleRow[0].id} article={articleRow[0]} isBig={true} />
                  </Col>
              </Row>

              <Row>
                  {articleRow[1] && (
                      <Col className="mb-3 mt-2" xs={12} sm={10} md={8} lg={6} xl={6}>
                          <ArticleViewCard key={articleRow[1].id} article={articleRow[1]} 
                          isBig={innerWidth < 768 } />
                      </Col>
                  )}
                  {articleRow[2] && (
                      <Col className="mb-3 mt-2" xs={12} sm={10} md={8} lg={6} xl={6}>
                          <ArticleViewCard key={articleRow[2].id} article={articleRow[2]} isBig={innerWidth < 768} />
                      </Col>
                  )}
              </Row>
              </>
            );
            articleRow = []; // Reset for the next row
        }
    });

    return articleGrid;
};


  return (
    <Container fluid className="p-0">
      <MainNavbar/>

      {/* Second Navbar (Tabs) */}
      <Navbar sticky="top" style={{ background: CATEGORIES[category]?.[0] || "gray", marginBottom: "2rem" }} expand="lg" 
              className="w-100 p-2 p-lg-0 sticky-offset"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="py-1 p-lg-0">
          <Nav 
            variant="tabs" 
            activeKey={category} 
            className="custom-tabs py-1 py-lg-0 w-100 d-flex justify-content-around"
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
      <div className="d-flex justify-content-center">
      <Container fluid className={ innerWidth < 768 ? "w-75" : "w-50"}> 
        {articleGridAuto()}
      </Container>

      </div>

    </Container>
  );
}

export default CategoryBar;
