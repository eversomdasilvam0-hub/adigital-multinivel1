import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Crown,
  Target,
  Zap,
  Copy,
  ExternalLink,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  referrer_id: string | null;
  created_at: string;
  role: string;
  total_sales: number;
  total_commissions: number;
  status: string;
}

interface ProfileStats {
  networkSize: number;
  monthlyCommissions: number;
  rank: number;
  achievements: number;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    networkSize: 0,
    monthlyCommissions: 0,
    rank: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    cpf: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm({
        full_name: data.full_name || "",
        phone: data.phone || "",
        cpf: data.cpf || ""
      });

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Carregar tamanho da rede
      const { data: network } = await supabase
        .from('profiles')
        .select('id')
        .eq('referrer_id', user?.id);

      // Carregar comissões do mês atual
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: monthlyComms } = await supabase
        .from('commissions')
        .select('amount')
        .eq('recipient_id', user?.id)
        .gte('created_at', `${currentMonth}-01`);

      const monthlyTotal = monthlyComms?.reduce((sum, comm) => sum + comm.amount, 0) || 0;

      setStats({
        networkSize: network?.length || 0,
        monthlyCommissions: monthlyTotal,
        rank: 1, // Placeholder
        achievements: 5 // Placeholder
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          cpf: editForm.cpf
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      loadProfile();

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Senha alterada com sucesso!');
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link de indicação copiado!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'gerente': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inativo': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Perfil não encontrado</h2>
            <p className="text-muted-foreground">
              Não foi possível carregar os dados do seu perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-0 shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {profile.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {profile.full_name || 'Nome não informado'}
                  </h1>
                  <p className="text-muted-foreground text-lg">{user?.email}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge className={getRoleColor(profile.role)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(profile.status)}>
                    <Zap className="h-3 w-3 mr-1" />
                    {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1)}
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    Rank #{stats.rank}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setEditing(!editing)}
                  variant="outline"
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl"
                >
                  {editing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {editing ? 'Cancelar' : 'Editar'}
                </Button>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 hover:bg-red-100"
                >
                  Sair
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profile.total_sales}</p>
                <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">R$ {profile.total_commissions.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Comissões Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.networkSize}</p>
                <p className="text-sm text-muted-foreground">Tamanho da Rede</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.achievements}</p>
                <p className="text-sm text-muted-foreground">Conquistas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={editForm.cpf}
                    onChange={(e) => setEditForm({...editForm, cpf: e.target.value})}
                    className="h-12"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">CPF não pode ser alterado</p>
                </div>
                <Button
                  onClick={handleUpdateProfile}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{profile.full_name || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{profile.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{profile.cpf || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Settings */}
        <div className="space-y-6">
          {/* Referral Link */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Users className="h-5 w-5" />
                Link de Indicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                Compartilhe seu link e ganhe comissões pelas vendas da sua rede
              </p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/register?ref=${user?.id}`}
                  readOnly
                  className="bg-white/70 dark:bg-gray-800/70 font-mono text-sm"
                />
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="h-12 pr-12"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="h-12"
                  placeholder="Confirme a nova senha"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                disabled={!passwordForm.newPassword || !passwordForm.confirmPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;