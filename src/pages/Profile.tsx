import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";

// Componentes modulares
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ReferralCard from "@/components/profile/ReferralCard";
import PasswordCard from "@/components/profile/PasswordCard";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

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
    rank: 1,
    achievements: 5
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    cpf: ""
  });
  const [passwordForm, setPasswordForm] = useState({
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
        rank: 1,
        achievements: 5
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

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Profile not found state
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
      <ProfileHeader
        profile={profile}
        userEmail={user?.email || ''}
        rank={stats.rank}
        editing={editing}
        onEditToggle={handleEditToggle}
        onSignOut={signOut}
      />

      {/* Stats Cards */}
      <ProfileStats
        totalSales={profile.total_sales}
        totalCommissions={profile.total_commissions}
        networkSize={stats.networkSize}
        achievements={stats.achievements}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <ProfileInfo
          profile={profile}
          userEmail={user?.email || ''}
          editing={editing}
          editForm={editForm}
          onFormChange={handleEditFormChange}
          onSave={handleUpdateProfile}
        />

        {/* Security & Settings */}
        <div className="space-y-6">
          {/* Referral Link */}
          <ReferralCard
            userId={user?.id || ''}
            onCopyLink={copyReferralLink}
          />

          {/* Change Password */}
          <PasswordCard
            passwordForm={passwordForm}
            onFormChange={handlePasswordFormChange}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;