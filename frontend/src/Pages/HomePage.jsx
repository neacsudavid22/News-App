import { useState, useEffect, useContext } from "react";
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

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const toModify = searchParams.get("toModify") === "true";
  const [category, setCategory] = useState('allNews');  
  const [articles, setArticles] = useState([])
  const {user} = useContext(AuthContext);
  const [tag, setTag] = useState(location.state?.tag || "");
  const [page, setPage] = useState(0);
  const [targetRef, isInView] = useElementInView({ threshold: 0.5 });
  const {width} = useWindowSize();


  useEffect(() => {
    if (isInView && articles.length >= 20) {
      setPage(prev => prev + 1);
    }
  }, [isInView, articles]);

  useEffect(() => {
    const handleArticles = async () => {
      if (toModify && !user) {
        return;
      }
  
      try {
        const data = await getArticles(category, tag, page, toModify ? user?._id : '');
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

      { width>991 && <CurrencyConverter/>}
      { width>991 && <LocationAndWeather/>}


      <Container fluid className="h-100"> 
        {articles.map((a) => a.main ? <MainArticleCard key={a._id.toString() } article={a} toModify={toModify}/> 
                                    : <SecondaryArticleCard key={a._id.toString()} article={a} toModify={toModify}/>)}
        
        {articles.length >= 20 && <div ref={targetRef}></div>}
      </Container>

    </Stack>
  );
}

export default HomePage;
