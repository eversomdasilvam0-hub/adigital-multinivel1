import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Trophy, 
  Crown, 
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
  Gift,
  Medal,
  Sparkles
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  current: number;
  reward: string;
  type: 'sales' | 'network' | 'commission';
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  sales: number;
  commissions: number;
  networkSize: number;
  rank: number;
}

const Rewards = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    networkSize: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'leaderboard'>('achievements');

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadLeaderboard();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_sales, total_commissions')
        .eq('id', user?.id)
        .single();

      const { data: network } = await supabase
        .from('profiles')
        .select('id')
        .eq('referrer_id', user?.id);

      setUserStats({
        totalSales: profile?.total_sales || 0,
        totalCommissions: profile?.total_commissions || 0,
        networkSize: network?.length || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, total_sales, total_commissions')
        .order('total_sales', { ascending: false })
        .limit(10);

      const leaderboardData = profiles?.map((profile, index) => ({
        id: profile.id,
        name: profile.full_name || 'Usuário',
        sales: profile.total_sales || 0,
        commissions: profile.total_commissions || 0,
        networkSize: 0, // Placeholder
        rank: index + 1
      })) || [];

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    }
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primeira Venda',
      description: 'Realize sua primeira venda',
      icon: Target,
      requirement: 1,
      current: userStats.totalSales,
      reward: 'Badge Iniciante',
      type: 'sales',
      rarity: 'bronze',
      unlocked: userStats.totalSales >= 1
    },
    {
      id: '2',
      title: 'Vendedor Experiente',
      description: 'Complete 10 vendas',
      icon: TrendingUp,
      requirement: 10,
      current: userStats.totalSales,
      reward: 'Badge Experiente + R$ 100 bônus',
      type: 'sales',
      rarity: 'silver',
      unlocked: userStats.totalSales >= 10
    },
    {
      id: '3',
      title: 'Mestre das Vendas',
      description: 'Alcance 50 vendas',
      icon: Crown,
      requirement: 50,
      current: userStats.totalSales,
      reward: 'Badge Mestre + R$ 500 bônus',
      type: 'sales',
      rarity: 'gold',
      unlocked: userStats.totalSales >= 50
    },
    {
      id: '4',
      title: 'Lenda das Vendas',
      description: 'Complete 100 vendas',
      icon: Trophy,
      requirement: 100,
      current: userStats.totalSales,
      reward: 'Badge Lenda + R$ 1000 bônus',
      type: 'sales',
      rarity: 'diamond',
      unlocked: userStats.totalSales >= 100
    },
    {
      id: '5',
      title: 'Construtor de Rede',
      description: 'Tenha 5 pessoas em sua rede',
      icon: Users,
      requirement: 5,
      current: userStats.networkSize,
      reward: 'Badge Construtor',
      type: 'network',
      rarity: 'bronze',
      unlocked: userStats.networkSize >= 5
    },
    {
      id: '6',
      title: 'Líder de Equipe',
      description: 'Construa uma rede de 25 pessoas',
      icon: Award,
      requirement: 25,
      current: userStats.networkSize,
      reward: 'Badge Líder + R$ 300 bônus',
      type: 'network',
      rarity: 'silver',
      unlocked: userStats.networkSize >= 25
    },
    {
      id: '7',
      title: 'Milionário',
      description: 'Acumule R$ 10.000 em comissões',
      icon: Zap,
      requirement: 10000,
      current: userStats.totalCommissions,
      reward: 'Badge Milionário + Viagem',
      type: 'commission',
      rarity: 'diamond',
      unlocked: userStats.totalCommissions >= 10000
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'diamond': return 'from-blue-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'border-orange-200/50';
      case 'silver': return 'border-gray-200/50';
      case 'gold': return 'border-yellow-200/50';
      case 'diamond': return 'border-purple-200/50';
      default: return 'border-gray-200/50';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl mb-4">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Sistema de Recompensas
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Conquiste badges, suba no ranking e ganhe recompensas incríveis
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{userStats.totalSales}</p>
                <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{userStats.networkSize}</p>
                <p className="text-sm text-muted-foreground">Tamanho da Rede</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">R$ {userStats.totalCommissions.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Comissões Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-1 rounded-2xl shadow-lg">
        <button
          onClick={() => setSelectedTab('achievements')}
          className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300 font-medium ${
            selectedTab === 'achievements'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Award className="h-5 w-5 inline mr-2" />
          Conquistas
        </button>
        <button
          onClick={() => setSelectedTab('leaderboard')}
          className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300  font-medium ${
            selectedTab === 'leaderboard'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Trophy className="h-5 w-5 inline mr-2" />
          Ranking
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'achievements' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
            
            return (
              <Card 
                key={achievement.id}
                className={`relative overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${getRarityBorder(achievement.rarity)}`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {achievement.unlocked && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}></div>
                
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-2xl flex items-center justify-center ${achievement.unlocked ? '' : 'opacity-50'}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                        {achievement.title}
                      </CardTitle>
                      <Badge className={`${achievement.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className={`text-sm ${achievement.unlocked ? 'text-muted-foreground' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className="font-medium">
                        {achievement.current}/{achievement.requirement}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Recompensa:</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.reward}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Ranking de Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    entry.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {entry.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{entry.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.sales} vendas • R$ {entry.commissions.toFixed(2)} em comissões
                    </p>
                  </div>
                  
                  {entry.rank <= 3 && (
                    <Badge className={`${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {entry.rank === 1 ? '🥇 Ouro' : entry.rank === 2 ? '🥈 Prata' : '🥉 Bronze'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Rewards;