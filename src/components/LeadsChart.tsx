import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeadPorEstado = {
  categoria: string;
  total: number;
};

type LeadsChartProps = {
  data: LeadPorEstado[];
};

const COLORS = [
  'hsl(var(--info))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--primary))',
  'hsl(var(--secondary))'
];

// CustomTooltip recibe también el array completo de datos
const CustomTooltip = ({
  active,
  payload,
  chartData
}: {
  active?: boolean;
  payload?: { payload: { name: string; value: number } }[];
  chartData: { name: string; value: number }[];
}) => {
  if (active && payload && payload.length) {
    const totalLeads = payload[0].payload.value;
    const sum = chartData.reduce((acc, item) => acc + item.value, 0);
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">
          {totalLeads} leads ({sum > 0 ? ((totalLeads / sum) * 100).toFixed(1) : "0"}%)
        </p>
      </div>
    );
  }
  return null;
};

export const LeadsChart = ({ data }: LeadsChartProps) => {
  // Adaptar los datos para recharts
  const chartData = data.map((item, idx) => ({
    name: item.categoria,
    value: item.total,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados de los leads</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} chartData={chartData} />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};