import { ResponsiveRadar } from '@nivo/radar'
import { useEffect, useState } from 'react';
import { Button, Col, Stack, Form } from 'react-bootstrap';
import useWindowSize from '../../hooks/useWindowSize';
import { getAnalysisForChart } from '../../Services/articleService';
import { Gemini } from '@lobehub/icons';

const Radar = ({ rawDataLikes, rawDataSaves, rawDataShares, rawDataComments }) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        const categorySet = new Set(['politics', 'extern', 'finance', 'sports', 'tech', 'lifestyle']);

        const dataTemp = Array.from(categorySet).map(category => ({
            category,
            likes: rawDataLikes.filter(d => d.article_category === category).length || 0,
            saves: rawDataSaves.filter(d => d.article_category === category).length || 0,
            shares: rawDataShares.filter(d => d.article_category === category).length || 0,
            comments: rawDataComments.filter(d => d.article_category === category).length || 0
        }));

        setData(dataTemp);
        
    }, [rawDataLikes, rawDataSaves, rawDataShares, rawDataComments]);

    const { IS_SM } = useWindowSize();

    const [analysisText, setAnalysisText] = useState("");
    const analyzeData = async () => {
        const analysis = await getAnalysisForChart("radar", data, 'all');
        setAnalysisText(analysis);
    }

    if(!(data.length > 0)) return <p>Loading...</p>

    return (
        <Col md={10} className="d-flex flex-column justify-content-center align-items-center mb-4" style={{ minHeight: IS_SM ? "50vh" : "100vh" }}>
            <h2 className="text-center mb-4">Radar Chart</h2>
            <div className={`${IS_SM ? "w-100" : "w-75"} h-100 border-bottom`}>    
            <ResponsiveRadar 
                data={data}
                keys={['likes', 'saves', 'shares', 'comments']}
                indexBy="category"
                margin={{ top: 40, bottom: 60, right: 80, left: 80 }}
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                blendMode="multiply"
                colors={{ scheme: 'category10' }}
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        translateY: -20,
                        translateX: -50,
                        itemWidth: 80,
                        itemHeight: 20,
                        symbolShape: 'circle',
                    }
                ]}
            />
            </div>
            <Stack direction='horizontal' gap={2} className='w-75 m-auto mt-3'>
                <Form className="flex-grow-1">
                    <Form.Group className="mb-3" controlId={`radar`}>
                        <Form.Control as="textarea" rows={4} value={analysisText} disabled />
                    </Form.Group>
                </Form>
                <Button variant="outline-info" onClick={analyzeData}
                >Get Analysis <Gemini size={20} /></Button>
            </Stack>
        </Col>
    );
}

export default Radar;