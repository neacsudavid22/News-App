import { useState, useEffect } from "react";
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

const HomePage = () => {
  const [category, setCategory] = useState('allNews');  
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

  const {width} = useWindowSize();

  return (
    <Stack direction="vertical" className="w-100 bg-light">
      
      <div className="fixed-top">
        <MainNavbar />
        <CategoryBar category={category} setCategory={setCategory}></CategoryBar>
      </div>
      <div style={{height:"7.5rem"}}></div>
      { width>991 && <CurrencyConverter/>}
      { width>991 && <LocationAndWeather/>}


      <Container fluid> 
        {articles.map((a) => a.main ? <MainArticleCard key={a._id.toString()} article={a}/> 
                                    : <SecondaryArticleCard key={a._id.toString()} article={a}/>)}
      </Container>

    </Stack>
  );
}

export default HomePage;
