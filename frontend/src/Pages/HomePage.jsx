import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import "./HomePage.css";
import { getArticles } from "../Services/articleService";
import MainNavbar from "../Components/MainNavbar";
import MainArticleCard from "../Components/MainArticleCard";
import Stack from "react-bootstrap/esm/Stack";
import SecondaryArticleCard from "../Components/SecondaryArticleCard";
import CategoryBar from "./CategoryBar";

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

  return (
    <Stack direction="vertical" className="w-100 bg-light">
      <MainNavbar />

      <CategoryBar category={category} setCategory={setCategory}></CategoryBar>

      <Container fluid> 
        {articles.map((a) => a.main ? <MainArticleCard key={a._id} article={a}/> 
                                    : <SecondaryArticleCard key={a._id} article={a}/>)}
      </Container>

    </Stack>
  );
}

export default HomePage;
