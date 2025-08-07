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

// Dados de exemplo. Substituiremos por dados reais no futuro.
const data = [
  { month: "Jan", commission: 4000 },
  { month: "Fev", commission: 3000 },
  { month: "Mar", commission: 5000 },
  { month: "Abr", commission: 4500 },
  { month: "Mai", commission: 6000 },
  { month: "Jun", commission: 8000 },
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
              tickFormatter={(value) =>
                `R$${new Intl.NumberFormat("pt-BR").format(value as number)}`
              }
            />
            <Tooltip
              formatter={(value) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value as number),
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