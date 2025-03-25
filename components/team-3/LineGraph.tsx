import React from 'react'
import { View } from 'react-native'
import Svg, { Line, Polyline, G, Text as SvgText } from 'react-native-svg'

interface LineGraphProps {
  data: number[]
  width: number
  height: number
}

const LineGraph: React.FC<LineGraphProps> = ({ data, width, height }) => {
  const padding = 40 // Increased left padding to make space for y-axis labels
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding

  const maxY = Math.max(...data)
  const minY = Math.min(...data)

  const scaleX = graphWidth / (data.length - 1)
  const scaleY = graphHeight / (maxY - minY)

  const points = data
    .map((value, index) => {
      const x = padding + index * scaleX
      const y = padding + graphHeight - (value - minY) * scaleY
      return `${x},${y}`
    })
    .join(' ')

  // Days of the week for x-axis labels
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <View>
      <Svg width={width} height={height}>
        {/* X-axis */}
        <Line
          x1={padding}
          y1={padding + graphHeight}
          x2={padding + graphWidth}
          y2={padding + graphHeight}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Y-axis */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + graphHeight}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Graph Line */}
        <Polyline
          points={points}
          fill="none"
          stroke="#CC0000"
          strokeWidth="2"
        />

        {/* X-axis Labels (Days of the Week) */}
        <G>
          {data.map((value, index) => (
            <SvgText
              key={index}
              x={padding + index * scaleX}
              y={padding + graphHeight + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {daysOfWeek[index]}
            </SvgText>
          ))}
        </G>

        {/* Y-axis Labels (Distance in Feet) */}
        <G>
          {[minY, maxY].map((value, index) => (
            <SvgText
              key={index}
              x={padding - 16} // Adjusted x position to move labels further left
              y={padding + graphHeight - (value - minY) * scaleY + 4} // Adjusted y position for better alignment
              fontSize="10"
              textAnchor="end"
              fill="#000"
            >
              {value} ft
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  )
}

export default LineGraph
