import { ResponsiveHeatMap } from '@nivo/heatmap'

const HeatMap = ({ data }) => {
    return (
        <ResponsiveHeatMap 
            data={data}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            valueFormat=">-.2s"
            axisTop={{ tickRotation: -90 }}
            axisRight={{ legend: 'country', legendOffset: 70 }}
            axisLeft={{ legend: 'country', legendOffset: -72 }}
            colors={{
                type: 'diverging',
                scheme: 'red_yellow_blue',
                divergeAt: 0.5,
                minValue: -100000,
                maxValue: 100000
            }}
            emptyColor="#555555"
            legends={[
                {
                    anchor: 'bottom',
                    translateX: 0,
                    translateY: 30,
                    length: 400,
                    thickness: 8,
                    direction: 'row',
                    tickPosition: 'after',
                    tickSize: 3,
                    tickSpacing: 4,
                    tickOverlap: false,
                    tickFormat: '>-.2s',
                    title: 'Value →',
                    titleAlign: 'start',
                    titleOffset: 4
                }
            ]}
        />
    );
}

export default HeatMap;
