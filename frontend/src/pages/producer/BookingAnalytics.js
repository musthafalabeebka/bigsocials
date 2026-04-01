import React from 'react';
import Sidebar from '../../components/Sidebar';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockBookingData } from '../../data/mockData';
import { TrendingUp, DollarSign, Film, Users, MapPinned, BadgePercent } from 'lucide-react';

const chartCard = 'bg-surface-container-lowest rounded-DEFAULT p-6 shadow-ambient';
const tooltipStyle = {
  backgroundColor: '#fbf9f3',
  border: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 24px rgba(26,63,212,0.08)',
};

const heatColors = ['#dbe5ff', '#adc3ff', '#7f9eff', '#4f79f2', '#214ecf', '#0028aa'];

/* ── District coordinates (lon/lat → SVG px)
   formula: x = (lon − 74) × 35,  y = (20.5 − lat) × 35 + 20  ── */
const DISTRICT_COORDS = {
  'Chennai':           { x: 219, y: 280 },
  'Kochi':             { x: 79,  y: 390 },
  'Hyderabad':         { x: 157, y: 129 },
  'Thiruvananthapuram':{ x: 103, y: 439 },
  'Vijayawada':        { x: 232, y: 160 },
  'Coimbatore':        { x: 104, y: 352 },
};

