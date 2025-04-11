import { useContext } from "react";
import { AuthContext } from "../Components/AuthProvider";

const DashboardPage = () => {

    const {user} = useContext(AuthContext);

    return(
    <>
        <h1>{user && "Welcome " + user?.name + ", you are registered as " + user?.account} + "!"</h1>
    </>
    );
}

export default DashboardPage;