import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Copy, 
  Search,
  Crown,
  Star,
  Award
} from "lucide-react";
import { toast } from "sonner";

interface NetworkMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  total_sales: number;
  total_commissions: number;
  status: string;
  created_at: string;
  generation: number;
}

const Network = () => {
  const { user } = useAuth();
  const [networkMembers, setNetworkMembers] = useState<NetworkMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [myReferralCode, setMyReferralCode] = useState("");

  useEffect(() => {
    if (user) {
      setMyReferralCode(user.id);
      loadNetworkData();
    }
  }, [user]);

  const loadNetworkData = async () => {
    try {
      // Carregar primeira geração (diretos)
      const { data: firstGen } = await supabase
        .from('profiles')
        .select('*')
        .eq('referrer_id', user?.id);

      // Carregar segunda geração
      const firstGenIds = firstGen?.map(p => p.id) || [];
      const { data: secondGen } = await supabase
        .from('profiles')
        .select('*')
        .in('referrer_id', firstGenIds);

      // Carregar terceira geração
      const secondGenIds = secondGen?.map(p => p.id) || [];
      const { data: thirdGen } = await supabase
        .from('profiles')
        .select('*')
        .in('referrer_id', secondGenIds);

      // Combinar e marcar gerações
      const allMembers = [
        ...(firstGen?.map(m => ({ ...m, generation: 1 })) || []),
        ...(secondGen?.map(m => ({ ...m, generation: 2 })) || []),
        ...(thirdGen?.map(m => ({ ...m, generation: 3 })) || [])
      ];

      setNetworkMembers(allMembers);
    } catch (error) {
      console.error('Erro ao carregar rede:', error);
      toast.error('Erro ao carregar dados da rede');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(myReferralCode);
    toast.success('Código de indicação copiado!');
  };

  const filteredMembers = networkMembers.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenerationIcon = (generation: number) => {
    switch (generation) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Star className="h-4 w-4 text-silver-500" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const getGenerationColor = (generation: number) => {
    switch (generation) {
      case 1: return "from-yellow-500/10 to-yellow-600/10 border-yellow-200/50";
      case 2: return "from-gray-500/10 to-gray-600/10 border-gray-200/50";
      case 3: return "from-orange-500/10 to-orange-600/10 border-orange-200/50";
      default: return "from-blue-500/10 to-blue-600/10 border-blue-200/50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Carregando sua rede...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Minha Rede de Corretores
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie e acompanhe sua rede até a terceira geração
        </p>
      </div>

      {/* Referral Code Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Seu Código de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input 
                value={myReferralCode} 
                readOnly 
                className="bg-white/50 font-mono"
              />
            </div>
            <Button onClick={copyReferralCode} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Compartilhe este código para indicar novos corretores
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {networkMembers.filter(m => m.generation === 1).length}
                </p>
                <p className="text-sm text-muted-foreground">1ª Geração</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {networkMembers.filter(m => m.generation === 2).length}
                </p>
                <p className="text-sm text-muted-foreground">2ª Geração</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {networkMembers.filter(m => m.generation === 3).length}
                </p>
                <p className="text-sm text-muted-foreground">3ª Geração</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Network Members */}
      <div className="space-y-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card key={member.id} className={`bg-gradient-to-br ${getGenerationColor(member.generation)} hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.full_name || 'Nome não informado'}</h3>
                        {getGenerationIcon(member.generation)}
                        <Badge variant="outline">
                          {member.generation}ª Geração
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Vendas</p>
                        <p className="font-bold text-blue-600">{member.total_sales}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Comissões</p>
                        <p className="font-bold text-green-600">R$ {member.total_commissions?.toFixed(2) || '0.00'}</p>
                      </div>
                      <Badge className={member.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum corretor encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece indicando novos corretores para sua rede'}
              </p>
              <Button onClick={() => copyReferralCode()} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Compartilhar Código
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Network;