import { ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { Button, Col, Stack, Form } from 'react-bootstrap';
import useWindowSize from '../../hooks/useWindowSize';
import { getAnalysisForChart } from '../../Services/articleService';
import { Gemini } from '@lobehub/icons';

const Bar = ({ interactionType, rawData = [], filterBy = "age" }) => {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        let grouped = {};
        let allCategories = new Set();
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

        if (filterBy === "age") {
            for (const item of rawData) {
                const group = ageGroupsLabels[getAgeGroupIndex(item.user_age)];
                const category = item.article_category;
                if (!grouped[group]) grouped[group] = { group };
                grouped[group][category] = (grouped[group][category] || 0) + 1;
                allCategories.add(category);
            }
            setData(Object.values(grouped));
            setKeys(Array.from(allCategories));
        } else if (filterBy === "gender") {
            for (const item of rawData) {
                const group = item.user_gender;
                const category = item.article_category;
                if (!grouped[group]) grouped[group] = { group };
                grouped[group][category] = (grouped[group][category] || 0) + 1;
                allCategories.add(category);
            }
            setData(Object.values(grouped));
            setKeys(Array.from(allCategories));
        } else if (filterBy === "age-gender") {
            for (const item of rawData) {
                const ageGroup = ageGroupsLabels[getAgeGroupIndex(item.user_age)];
                const gender = item.user_gender;
                const group = `${ageGroup} - ${gender}`;
                const category = item.article_category;
                if (!grouped[group]) grouped[group] = { group, ageGroup, gender };
                grouped[group][category] = (grouped[group][category] || 0) + 1;
                allCategories.add(category);
            }
            const genderOrder = { male: 0, female: 1, other: 2 }; 
            const sorted = Object.values(grouped).sort((a, b) => {
                const ageA = ageGroupsLabels.indexOf(a.ageGroup);
                const ageB = ageGroupsLabels.indexOf(b.ageGroup);
                if (ageA !== ageB) return ageA - ageB;
                return (genderOrder[a.gender] ?? 99) - (genderOrder[b.gender] ?? 99);
            });
            setData(sorted);
            setKeys(Array.from(allCategories));
        }
    }, [rawData, filterBy]);

    const { IS_SM } = useWindowSize();
    
    const [analysisText, setAnalysisText] = useState("");
    const analyzeData = async () => {
        const analysis = await getAnalysisForChart("bar", data, interactionType);
        setAnalysisText(analysis);
    }

    if (!data.length) return <div>Loading...</div>;

    const getGroupLabel = () => {
        switch(filterBy){
            case "age":
                return "Age Group"; 
            case "gender":
                return "Gender Group"; 
            case "age-gender":
                return "Age and Gender Group"; 
            default: 
                return "Unknown Group"; 
        }
    }
    
    const groupLabel = getGroupLabel();

    return(
        <>
        <Col md={10} className="d-flex flex-column justify-content-center align-items-center mb-4" style={{ minHeight: IS_SM? "50vh" : "80vh" }}>
            <h2 className="text-center mb-4">{`Bar Chart - ${groupLabel} distribution on ${interactionType} `}</h2>
            <div className={`${IS_SM ? "w-100" : "w-75"} h-100 border-bottom`}>
            <ResponsiveBar 
                groupMode='grouped'
                margin={{ top: 20, right: 130, bottom: 50, left: 80 }}
                data={data}
                keys={keys}
                indexBy="group"
                colors={{ scheme: 'tableau10' }}
                axisBottom={{ 
                    legend: groupLabel,
                    legendOffset: 32 
                }}
                axisLeft={{ 
                    legend: 'Interaction count - ' + interactionType, 
                    legendOffset: -60 
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        translateX: 120,
                        itemsSpacing: 3,
                        itemWidth: 100,
                        itemHeight: 16
                    }
                ]}
            />
            </div>   
        </Col>
        <Stack direction='horizontal' gap={2} className='w-75 m-auto mt-3'>
            <Form className="flex-grow-1">
                <Form.Group className="mb-3" controlId={`bar-analysis-${filterBy}-${interactionType}`}>
                    <Form.Control as="textarea" rows={4} value={analysisText} disabled />
                </Form.Group>
            </Form>
            <Button variant="outline-info" onClick={analyzeData}
            >Get Analysis <Gemini size={20} /></Button>
        </Stack>
        </>
    );
}

export default Bar;