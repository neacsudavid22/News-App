import { ResponsivePie } from '@nivo/pie'
import { useEffect, useState } from 'react'

const Pie = ({ rawData = [], filterBy = "age" }) => {
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

    if (!data.length) return <div>Loading...</div>;

    return (
        <ResponsivePie
            margin={{ top: 40,  bottom: 80 }}
            data={data}
            innerRadius={0.5}
            padAngle={0.6}
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
    );
};

export default Pie;