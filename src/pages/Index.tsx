import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalSales: number;
  totalCommissions: number;
  networkSize: number;
  monthlyGrowth: number;
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
  const [recentSales, setRecentSales] = useState<any[]>([]);

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
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Carregando Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard Imobiliário
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Acompanhe seu desempenho e gerencie sua rede de corretores
        </p>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Sistema Online
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalCommissions.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">em comissões</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minha Rede</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.networkSize}</div>
            <p className="text-xs text-muted-foreground">corretores ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Vendas Recentes da Rede
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSales.length > 0 ? (
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.property_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Vendido por: {sale.profiles?.full_name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {sale.commission_amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma venda registrada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button 
          onClick={() => navigate('/network')} 
          className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span>Gerenciar Rede</span>
          </div>
        </Button>
        
        <Button 
          onClick={() => navigate('/training')} 
          className="h-20 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <div className="text-center">
            <GraduationCap className="h-6 w-6 mx-auto mb-2" />
            <span>Treinamentos</span>
          </div>
        </Button>
        
        <Button 
          onClick={() => navigate('/rewards')} 
          className="h-20 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          <div className="text-center">
            <Award className="h-6 w-6 mx-auto mb-2" />
            <span>Recompensas</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Index;