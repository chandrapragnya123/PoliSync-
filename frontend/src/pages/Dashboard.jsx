import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import "../styles/Dashboard.css";

// Data for different years
const DATA_BY_YEAR = {
  "2020": {
    yearlyData: [
      { year: '2018', reported: 3200, solved: 1900 },
      { year: '2019', reported: 3800, solved: 2200 },
      { year: '2020', reported: 4000, solved: 2400 },
    ],
    solvedUnsolved: [
      { name: 'Solved', value: 6500 },
      { name: 'Unsolved', value: 3800 },
    ],
    crimeTypes: [
      { type: 'Theft', count: 2400 },
      { type: 'Assault', count: 1398 },
      { type: 'Cybercrime', count: 1800 },
      { type: 'Murder', count: 1208 },
    ]
  },
  "2021": {
    yearlyData: [
      { year: '2019', reported: 3800, solved: 2200 },
      { year: '2020', reported: 4000, solved: 2400 },
      { year: '2021', reported: 3500, solved: 2100 },
    ],
    solvedUnsolved: [
      { name: 'Solved', value: 7100 },
      { name: 'Unsolved', value: 4200 },
    ],
    crimeTypes: [
      { type: 'Theft', count: 2200 },
      { type: 'Assault', count: 1500 },
      { type: 'Cybercrime', count: 2400 },
      { type: 'Murder', count: 1100 },
    ]
  },
  "2022": {
    yearlyData: [
      { year: '2020', reported: 4000, solved: 2400 },
      { year: '2021', reported: 3500, solved: 2100 },
      { year: '2022', reported: 4800, solved: 3200 },
    ],
    solvedUnsolved: [
      { name: 'Solved', value: 7700 },
      { name: 'Unsolved', value: 4600 },
    ],
    crimeTypes: [
      { type: 'Theft', count: 2400 },
      { type: 'Assault', count: 1398 },
      { type: 'Cybercrime', count: 2800 },
      { type: 'Murder', count: 3908 },
    ]
  }
};

