import { ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'

const Bar = ({ rawData = [], filterBy = "age", interaction = "" }) => {
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
        }
    }, [rawData, filterBy]);

    if (!data.length) return <div>Loading...</div>;

    return(
        <ResponsiveBar 
        groupMode='grouped'
            margin={{ top: 20, right: 130, bottom: 50, left: 80 }}
            data={data}
            keys={keys}
            indexBy="group"
            colors={{ scheme: 'tableau10' }}
            axisBottom={{ 
                legend: filterBy === "age" ? 'Age group' : 'Gender',
                legendOffset: 32 
            }}
            axisLeft={{ 
                legend: 'Interaction count - ' + interaction, 
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
    );
}

export default Bar;