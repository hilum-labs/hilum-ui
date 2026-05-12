
import { PreviewBlock } from "@/components/catalog/preview-block";
import {
  ChartContainer,
  ChartTooltip,
  CHART_COLORS,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis,
  RechartsTooltip, Legend,
} from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Sample data                                                          */
/* ------------------------------------------------------------------ */

const monthlyData = [
  { month: "Jan", revenue: 4200, users: 240, conversions: 18 },
  { month: "Feb", revenue: 5800, users: 310, conversions: 24 },
  { month: "Mar", revenue: 5200, users: 280, conversions: 21 },
  { month: "Apr", revenue: 7100, users: 390, conversions: 31 },
  { month: "May", revenue: 6800, users: 360, conversions: 28 },
  { month: "Jun", revenue: 9200, users: 480, conversions: 42 },
  { month: "Jul", revenue: 8400, users: 440, conversions: 38 },
];

const categoryData = [
  { name: "Design", value: 38, color: CHART_COLORS.primary },
  { name: "Engineering", value: 30, color: CHART_COLORS.secondary },
  { name: "Marketing", value: 18, color: CHART_COLORS.tertiary },
  { name: "Sales", value: 14, color: CHART_COLORS.muted },
];

const weeklyData = [
  { day: "Mon", sessions: 120, bounces: 40 },
  { day: "Tue", sessions: 185, bounces: 52 },
  { day: "Wed", sessions: 160, bounces: 38 },
  { day: "Thu", sessions: 210, bounces: 61 },
  { day: "Fri", sessions: 195, bounces: 48 },
  { day: "Sat", sessions: 90, bounces: 30 },
  { day: "Sun", sessions: 75, bounces: 25 },
];

/* ------------------------------------------------------------------ */
/*  Axis defaults                                                        */
/* ------------------------------------------------------------------ */

const axisProps = {
  tick: { fill: "#a8978a", fontSize: 12 },
  axisLine: false,
  tickLine: false,
} as const;

/* ------------------------------------------------------------------ */
/*  Code snippets                                                        */
/* ------------------------------------------------------------------ */

