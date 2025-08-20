// src/components/ConversationsChart.tsx

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Tipamos los datos que recibe el componente
type ConversacionPorDia = {
  dia: string;
  total_conversaciones: number;
};

interface ConversationsChartProps {
  data: ConversacionPorDia[];
}

// ✅ Exportación nombrada
export const ConversationsChart = ({ data }: ConversationsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversaciones por día</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="dia" // ✅ OJO: usa el campo correcto según tu API
              className="text-muted-foreground" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-muted-foreground" 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="total_conversaciones" // ✅ OJO: campo correcto
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
