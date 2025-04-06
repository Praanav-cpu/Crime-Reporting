export const BarChart = ({ data, index, categories, colors, valueFormatter, showLegend, showYAxis, showXAxis }) => {
    // Basic implementation - replace with actual charting library integration
    return (
      <div>
        <h3>Bar Chart</h3>
        <p>Data: {JSON.stringify(data)}</p>
      </div>
    )
  }
  
  export const LineChart = ({
    data,
    index,
    categories,
    colors,
    valueFormatter,
    showLegend,
    showYAxis,
    showXAxis,
    showGridLines,
  }) => {
    // Basic implementation - replace with actual charting library integration
    return (
      <div>
        <h3>Line Chart</h3>
        <p>Data: {JSON.stringify(data)}</p>
      </div>
    )
  }
  
  export const PieChart = ({ data, index, categories, colors, valueFormatter }) => {
    // Basic implementation - replace with actual charting library integration
    return (
      <div>
        <h3>Pie Chart</h3>
        <p>Data: {JSON.stringify(data)}</p>
      </div>
    )
  }
  
  