const SouthIndiaMap = ({ data }) => {
  const [hovered, setHovered] = React.useState(null);
  const maxBookings = Math.max(...data.map(d => d.bookings));

  const heatColor = (intensity) => {
    const idx = Math.min(Math.floor((intensity / 100) * heatColors.length), heatColors.length - 1);
    return heatColors[idx];
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 380 490" className="w-full" style={{ maxHeight: 380 }}>
        {/* ── State fills ── */}
        {/* Karnataka — context (grey) */}
        <polygon
          points="28,108 158,108 158,175 140,175 140,265 122,265 122,307 52,307 28,108"
          fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5"
        />
        {/* Kerala */}
        <polygon
          points="28,307 52,307 122,307 119,335 112,385 98,440 88,455 52,455 34,423 28,370 28,307"
          fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"
        />
        {/* Tamil Nadu */}
        <polygon
          points="122,265 220,265 213,475 88,475 98,440 112,385 119,335 122,307 122,265"
          fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.5"
        />
        {/* Telangana */}
        <polygon
          points="112,45 258,45 258,158 112,184 112,45"
          fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"
        />
        {/* Andhra Pradesh */}
        <polygon
          points="220,265 350,265 350,45 258,45 258,158 140,175 140,265 220,265"
          fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"
        />

        {/* ── State labels ── */}
        <text x="62"  y="400" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">KERALA</text>
        <text x="145" y="390" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">TAMIL</text>
        <text x="145" y="400" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">NADU</text>
        <text x="155" y="115" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">TELANGANA</text>
        <text x="270" y="200" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">ANDHRA</text>
        <text x="270" y="210" fontSize="8" fill="#64748b" fontWeight="600" opacity="0.8">PRADESH</text>
        <text x="48"  y="175" fontSize="8" fill="#94a3b8" fontWeight="500" opacity="0.7">KARNATAKA</text>

        {/* ── District heat bubbles ── */}
        {data.map((d) => {
          const coords = DISTRICT_COORDS[d.district];
          if (!coords) return null;
          const r = 10 + (d.bookings / maxBookings) * 18;
          const color = heatColor(d.intensity);
          const isHov = hovered === d.district;
          return (
            <g
              key={d.district}
              onMouseEnter={() => setHovered(d.district)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring on hover */}
              {isHov && (
                <circle cx={coords.x} cy={coords.y} r={r + 5}
                  fill={color} opacity="0.25" />
              )}
              <circle cx={coords.x} cy={coords.y} r={r}
                fill={color} stroke="white" strokeWidth={isHov ? 2.5 : 1.5} opacity="0.92" />
              <text
                x={coords.x} y={coords.y + 3}
                textAnchor="middle" fontSize="7.5"
                fill={d.intensity > 60 ? 'white' : '#1e3a8a'}
                fontWeight="700"
              >
                {(d.bookings / 1000).toFixed(0)}K
              </text>
              {/* District name label */}
              <text
                x={coords.x} y={coords.y + r + 11}
                textAnchor="middle" fontSize="7"
                fill="#334155" fontWeight="600"
              >
                {d.district}
              </text>
            </g>
          );
        })}

        {/* ── Tooltip ── */}
        {hovered && (() => {
          const d = data.find(x => x.district === hovered);
          const coords = DISTRICT_COORDS[hovered];
          if (!d || !coords) return null;
          const tx = Math.min(coords.x + 14, 260);
          const ty = Math.max(coords.y - 48, 10);
          return (
            <g>
              <rect x={tx} y={ty} width={110} height={44} rx="6" fill="white"
                stroke="#e2e8f0" strokeWidth="1"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }} />
              <text x={tx + 8} y={ty + 14} fontSize="9" fontWeight="700" fill="#1b1c19">{d.district}</text>
              <text x={tx + 8} y={ty + 26} fontSize="8" fill="#64748b">{d.state}</text>
              <text x={tx + 8} y={ty + 38} fontSize="9" fontWeight="700" fill="#0028aa">
                {d.bookings.toLocaleString()} bookings
              </text>
            </g>
          );
        })()}
      </svg>

      {/* ── Legend ── */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-[#888] font-semibold">Low</span>
        <div className="flex gap-0.5">
          {heatColors.map((c, i) => (
            <div key={i} className="w-6 h-3 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <span className="text-xs text-[#888] font-semibold">High</span>
      </div>
    </div>
  );
};

const BookingAnalytics = () => {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">Bookings</h1>
          <p className="text-lg font-body text-muted-foreground">
            Box office momentum, theatre performance, and market response in one view
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div className={chartCard}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-body text-muted-foreground uppercase">Total Collections</p>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold font-mono">
                ₹{(mockBookingData.total_collections / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-sm font-body text-success mt-1">+12% from last week</p>
            </div>

            <div className={chartCard}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-body text-muted-foreground uppercase">Total ROI</p>
                <BadgePercent className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-heading font-bold font-mono">{mockBookingData.total_roi}%</p>
              <p className="text-sm font-body text-muted-foreground mt-1">
                Against ₹{(mockBookingData.total_marketing_spend / 10000000).toFixed(1)}Cr spend
              </p>
            </div>

            <div className={chartCard}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-body text-muted-foreground uppercase">Efficiency Score</p>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold font-mono">{mockBookingData.efficiency_score}/100</p>
              <p className="text-sm font-body text-success mt-1">High conversion efficiency</p>
            </div>

            <div className={chartCard}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-body text-muted-foreground uppercase">Top Theatre Bookings</p>
                <Film className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold font-mono">
                {mockBookingData.top_theatres[0].bookings.toLocaleString()}
              </p>
              <p className="text-sm font-body text-muted-foreground mt-1">
                {mockBookingData.top_theatres[0].theatre}
              </p>
            </div>

            <div className={chartCard}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-body text-muted-foreground uppercase">District Reach</p>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold font-mono">
                {mockBookingData.district_wise.length}
              </p>
              <p className="text-sm font-body text-muted-foreground mt-1">Tracked districts</p>
            </div>
          </div>

          <div className={chartCard}>
            <h2 className="text-2xl font-heading font-bold mb-6">Daily Booking Trend</h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={mockBookingData.daily_collections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e2" />
                <XAxis dataKey="day" stroke="#79767d" />
                <YAxis stroke="#79767d" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0028aa"
                  fill="#cdd9ff"
                  strokeWidth={3}
                  name="Collections (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className={chartCard}>
              <h2 className="text-2xl font-heading font-bold mb-6">Top Performing Theatres</h2>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={mockBookingData.top_theatres}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 8, left: 110 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e2" />
                  <XAxis type="number" stroke="#79767d" />
                  <YAxis
                    dataKey="theatre"
                    type="category"
                    width={150}
                    stroke="#3f3a46"
                    tick={{ fill: '#3f3a46', fontSize: 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="bookings" radius={[0, 8, 8, 0]} fill="#0028aa" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={chartCard}>
              <h2 className="text-2xl font-heading font-bold mb-6">District Wise Booking</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={mockBookingData.district_wise}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e2" />
                  <XAxis dataKey="district" stroke="#79767d" />
                  <YAxis stroke="#79767d" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                    {mockBookingData.district_wise.map((entry, index) => (
                      <Cell
                        key={entry.district}
                        fill={heatColors[index % heatColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className={chartCard}>
              <div className="flex items-center gap-3 mb-6">
                <MapPinned className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold">Geographic Heat Map</h2>
              </div>
              <SouthIndiaMap data={mockBookingData.district_wise} />
            </div>

            <div className={chartCard}>
              <h2 className="text-2xl font-heading font-bold mb-6">
                Marketing vs Booking Correlation
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e2" />
                  <XAxis
                    type="number"
                    dataKey="marketing_spend"
                    name="Marketing Spend"
                    stroke="#79767d"
                  />
                  <YAxis
                    type="number"
                    dataKey="bookings"
                    name="Bookings"
                    stroke="#79767d"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={tooltipStyle}
                  />
                  <Scatter data={mockBookingData.marketing_vs_booking} fill="#0028aa" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className={chartCard}>
              <h2 className="text-2xl font-heading font-bold mb-6">Marketing and Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mockBookingData.marketing_vs_booking}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e2" />
                  <XAxis dataKey="week" stroke="#79767d" />
                  <YAxis stroke="#79767d" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="marketing_spend"
                    stroke="#1a3fd4"
                    strokeWidth={3}
                    name="Marketing Spend"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00a86b"
                    strokeWidth={3}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={chartCard}>
              <h2 className="text-2xl font-heading font-bold mb-6">Top Theatre Revenue Table</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left py-3 px-4 font-body font-semibold text-muted-foreground uppercase text-sm">
                      Theatre
                    </th>
                    <th className="text-right py-3 px-4 font-body font-semibold text-muted-foreground uppercase text-sm">
                      Bookings
                    </th>
                    <th className="text-right py-3 px-4 font-body font-semibold text-muted-foreground uppercase text-sm">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookingData.top_theatres.map((theatre) => (
                    <tr
                      key={theatre.theatre}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-body font-semibold">{theatre.theatre}</p>
                        <p className="text-xs text-muted-foreground">{theatre.city}</p>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold">
                        {theatre.bookings.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-primary">
                        ₹{(theatre.revenue / 100000).toFixed(1)}L
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
