import React from 'react';
import CategoryBar from '../Components/CategoryBar'
import Container from 'react-bootstrap/Container';
import ArticleViewCard from '../Components/ArticleViewCard';

const HomePage = () => {
    return (
        <>
            <CategoryBar/>
            <Container className="d-flex justify-content-center"> 
                <ArticleViewCard/>
            </Container>
        </> 
    );
}
export default HomePage 