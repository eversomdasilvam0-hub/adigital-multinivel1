import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Target,
  Zap,
  Crown,
  Star,
  Calendar,
  Building,
  User
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalSales: number;
  totalCommissions: number;
  networkSize: number;
  monthlyGrowth: number;
}

interface RecentSale {
  id: string;
  property_name: string;
  sale_date: string;
  commission_amount: number;
  profiles: {
    full_name: string;
  };
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalCommissions: 0,
    networkSize: 0,
    monthlyGrowth: 0
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_sales, total_commissions')
        .eq('id', user?.id)
        .single();

      // Carregar tamanho da rede
      const { data: network } = await supabase
        .from('profiles')
        .select('id')
        .eq('referrer_id', user?.id);

      // Carregar vendas recentes da rede
      const { data: sales } = await supabase
        .from('sales')
        .select(`
          *,
          profiles:seller_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalSales: profile?.total_sales || 0,
        totalCommissions: profile?.total_commissions || 0,
        networkSize: network?.length || 0,
        monthlyGrowth: 15 // Placeholder
      });

      setRecentSales(sales || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Carregando Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">Sistema Online</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                Bem-vindo de volta!
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                Acompanhe seu desempenho e gerencie sua rede de corretores com nossa plataforma inteligente
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                Rank Premium
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Top Performer
              </Badge>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total de Vendas",
            value: stats.totalSales,
            icon: TrendingUp,
            color: "blue",
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            change: "+12%",
            changeType: "positive"
          },
          {
            title: "Comissões",
            value: `R$ ${stats.totalCommissions.toFixed(2)}`,
            icon: DollarSign,
            color: "green",
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-500/10 to-emerald-500/10",
            change: "+8%",
            changeType: "positive"
          },
          {
            title: "Minha Rede",
            value: stats.networkSize,
            icon: Users,
            color: "purple",
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-500/10 to-pink-500/10",
            change: "+23%",
            changeType: "positive"
          },
          {
            title: "Crescimento",
            value: `+${stats.monthlyGrowth}%`,
            icon: Award,
            color: "orange",
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-500/10 to-red-500/10",
            change: "Este mês",
            changeType: "neutral"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className={`group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  } group-hover:text-white/80 transition-colors duration-300`}>
                    {stat.change}
                  </span>
                  {stat.changeType === 'positive' && (
                    <ArrowUpRight className="h-4 w-4 text-green-600 group-hover:text-white/80 transition-colors duration-300" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:gri d-cols-3 gap-6">
        {[
          {
            title: "Gerenciar Rede",
            description: "Visualize e gerencie sua rede de corretores",
            icon: Users,
            href: "/network",
            gradient: "from-blue-600 to-purple-600",
            bgGradient: "from-blue-500/10 to-purple-500/10"
          },
          {
            title: "Treinamentos",
            description: "Acesse cursos e materiais de capacitação",
            icon: GraduationCap,
            href: "/training",
            gradient: "from-green-600 to-emerald-600",
            bgGradient: "from-green-500/10 to-emerald-500/10"
          },
          {
            title: "Recompensas",
            description: "Veja suas conquistas e prêmios",
            icon: Award,
            href: "/rewards",
            gradient: "from-orange-600 to-red-600",
            bgGradient: "from-orange-500/10 to-red-500/10"
          }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className={`group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
              onClick={() => navigate(action.href)}
              style={{
                animationDelay: `${(index + 4) * 100}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                  <Button 
                    className={`bg-gradient-to-r ${action.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    Acessar
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Sales */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Vendas Recentes da Rede
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSales.length > 0 ? (
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div 
                  key={sale.id} 
                  className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{sale.property_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Vendido por: {sale.profiles?.full_name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 mb-1">
                      R$ {sale.commission_amount.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(sale.sale_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nenhuma venda registrada</h3>
              <p className="text-muted-foreground text-lg mb-6">
                As vendas da sua rede aparecerão aqui
              </p>
              <Button 
                onClick={() => navigate('/network')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Rede
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;