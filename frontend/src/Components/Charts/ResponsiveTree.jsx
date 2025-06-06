import { ResponsiveTree } from '@nivo/tree'
import { useEffect, useState } from 'react';

const Tree = ({ rawData = [], interaction = "" }) => {
    const [data, setData] = useState(null);
    
    useEffect(()=>{
        const getAgeGroup = (age) => {
            if (age < 18) return 'sub 18';
            if (age < 25) return '18-24';
            if (age < 35) return '25-34';
            if (age < 45) return '35-44';
            if (age < 55) return '45-54';
            if (age < 65) return '55-64';
            return '65+';
        };

        const root = { name: interaction, children: [] };
        const ageMap = {};

        for (const item of rawData) {
            const ageGroup = getAgeGroup(item.user_age);
            const gender = item.user_gender;
            const category = item.article_category;

            if (!ageMap[ageGroup]) ageMap[ageGroup] = {};
            if (!ageMap[ageGroup][gender]) ageMap[ageGroup][gender] = {};
            if (!ageMap[ageGroup][gender][category]) ageMap[ageGroup][gender][category] = 0;
            ageMap[ageGroup][gender][category]++;
        }

        for (const ageGroup of Object.keys(ageMap)) {
            const ageNode = { name: ageGroup, children: [] };
            for (const gender of Object.keys(ageMap[ageGroup])) {
                const genderNode = { name: gender, children: [] };
                for (const category of Object.keys(ageMap[ageGroup][gender])) {
                    genderNode.children.push({
                        name: ageMap[ageGroup][gender][category] + " - " + category,
                        value: ageMap[ageGroup][gender][category]
                    });
                }
                ageNode.children.push(genderNode);
            }
            root.children.push(ageNode);
        }

        setData(root);
    }, [rawData, interaction]);

    
    if (!data) return <div>Loading...</div>;

    return (
        <ResponsiveTree
            margin={{ top: 50,  bottom: 90 }}
            data={data}
            identity="name"
            value="value"
            label={ node => node.data.name }
            activeNodeSize={24}
            inactiveNodeSize={12}
            nodeColor={{ scheme: 'tableau10' }}
            fixNodeColorAtDepth={1}
            linkThickness={2}
            activeLinkThickness={8}
            inactiveLinkThickness={2}
            linkColor={{ from: 'target.color', modifiers: [['opacity', 0.4]] }}
            meshDetectionRadius={80}
        />
    );
}

export default Tree;
