import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dados de exemplo zerados.
const data = [
  { month: "Jan", commission: 0 },
  { month: "Fev", commission: 0 },
  { month: "Mar", commission: 0 },
  { month: "Abr", commission: 0 },
  { month: "Mai", commission: 0 },
  { month: "Jun", commission: 0 },
];

const CommissionsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comissões Mensais</CardTitle>
        <CardDescription>
          Visualização das suas comissões nos últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value: number) =>
                `R$${new Intl.NumberFormat("pt-BR").format(value)}`
              }
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value),
                "Comissão",
              ]}
            />
            <Legend />
            <Bar
              dataKey="commission"
              fill="hsl(var(--primary))"
              name="Comissão"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CommissionsChart;