import { ResponsiveRadar } from '@nivo/radar'
import { useEffect, useState } from 'react';

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

    if(!(data.length > 0)) return <p>Loading...</p>

    return (
        
        <ResponsiveRadar 
            data={data}
            keys={['likes', 'saves', 'shares', 'comments']}
            indexBy="category"
            margin={{ top: 80, bottom: 60, right: 80, left: 80 }}
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
                    translateY: -80,
                    translateX: -50,
                    itemWidth: 80,
                    itemHeight: 20,
                    symbolShape: 'circle',
                }
            ]}
        />
    );
}

export default Radar;