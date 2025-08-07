import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp,
  DollarSign,
  Users,
  Award
} from "lucide-react";

interface ProfileStatsProps {
  totalSales: number;
  totalCommissions: number;
  networkSize: number;
  achievements: number;
}

const ProfileStats = ({ 
  totalSales, 
  totalCommissions, 
  networkSize, 
  achievements 
}: ProfileStatsProps) => {
  const stats = [
    {
      icon: TrendingUp,
      value: totalSales,
      label: "Vendas Realizadas",
      color: "blue",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      border: "border-blue-200/50"
    },
    {
      icon: DollarSign,
      value: `R$ ${totalCommissions.toFixed(0)}`,
      label: "Comissões Totais",
      color: "green",
      gradient: "from-green-600 to-green-700",
      bgGradient: "from-green-500/10 to-green-600/10",
      border: "border-green-200/50"
    },
    {
      icon: Users,
      value: networkSize,
      label: "Tamanho da Rede",
      color: "purple",
      gradient: "from-purple-600 to-purple-700",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      border: "border-purple-200/50"
    },
    {
      icon: Award,
      value: achievements,
      label: "Conquistas",
      color: "orange",
      gradient: "from-orange-600 to-orange-700",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      border: "border-orange-200/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} ${stat.border} backdrop-blur-xl hover:shadow-xl transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileStats;