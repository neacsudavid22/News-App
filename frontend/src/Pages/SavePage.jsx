import { useState, useEffect, useContext } from "react";
import Container from 'react-bootstrap/Container';
import "./HomePage.css";
import { getSavedArticles } from "../Services/articleService";
import MainNavbar from "../Components/MainNavbar";
import Stack from "react-bootstrap/esm/Stack";
import SecondaryArticleCard from "../Components/SecondaryArticleCard";
import { AuthContext } from "../Components/AuthProvider";
import useElementInView from "../hooks/useElementInView";
import { Col, Row } from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";

const SavePage = () => {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(0);
  const [targetRef, isInView] = useElementInView({ threshold: 0.5 });
  const { IS_SM } = useWindowSize();

  useEffect(() => {
    if (isInView && articles.length >= 20) {
      setPage(prev => prev + 1);
    }
  }, [isInView, articles]);

  useEffect(() => {
    const handleArticles = async () => {
      if (!user) {
        return;
      }
  
      try {
        const savedArticles = await getSavedArticles(page);
        if(savedArticles)
          setArticles(prev => page === 0 ? savedArticles : [...prev, ...savedArticles]);
  
      } catch (err) {
        console.error("Error during getting saved articles:", err);
      }
    };
      
    handleArticles();
  }, [user, page]);


  return (
    <Stack direction="vertical" className="w-100 bg-light">
      
      <div className="fixed-top">
        <MainNavbar />
      </div>
      <h1 className="fixed-top d-flex justify-content-center z-1 p-4 bg-secondary-subtle shadow"
          style={{top: "3.6rem"}}>Saved Articles</h1>
      <div style={{height: IS_SM ? "10rem" : "11rem"}}></div>

      <Container fluid className="h-100"> 
        {articles && articles.map((a) =>  
          (<Row key={a._id.toString()} className="mb-3 justify-content-center">
            <Col xs={12} sm={12} md={10} lg={5} xl={5}>
              <SecondaryArticleCard article={a}/>
            </Col>
          </Row>)
        )}
        
        {articles && articles.length >= 20 && <div ref={targetRef}></div>}
      </Container>

    </Stack>
  );
}

export default SavePage;
