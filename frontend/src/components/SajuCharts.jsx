import { PieChart, Pie, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styled from 'styled-components'

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
`

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ChartTitle = styled.h3`
  color: #150137;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`

const COLORS = {
  목: '#2ecc71',
  화: '#e74c3c',
  토: '#f39c12',
  금: '#95a5a6',
  수: '#3498db'
}

const YIN_YANG_COLORS = ['#FF6B6B', '#4ECDC4']

export function SajuCharts({ elements, yinYang, fourPillars }) {
  // 오행 데이터 준비
  const elementsData = elements ? Object.entries(elements).map(([key, value]) => ({
    name: key,
    value: value,
    fill: COLORS[key]
  })) : []
  
  // 음양 데이터 준비
  const yinYangData = yinYang ? [
    { name: '양(陽)', value: yinYang.yang || 0 },
    { name: '음(陰)', value: yinYang.yin || 0 }
  ] : []
  
  // 사주 팔자 데이터 준비
  const pillarData = fourPillars ? [
    { 
      name: '년주', 
      천간: fourPillars.year?.heaven || '', 
      지지: fourPillars.year?.earth || '',
      value: 1
    },
    { 
      name: '월주', 
      천간: fourPillars.month?.heaven || '', 
      지지: fourPillars.month?.earth || '',
      value: 1
    },
    { 
      name: '일주', 
      천간: fourPillars.day?.heaven || '', 
      지지: fourPillars.day?.earth || '',
      value: 1
    },
    { 
      name: '시주', 
      천간: fourPillars.time?.heaven || '', 
      지지: fourPillars.time?.earth || '',
      value: 1
    }
  ] : []
  
  // 오행 균형 레이더 차트 데이터
  const maxElement = elements ? Math.max(...Object.values(elements)) : 0
  const radarData = elements ? Object.entries(elements).map(([key, value]) => ({
    subject: key,
    value: value,
    fullMark: maxElement > 0 ? maxElement : 5
  })) : []
  
  // 커스텀 라벨 렌더링
  const renderCustomLabel = (entry) => {
    return `${entry.name} (${entry.value})`
  }
  
  const renderPillarLabel = (props) => {
    const { cx, cy, index } = props
    const data = pillarData[index]
    if (!data) return null
    
    return (
      <text x={cx} y={cy} fill="#150137" textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.5em" fontSize="12">{data.천간}</tspan>
        <tspan x={cx} dy="1.2em" fontSize="12">{data.지지}</tspan>
      </text>
    )
  }
  
  return (
    <ChartsContainer>
      {/* 오행 분포 파이 차트 */}
      <ChartCard>
        <ChartTitle>오행 분포도</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={elementsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {elementsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>
      
      {/* 음양 균형 파이 차트 */}
      <ChartCard>
        <ChartTitle>음양 균형도</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={yinYangData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {yinYangData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={YIN_YANG_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>
      
      {/* 오행 균형 레이더 차트 */}
      <ChartCard>
        <ChartTitle>오행 균형 분석</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
              <Radar 
                name="오행" 
                dataKey="value" 
                stroke="#6200ff" 
                fill="#6200ff" 
                fillOpacity={0.6} 
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>
      
      {/* 오행 막대 차트 */}
      <ChartCard>
        <ChartTitle>오행 세부 분석</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={elementsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {elementsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>
    </ChartsContainer>
  )
}

export default SajuCharts