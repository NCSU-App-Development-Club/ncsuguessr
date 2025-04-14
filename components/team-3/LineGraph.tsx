import React from 'react'
import { View } from 'react-native'
import Svg, { Line, Polyline, G, Text as SvgText } from 'react-native-svg'

interface LineGraphProps {
  data: number[]
  width: number
  height: number
  unit: string
  labels?: string[] // Optional labels for x-axis
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  width,
  height,
  unit,
  labels,
}) => {
  const padding = 40
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding

  // Filter out NaN values and ensure we have numbers
  const validData = data.map((val) => (isNaN(val) ? 0 : val))
  const maxY = Math.max(...validData, 1) // Ensure at least 1 for scale
  const minY = Math.min(...validData, 0) // Ensure at least 0 for scale

  // Handle case where all values are the same
  const scaleY = maxY === minY ? 1 : graphHeight / (maxY - minY)
  const scaleX = graphWidth / (validData.length - 1)

  const points = validData
    .map((value, index) => {
      const x = padding + index * scaleX
      const y = padding + graphHeight - (value - minY) * scaleY
      return `${x},${y}`
    })
    .join(' ')

  // Use provided labels if available; otherwise use defaults
  const xLabels =
    labels && labels.length === validData.length
      ? labels
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Calculate Y-axis values (3 points)
  const yAxisValues = [
    Math.floor(minY),
    Math.round((minY + maxY) / 2),
    Math.ceil(maxY),
  ]

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

        {/* X-axis Labels */}
        <G>
          {validData.map((_, index) => (
            <SvgText
              key={index}
              x={padding + index * scaleX}
              y={padding + graphHeight + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {xLabels[index]}
            </SvgText>
          ))}
        </G>

        {/* Y-axis Labels */}
        <G>
          {yAxisValues.map((value, index) => (
            <SvgText
              key={index}
              x={padding - 16}
              y={padding + graphHeight - (value - minY) * scaleY + 4}
              fontSize="10"
              textAnchor="end"
              fill="#000"
            >
              {Math.round(value)}
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  )
}

export default LineGraph
