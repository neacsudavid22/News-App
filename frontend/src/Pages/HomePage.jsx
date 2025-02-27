import { useLocation } from "react-router-dom";

const HomePage = () => {
    const location = useLocation();
    const user  = location.state?.user;

    return(
        <>
            <h1>{"HomePage " + user?.username}</h1>   
        </>
    );
}

export default HomePage;