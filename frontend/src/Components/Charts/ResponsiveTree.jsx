import { ResponsiveTree } from '@nivo/tree'
import { useEffect, useState } from 'react';

const Tree = ({ rawData = [], interaction = "" }) => {
    const [data, setData] = useState(null);
    const total = rawData.length || 0;
    
    useEffect(() => {
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
        const categoryMap = {};

        for (const item of rawData) {
            const ageGroup = getAgeGroup(item.user_age);
            const gender = item.user_gender;
            const category = item.article_category;

            if (!categoryMap[category]) categoryMap[category] = {};
            if (!categoryMap[category][ageGroup]) categoryMap[category][ageGroup] = {};
            if (!categoryMap[category][ageGroup][gender]) categoryMap[category][ageGroup][gender] = 0;
            categoryMap[category][ageGroup][gender]++;
        }

        for (const category of Object.keys(categoryMap)) {
            const totalCategory = Object.values(categoryMap[category]).reduce(
                (sum, ageObj) => sum + Object.values(ageObj).reduce((s, v) => s + v, 0), 0
            );
            // Procent din radacina
            const percentCategory = ((totalCategory / total) * 100).toFixed(2);
            const categoryNode = { name: `${category} - ${percentCategory}%`, children: [], value: totalCategory };

            for (const ageGroup of Object.keys(categoryMap[category])) {
                const totalAge = Object.values(categoryMap[category][ageGroup]).reduce((s, v) => s + v, 0);

                // Procent din categoria părinte
                const percentAge = ((totalAge / totalCategory) * 100).toFixed(2);
                const ageNode = { name: `${ageGroup} - ${percentAge}%`, children: [], value: totalAge };

                for (const gender of Object.keys(categoryMap[category][ageGroup])) {
                    const count = categoryMap[category][ageGroup][gender];

                    // Procent din ageGroup părinte
                    const percentGender = ((count / totalAge) * 100).toFixed(2);
                    ageNode.children.push({
                        name: `${gender} - ${percentGender}%`,
                        value: count
                    });
                }
                categoryNode.children.push(ageNode);
            }
            root.children.push(categoryNode);
        }

        setData(root);
    }, [total, rawData, interaction]);

    
    if (!data) return <div>Loading...</div>;

    return (
        <ResponsiveTree
            margin={{ top: 40,  bottom: 50 }}
            data={data}
            identity="name"
            value="value"
            nodeColor={{ scheme: 'paired' }}
            label={node => node.data.name}
            labelsPosition="layout-opposite"
            layout='top-to-bottom'
            highlightAncestorLinks={true}
            activeNodeSize={24}
            inactiveNodeSize={12}
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