// New neon colors with better contrast
const NEON_COLORS = ['#10b981', '#f59e0b', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// State data
const stateData = [
  { state: "Maharashtra", total: 5200, solved: 3900, image: "https://images.unsplash.com/photo-1600510538452-bfacea875ebb?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
  { state: "Delhi", total: 4800, solved: 3200, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
  { state: "Karnataka", total: 3600, solved: 2800, image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
  { state: "Tamil Nadu", total: 3200, solved: 2600, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
  { state: "Gujarat", total: 2800, solved: 2100, image: "https://images.unsplash.com/photo-1604314022013-34ca08f0a634?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
  { state: "Telangana", total: 3100, solved: 2300, image: "https://images.unsplash.com/photo-1477959858443-696a12221d8c?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3" },
];

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2022");
  const [selectedCrimeType, setSelectedCrimeType] = useState("All Types");
  const [data, setData] = useState(DATA_BY_YEAR[selectedYear]);
  const [expandedState, setExpandedState] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Update data when year changes
  useEffect(() => {
    setData(DATA_BY_YEAR[selectedYear]);
  }, [selectedYear]);

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
           <p key={`item-${index}`} style={{ color: entry.color }}>
  {`${entry.name}: ${entry.value.toLocaleString()}`}
</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    showToast(`Data now showing for ${year}`);
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedCrimeType(type);
    showToast(`Filtering by ${type}`);
  };

  const handleStateCardClick = (state) => {
    setExpandedState(expandedState === state ? null : state);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="crime-dashboard">
      {/* Header */}
      <header>
        <div className="header-content">
          <div className="header-logo">
            
          </div>
          <div className="header-text">
            <h1>Crime Statistics Dashboard</h1>
            <p>Explore the current trends and police efficiency in solving crimes across India</p>
          </div>
        </div>
        <div className="header-divider"></div>
      </header>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-group">
          <label>
            <span className="filter-dot"></span>
            Select Year
          </label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <div className="filter-group">
          <label>
            <span className="filter-dot"></span>
            Crime Type
          </label>
          <select value={selectedCrimeType} onChange={handleTypeChange}>
            <option value="All Types">All Types</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Murder">Murder</option>
          </select>
        </div>
      </section>

      {/* Chart Section */}
      <section className="chart-section">
        <div className="chart-card yearly-trends">
          <h2>Yearly Crime Trends</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.yearlyData} className="chart-animation">
                <CartesianGrid strokeDasharray="3 3" stroke="#CCC5B9" />
                <XAxis dataKey="year" stroke="#403D39" />
                <YAxis stroke="#403D39" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="reported" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 6, fill: '#FFFCF2' }}
                  activeDot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 8, fill: '#8B5CF6' }}
                  className="chart-animation"
                />
                <Line 
                  type="monotone" 
                  dataKey="solved" 
                  stroke="#D946EF" 
                  strokeWidth={3} 
                  dot={{ stroke: '#D946EF', strokeWidth: 2, r: 6, fill: '#FFFCF2' }}
                  activeDot={{ stroke: '#D946EF', strokeWidth: 2, r: 8, fill: '#D946EF' }}
                  className="chart-animation"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card solved-unsolved">
          <h2>Solved vs Unsolved Cases</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.solvedUnsolved}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill={NEON_COLORS[index % NEON_COLORS.length]}
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontWeight="bold"
                      >
                        {`${data.solvedUnsolved[index].name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  <Cell fill="url(#solvedGrad)" stroke="#252422" strokeWidth={2} className="chart-animation" />
                  <Cell fill="url(#unsolvedGrad)" stroke="#252422" strokeWidth={2} className="chart-animation" />
                </Pie>
                <defs>
                  <radialGradient id="solvedGrad" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.9}/>
                  </radialGradient>
                  <radialGradient id="unsolvedGrad" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#EB5E28" stopOpacity={0.9}/>
                  </radialGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="chart-section crime-by-type">
        <div className="chart-card full-width">
          <h2>Crime by Type</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.crimeTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CCC5B9" />
                <XAxis dataKey="type" stroke="#403D39" />
                <YAxis stroke="#403D39" />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  {data.crimeTypes.map((_, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`colorGrad${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={NEON_COLORS[index % NEON_COLORS.length]} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={NEON_COLORS[index % NEON_COLORS.length]} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]}
                  className="chart-animation"
                >
                  {data.crimeTypes.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#colorGrad${index})`} 
                      stroke={NEON_COLORS[index % NEON_COLORS.length]} 
                      strokeWidth={1}
                    />
                  ))}
                  <LabelList dataKey="count" position="top" fill="#252422" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Key Stats Highlights */}
      <section className="stats-highlights">
        <h2 className="section-title">
          <span className="section-marker"></span>
          Key Statistics Highlights
        </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Crime Rate</h3>
            <div className="stat-value">
              <span className="number">15.8%</span>
              <div className="change-down">
                <span className="arrow">↓</span>
                <span>2.3%</span>
              </div>
            </div>
            <p>Overall crime rate compared to previous year</p>
          </div>

          <div className="stat-card">
            <h3>Case Resolution</h3>
            <div className="stat-value">
              <span className="number">73.4%</span>
              <div className="change-up">
                <span className="arrow">↑</span>
                <span>5.7%</span>
              </div>
            </div>
            <p>Cases successfully resolved this year</p>
          </div>

          <div className="stat-card">
            <h3>Response Time</h3>
            <div className="stat-value">
              <span className="number">18 min</span>
              <div className="change-down">
                <span className="arrow">↓</span>
                <span>12.5%</span>
              </div>
            </div>
            <p>Average emergency response time</p>
          </div>

          <div className="stat-card">
            <h3>Public Safety Index</h3>
            <div className="stat-value">
              <span className="number">8.2/10</span>
              <div className="change-up">
                <span className="arrow">↑</span>
                <span>0.5%</span>
              </div>
            </div>
            <p>Based on public surveys and crime statistics</p>
          </div>
        </div>
      </section>

      {/* State Stats */}
      <section className="state-stats-section">
        <h2 className="section-title">
          <span className="section-marker"></span>
          State-wise Crime Statistics
        </h2>
        <div className="state-grid">
          {stateData.map((state) => (
            <div 
              key={state.state} 
              className={`state-card ${expandedState === state.state ? 'expanded' : ''}`}
              onClick={() => handleStateCardClick(state.state)}
            >
              <div className="state-info">
                <img 
                  src={state.image} 
                  alt={state.state} 
                  className="state-image" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3';
                  }}
                />
                <div>
                  <h3>{state.state}</h3>
                  <div className="state-data">
                    <div className="data-row">
                      <span>Total Cases:</span>
                      <span className="value">{state.total}</span>
                    </div>
                    <div className="data-row">
                      <span>Solved:</span>
                      <span className="solved-value">{state.solved}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${(state.solved / state.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedState === state.state && (
                <div className="expanded-content">
                  <h4>
                    <span className="mini-marker"></span>
                    Case Breakdown:
                  </h4>
                  <div className="breakdown-grid">
                    <div className="breakdown-item">
                      <span>Theft:</span>
                      <span>{Math.floor(state.total * 0.3)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Assault:</span>
                      <span>{Math.floor(state.total * 0.25)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Cybercrime:</span>
                      <span>{Math.floor(state.total * 0.2)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Murder:</span>
                      <span>{Math.floor(state.total * 0.1)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Others:</span>
                      <span>{Math.floor(state.total * 0.15)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast-notification ${toastVisible ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </div>
    
  );
};

export default Dashboard;