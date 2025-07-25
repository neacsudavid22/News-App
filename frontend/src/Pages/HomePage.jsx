import { useState, useEffect, useContext, useRef } from "react";
import Container from 'react-bootstrap/Container';
import "./HomePage.css";
import { getArticles } from "../Services/articleService";
import MainNavbar from "../Components/MainNavbar";
import MainArticleCard from "../Components/MainArticleCard";
import Stack from "react-bootstrap/esm/Stack";
import SecondaryArticleCard from "../Components/SecondaryArticleCard";
import CategoryBar from "../Components/CategoryBar";
import CurrencyConverter from "../Components/CurrencyConverter";
import useWindowSize from "../hooks/useWindowSize";
import LocationAndWeather from "../Components/LocationAndWeather";
import { AuthContext } from "../Components/AuthProvider";
import useElementInView from "../hooks/useElementInView";
import { useSearchParams } from "react-router-dom";
import { Col, Placeholder, Row } from "react-bootstrap";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const toModify = searchParams.get("toModify") === "true";
  const [category, setCategory] = useState('allNews');  
  const [articles, setArticles] = useState([])
  const {user} = useContext(AuthContext);
  const [tag, setTag] = useState(searchParams.get("tag") || "");
  const [page, setPage] = useState(0);
  const [targetRef, isInView] = useElementInView({ threshold: 0.5 });
  const { IS_MD } = useWindowSize();
  const TRY_TO_GET = useRef(true);

  useEffect(() => {
    if (isInView && articles.length >= 20 && TRY_TO_GET.current) {
      setPage(prev => prev + 1);
      TRY_TO_GET.current = false
    }
  }, [isInView, articles]);

  useEffect(() => {
    const handleArticles = async () => {
      if (toModify && !user) {
        return;
      }
  
      try {
        const data = await getArticles(category, tag, page, toModify ? user?._id : '');
        if(data !== null){ setTimeout(()=>TRY_TO_GET.current = true, 5000) }
        setArticles(prev => page === 0 ? data : [...prev, ...data]);
  
      } catch (err) {
        console.error("Error during getting articles:", err);
      }
    };
      
    handleArticles();
  }, [category, user, tag, page, toModify]);


  return (
    <Stack direction="vertical" className="w-100 bg-light">
      
      <div className="fixed-top">
        <MainNavbar toModify={toModify} />
        <CategoryBar category={category} setCategory={setCategory} setTag={setTag}></CategoryBar>
      </div>
      <div style={{height:"7.5rem"}}></div>

      { !IS_MD && <CurrencyConverter/>}
      { !IS_MD && <LocationAndWeather/>}


      <Container fluid className="h-100"> 
        {articles.map((a, index) => a.main ? 
          (<Row className="mb-3 justify-content-center">
            <Col xs={12} sm={12} md={10} lg={5} xl={5}>
              <MainArticleCard key={a._id + index } 
                article={a} toModify={toModify} /> 
            </Col>
          </Row>) : 
          (<Row className="mb-3 justify-content-center">
            <Col xs={12} sm={12} md={10} lg={5} xl={5}>
              <SecondaryArticleCard key={a._id + index} 
                article={a} toModify={toModify} />
            </Col>
          </Row>) 
        )}
        {
          (articles.length >= 20) && 
          <Placeholder ref={targetRef} as="div" animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
        }
      </Container>

    </Stack>
  );
}

export default HomePage;
