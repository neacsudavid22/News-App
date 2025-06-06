import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useEffect, useState } from 'react'

const ScatterPlot = ({ rawData = [], interaction = "" }) => {
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

    if (!data.length) return <div>Loading...</div>;

    return (
        <ResponsiveScatterPlot
            data={data}
            margin={{ top: 20, right: 80, bottom: 70, left: 70 }}
            axisBottom={{
                legend: 'Number of friends',
                legendOffset: 46,
                legendPosition: 'middle'
            }}
            axisLeft={{
                legend: interaction + ' (each dot = 1 interaction)',
                legendOffset: -60,
                legendPosition: 'middle'
            }}
            yScale={{ type: 'linear', min: 0 }} // y is always 1, so max 2 for visibility
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
        />
    );
};

export default ScatterPlot;
