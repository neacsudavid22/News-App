import { useState, useEffect, useContext } from "react";
import Container from 'react-bootstrap/Container';
import "./HomePage.css";
import { getArticles, getAuthorsArticles } from "../Services/articleService";
import MainNavbar from "../Components/MainNavbar";
import MainArticleCard from "../Components/MainArticleCard";
import Stack from "react-bootstrap/esm/Stack";
import SecondaryArticleCard from "../Components/SecondaryArticleCard";
import CategoryBar from "../Components/CategoryBar";
import CurrencyConverter from "../Components/CurrencyConverter";
import useWindowSize from "../hooks/useWindowSize";
import LocationAndWeather from "../Components/LocationAndWeather";
import { useLocation } from "react-router";
import { AuthContext } from "../Components/AuthProvider";
import SearchBar from "../Components/SearchBar";

const HomePage = () => {
  const [category, setCategory] = useState('allNews');  
  const [articles, setArticles] = useState([])
  const location = useLocation();
  const toModify = location.state?.toModify || false;
  const {user} = useContext(AuthContext);
  const [tag, setTag] = useState("");

  useEffect( () => {
    const handleArticles = async () => { 
      try {
          const data = (toModify === true && user !== null) ? await getAuthorsArticles(user._id) 
          : await getArticles(category, tag);

          if (data) {
              setArticles(data)
          }
      } catch (err) {
          console.error("Error during getting articles:", err);
      }
    }
    handleArticles()
  }, [category, toModify, user, tag])   

  const {width} = useWindowSize();

  return (
    <Stack direction="vertical" className="w-100 bg-light">
      
      <div className="fixed-top">
        <MainNavbar />
        {!toModify && <CategoryBar category={category} setCategory={setCategory} setTag={setTag}></CategoryBar>}
      </div>
      <div style={{height:"7.5rem"}}></div>

      { width>991 && <CurrencyConverter/>}
      { width>991 && <LocationAndWeather/>}


      <Container fluid className="vh-100"> 
        {articles.map((a) => a.main ? <MainArticleCard key={a._id.toString()} article={a} toModify={toModify}/> 
                                    : <SecondaryArticleCard key={a._id.toString()} article={a} toModify={toModify}/>)}
      </Container>

    </Stack>
  );
}

export default HomePage;
