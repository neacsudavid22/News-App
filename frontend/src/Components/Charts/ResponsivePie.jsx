import { ResponsivePie } from '@nivo/pie'
import { useEffect, useState } from 'react'
import useWindowSize from '../../hooks/useWindowSize';
import { Button, Col, Form, Stack } from 'react-bootstrap';
import { getAnalysisForChart } from '../../Services/articleService';
import { Gemini } from '@lobehub/icons';

const Pie = ({ interactionType, rawData = [], filterBy = "age" }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const ageGroupsLabels = [
            'sub 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
        ];

        const getAgeGroupIndex = (age) => {
            if (age < 18) return 0;
            if (age < 25) return 1;
            if (age < 35) return 2;
            if (age < 45) return 3;
            if (age < 55) return 4;
            if (age < 65) return 5;
            return 6;
        };

        const formatByAge = (dataArray) => {
            const grouped = {};
            for (const item of dataArray) {
                const ageGroup = ageGroupsLabels[getAgeGroupIndex(item.user_age)];
                grouped[ageGroup] = (grouped[ageGroup] || 0) + 1;
            }
            return Object.entries(grouped).map(([id, value]) => ({ id, value }));
        };

        const formatByGender = (dataArray) => {
            const grouped = { male: 0, female: 0, other: 0 };
            for (const item of dataArray) {
                if (item.user_gender === "male") grouped.male += 1;
                else if (item.user_gender === "female") grouped.female += 1;
                else grouped.other += 1;
            }
            return Object.entries(grouped).map(([id, value]) => ({ id, value }));
        };

        let formatted = [];
        switch (filterBy) {
            case "gender":
                formatted = formatByGender(rawData);
                break;
            case "age":
            default:
                formatted = formatByAge(rawData);
                break;
        }
        setData(formatted);
    }, [rawData, filterBy]);

    const { IS_SM } = useWindowSize();

    const [analysisText, setAnalysisText] = useState("");
    const analyzeData = async () => {
        const analysis = await getAnalysisForChart("pie", data, interactionType);
        setAnalysisText(analysis);
    }

    if (!data.length) return <div>Loading...</div>;

    return (
        <>
        <Col md={10} className="d-flex flex-column justify-content-center align-items-center mb-4" style={{ minHeight: IS_SM ? "50vh" : "80h" }}>
            <h2 className="text-center mb-4">{`Pie Chart - Gender distribution on ${interactionType}`}</h2>
            <div className="w-75 h-100 border-bottom">
            <ResponsivePie
                margin={{ top: 40,  bottom: 100 }}
                data={data}
                innerRadius={0.5}
                padAngle={0.6}
                colors={{ scheme: 'tableau10' }}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        symbolShape: 'circle'
                    }
                ]}
            />
            </div>
        </Col>
        <Stack direction='horizontal' gap={2} className='w-75 m-auto mt-3'>
            <Form className="flex-grow-1">
                <Form.Group className="mb-3" controlId={`pie-analysis-${filterBy}-${interactionType}`}>
                    <Form.Control as="textarea" rows={4} value={analysisText} disabled />
                </Form.Group>
            </Form>
            <Button variant="outline-info" onClick={analyzeData}
            >Get Analysis <Gemini size={20} /></Button>
        </Stack>
        </>
    );
};

export default Pie;