import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useEffect, useState } from 'react'
import { Button, Col, Form, Stack } from 'react-bootstrap';
import useWindowSize from '../../hooks/useWindowSize';
import { getAnalysisForChart } from '../../Services/articleService';
import { Gemini } from '@lobehub/icons';

const ScatterPlot = ({ interactionType, rawData = [] }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const grouped = {};
        for (const item of rawData) {
            const category = item.article_category;
            const friendCount = item.friend_count ?? 0;
            if (!grouped[category]) grouped[category] = {};
            if (!grouped[category][friendCount]) grouped[category][friendCount] = 0;
            grouped[category][friendCount] += 1;
        }
        const formatted = Object.entries(grouped).map(([category, pointsObj]) => ({
            id: category,
            data: Object.entries(pointsObj).map(([friendCount, count]) => ({
                x: Number(friendCount),
                y: count
            }))
        }));
        setData(formatted);
    }, [rawData]);

    const { IS_SM } = useWindowSize();

    const [analysisText, setAnalysisText] = useState("");
    const analyzeData = async () => {
        const analysis = await getAnalysisForChart("scatter-plot", data, interactionType);
        setAnalysisText(analysis);
    }

    if (!data.length) return <div>Loading...</div>;

    return (
        <>
        <Col md={10} className="d-flex flex-column justify-content-center align-items-center mb-4" style={{ minHeight: IS_SM? "50vh" : "80vh" }}>
            <h3 className="text-center text-wrap w-75 mb-4">{`Scatter Plot - Corellation between Number of friends and Number of Interactions - ${interactionType}`}</h3>
            <div className={`${IS_SM ? "w-100" : "w-75"} h-100 border-bottom`}>   
            <ResponsiveScatterPlot
                data={data}
                margin={{ top: 20, right: 80, bottom: 70, left: 70 }}
                blendMode='multiply'
                colors={{ scheme: 'spectral' }}
                axisBottom={{
                    legend: 'Number of friends',
                    legendOffset: 46,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    legend: interactionType + ' (each dot = 1 interaction)',
                    legendOffset: -60,
                    legendPosition: 'middle'
                }}
                yScale={{ type: 'linear', min: 0 }} 
                xScale={{ type: 'linear', min: 0 }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        translateX: 120,
                        itemWidth: 100,
                        itemHeight: 16,
                        itemsSpacing: 3,
                        symbolShape: 'circle'
                    }
                ]}
                tooltip={({ node }) => (
                    <div style={{ background: 'white', padding: 8, border: '1px solid #ccc', width: "130px" }}>
                        <strong>{node.serieId}</strong><br />
                        friends: {node.formattedX}<br />
                        {interactionType}: {node.formattedY}
                    </div>
                )}
            />
            </div>
        </Col>
         <Stack direction='vertical' gap={2} className='w-50 mt-3'>
            <Form className='w-75 mx-auto'>
                <Form.Group className="mb-3" controlId={`scatter-plot-${interactionType}`}>
                    <Form.Control as="textarea" rows={4} value={analysisText} disabled />
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-info" onClick={analyzeData}>
                        Get Analysis <Gemini size={20} />
                    </Button>
                </div>
            </Form>
        </Stack>
        </>
    );
};

export default ScatterPlot;