const CODE = {
  barChart: `import {
  ChartContainer, ChartTooltip, CHART_COLORS,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, RechartsTooltip,
} from "@hilum/ui";

<ChartContainer height={280}>
  <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
    <XAxis dataKey="month" tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <RechartsTooltip content={<ChartTooltip />} />
    <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>`,

  lineChart: `import {
  ChartContainer, ChartTooltip, CHART_COLORS,
  LineChart, Line, CartesianGrid, XAxis, YAxis, RechartsTooltip,
} from "@hilum/ui";

<ChartContainer height={280}>
  <LineChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
    <XAxis dataKey="month" tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <RechartsTooltip content={<ChartTooltip />} />
    <Line
      type="monotone"
      dataKey="users"
      stroke={CHART_COLORS.primary}
      strokeWidth={2}
      dot={{ fill: CHART_COLORS.primary, r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ChartContainer>`,

  areaChart: `import {
  ChartContainer, ChartTooltip, CHART_COLORS,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, RechartsTooltip, Legend,
} from "@hilum/ui";

<ChartContainer height={280}>
  <AreaChart data={weeklyData}>
    <defs>
      <linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
      </linearGradient>
      <linearGradient id="bounces" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.15} />
        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
    <XAxis dataKey="day" tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <RechartsTooltip content={<ChartTooltip />} />
    <Legend />
    <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS.primary} fill="url(#sessions)" strokeWidth={2} />
    <Area type="monotone" dataKey="bounces" stroke={CHART_COLORS.secondary} fill="url(#bounces)" strokeWidth={2} />
  </AreaChart>
</ChartContainer>`,

  pieChart: `import {
  ChartContainer, CHART_COLORS,
  PieChart, Pie, Cell, RechartsTooltip,
} from "@hilum/ui";

const categoryData = [
  { name: "Design", value: 38, color: CHART_COLORS.primary },
  { name: "Engineering", value: 30, color: CHART_COLORS.secondary },
  { name: "Marketing", value: 18, color: CHART_COLORS.tertiary },
  { name: "Sales", value: 14, color: CHART_COLORS.muted },
];

<ChartContainer height={220}>
  <PieChart>
    <Pie
      data={categoryData}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={100}
      paddingAngle={3}
      dataKey="value"
    >
      {categoryData.map((entry, i) => (
        <Cell key={i} fill={entry.color} />
      ))}
    </Pie>
    <RechartsTooltip />
  </PieChart>
</ChartContainer>`,

  multiBar: `import {
  ChartContainer, ChartTooltip, CHART_COLORS,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, RechartsTooltip, Legend,
} from "@hilum/ui";

<ChartContainer height={280}>
  <BarChart data={monthlyData} barSize={10}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
    <XAxis dataKey="month" tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: "#a8978a", fontSize: 12 }} axisLine={false} tickLine={false} />
    <RechartsTooltip content={<ChartTooltip />} />
    <Legend />
    <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
    <Bar dataKey="conversions" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>`,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */

export default function ChartPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Chart</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Chart</h1>
        <p className="body max-w-lg text-taupe-500">
          Brand-styled chart components built on Recharts. Includes bar, line, area, and pie variants with a consistent design language.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <SectionHeading label="Chart" />

        {/* 1. Bar chart */}
        <PreviewBlock
          title="Bar Chart"
          description="Monthly revenue as grouped bars"
          code={CODE.barChart}
          previewClassName="p-6"
        >
          <div className="w-full rounded-xl border border-taupe-100 bg-white p-6 shadow-natural">
            <p className="subheading mb-4 text-taupe-900">Monthly Revenue</p>
            <ChartContainer height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </PreviewBlock>

        {/* 2. Line chart */}
        <PreviewBlock
          title="Line Chart"
          description="User growth over time as a continuous line"
          code={CODE.lineChart}
          previewClassName="p-6"
        >
          <div className="w-full rounded-xl border border-taupe-100 bg-white p-6 shadow-natural">
            <p className="subheading mb-4 text-taupe-900">User Growth</p>
            <ChartContainer height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </PreviewBlock>

        {/* 3. Area chart */}
        <PreviewBlock
          title="Area Chart"
          description="Weekly sessions vs. bounces with filled gradient areas"
          code={CODE.areaChart}
          previewClassName="p-6"
        >
          <div className="w-full rounded-xl border border-taupe-100 bg-white p-6 shadow-natural">
            <p className="subheading mb-4 text-taupe-900">Weekly Traffic</p>
            <ChartContainer height={280}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBounces" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#a8978a", paddingTop: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke={CHART_COLORS.primary}
                  fill="url(#colorSessions)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="bounces"
                  stroke={CHART_COLORS.secondary}
                  fill="url(#colorBounces)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </PreviewBlock>

        {/* 4. Donut / Pie chart */}
        <PreviewBlock
          title="Donut Chart"
          description="Category breakdown with a custom legend"
          code={CODE.pieChart}
          previewClassName="p-6"
        >
          <div className="w-full rounded-xl border border-taupe-100 bg-white p-6 shadow-natural">
            <p className="subheading mb-4 text-taupe-900">Team Breakdown</p>
            <ChartContainer height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTooltip />} />
              </PieChart>
            </ChartContainer>
            {/* Custom legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="caption text-taupe-500">{entry.name}</span>
                  <span className="caption font-medium text-taupe-900">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </PreviewBlock>

        {/* 5. Multi-bar chart */}
        <PreviewBlock
          title="Grouped Bar Chart"
          description="Revenue and conversions compared side-by-side"
          code={CODE.multiBar}
          previewClassName="p-6"
        >
          <div className="w-full rounded-xl border border-taupe-100 bg-white p-6 shadow-natural">
            <p className="subheading mb-4 text-taupe-900">Revenue vs Conversions</p>
            <ChartContainer height={280}>
              <BarChart data={monthlyData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2eeea" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#a8978a", paddingTop: 8 }}
                />
                <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </PreviewBlock>
      </div>

      <div className="h-16" />
    </div>
  );
}
