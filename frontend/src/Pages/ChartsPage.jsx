import { useEffect, useState } from "react";
import Pie from "../Components/Charts/ResponsivePie";
import Bar from "../Components/Charts/ResponsiveBar";
import ScatterPlot from "../Components/Charts/ResponsiveScatterPlot";
import Radar from "../Components/Charts/ResponsiveRadar";
import { getInteractionData } from "../Services/articleService";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainNavbar from '../Components/MainNavbar';
import useWindowSize from "../hooks/useWindowSize";

const ChartsPage = () => {
    const [rawDataLikes, setRawDataLikes] = useState([]);
    const [rawDataComments, setRawDataComments] = useState([]);
    const [rawDataShares, setRawDataShares] = useState([]);
    const [rawDataSaves, setRawDataSaves] = useState([]);
    const [interactionType, setInteractionType] = useState("likes");

    useEffect(() => {
        const fetchData = async () => {
            const likes = await getInteractionData("likes");
            setRawDataLikes(likes);
            const comments = await getInteractionData("comments");
            setRawDataComments(comments);
            const shares = await getInteractionData("shares");
            setRawDataShares(shares);
            const saves = await getInteractionData("saves");
            setRawDataSaves(saves);
        };
        fetchData();
    }, []);

    const getDataByInteractionType = () => {
      switch(interactionType){
        case "likes":
          return rawDataLikes;
        case "shares":
          return rawDataShares;
        case "comments":
          return rawDataComments;
        case "saves": 
          return rawDataSaves;
        default: 
          return [];
      }
    }

    const { IS_SM } = useWindowSize();

    return (
      <>
        <MainNavbar />
        <Container fluid className=" d-flex justify-content-center h-100 pt-4 mb-4">
          <Row className="w-100 justify-content-center g-4">
            <Col md={10} className="d-flex flex-column bg-white justify-content-center align-items-center mb-4">
                <Tabs
                  justify
                  style={{top: "3.6rem" }}
                  className={`${IS_SM ? "w-100" : "w-75"} z-1 m-auto fixed-top p-1 py-2 bg-white`}
                  fill
                  defaultActiveKey="likes"
                  id="uncontrolled-tab-example"
                  onSelect={(key) => setInteractionType(key)}
                >
                  <Tab eventKey="likes" title="Likes" />
                  <Tab eventKey="saves" title="Saves" />
                  <Tab eventKey="comments" title="Comments" />
                  <Tab eventKey="shares" title="Shares" />
                </Tabs>
            </Col>
            <Pie interactionType={interactionType} filterBy={"gender"} rawData={getDataByInteractionType()} />
            <Pie interactionType={interactionType} filterBy={"age"} rawData={getDataByInteractionType()} />
            <Bar filterBy="age" interactionType={interactionType} rawData={getDataByInteractionType()} />
            <Bar filterBy="gender" interactionType={interactionType} rawData={getDataByInteractionType()} />
            <Bar filterBy="age-gender" interactionType={interactionType} rawData={getDataByInteractionType()} />
            <ScatterPlot interactionType={interactionType} rawData={getDataByInteractionType()} />
            <Radar rawDataLikes={rawDataLikes} rawDataSaves={rawDataSaves} rawDataShares={rawDataShares} rawDataComments={rawDataComments}/>
          </Row>
        </Container>
      </>
    );
};

export default ChartsPage;