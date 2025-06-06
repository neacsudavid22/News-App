import { ResponsiveRadar } from '@nivo/radar'
import { useEffect, useState } from 'react';

const Radar = ({ rawDataLikes, rawDataSaves, rawDataShares, rawDataComments }) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        const categorySet = new Set([
            ...rawDataLikes.map(d => d.article_category),
            ...rawDataSaves.map(d => d.article_category),
            ...rawDataShares.map(d => d.article_category),
            ...rawDataComments.map(d => d.article_category),
        ]);

        const dataTemp = Array.from(categorySet).map(category => ({
            category,
            likes: rawDataLikes.filter(d => d.article_category === category).length,
            saves: rawDataSaves.filter(d => d.article_category === category).length,
            shares: rawDataShares.filter(d => d.article_category === category).length,
            comments: rawDataComments.filter(d => d.article_category === category).length,
        }));

        setData(dataTemp);
    }, [rawDataLikes, rawDataSaves, rawDataShares, rawDataComments]);

    return (
        <ResponsiveRadar 
            data={data}
            keys={['likes', 'saves', 'shares', 'comments']}
            indexBy="category"
            margin={{ top: 45, bottom: 60, right: 80, left: 80 }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            blendMode="multiply"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    symbolShape: 'circle',
                }
            ]}
        />
    );
}

export default Radar;