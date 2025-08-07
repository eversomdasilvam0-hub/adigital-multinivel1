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
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Sale {
  id: string;
  property_name: string;
  sale_date: string;
  commission_amount: number;
  seller_id: string;
  created_at: string;
  seller: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface AdminStats {
  totalUsers: number;
  totalSales: number;
  totalCommissions: number;
  monthlyGrowth: number;
}

const Admin = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSales: 0,
    totalCommissions: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSale, setNewSale] = useState({
    seller_email: "",
    property_name: "",
    sale_date: "",
    commission_amount: 100
  });

  // Verificar se é admin
  const isAdmin = user?.email === "everson@memorialconstrutora.com.br";

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    }
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    try {
      // Carregar vendas com dados do vendedor
      const { data: salesData } = await supabase
        .from('sales')
        .select(`
          *,
          profiles:seller_id (full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      // Carregar estatísticas
      const { data: usersCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { data: salesCount } = await supabase
        .from('sales')
        .select('id', { count: 'exact', head: true });

      const { data: commissionsSum } = await supabase
        .from('commissions')
        .select('amount');

      const totalCommissions = commissionsSum?.reduce((sum, comm) => sum + comm.amount, 0) || 0;

      setSales(salesData?.map(sale => ({
        ...sale,
        seller: sale.profiles
      })) || []);

      setStats({
        totalUsers: usersCount?.length || 0,
        totalSales: salesCount?.length || 0,
        totalCommissions,
        monthlyGrowth: 15 // Placeholder
      });

    } catch (error) {
      console.error('Erro ao carregar dados admin:', error);
      toast.error('Erro ao carregar dados administrativos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async () => {
    try {
      // Buscar vendedor pelo email
      const { data: seller } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newSale.seller_email)
        .single();

      if (!seller) {
        toast.error('Vendedor não encontrado com este email');
        return;
      }

      // Criar venda
      const { error } = await supabase
        .from('sales')
        .insert({
          seller_id: seller.id,
          property_name: newSale.property_name,
          sale_date: newSale.sale_date,
          commission_amount: newSale.commission_amount,
          created_by: user?.id
        });

      if (error) throw error;

      toast.success('Venda adicionada com sucesso!');
      setShowAddForm(false);
      setNewSale({
        seller_email: "",
        property_name: "",
        sale_date: "",
        commission_amount: 100
      });
      loadAdminData();

    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      toast.error('Erro ao adicionar venda');
    }
  };

  const handleUpdateSale = async () => {
    if (!editingSale) return;

    try {
      const { error } = await supabase
        .from('sales')
        .update({
          property_name: editingSale.property_name,
          sale_date: editingSale.sale_date,
          commission_amount: editingSale.commission_amount
        })
        .eq('id', editingSale.id);

      if (error) throw error;

      toast.success('Venda atualizada com sucesso!');
      setEditingSale(null);
      loadAdminData();

    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast.error('Erro ao atualizar venda');
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (error) throw error;

      toast.success('Venda excluída com sucesso!');
      loadAdminData();

    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast.error('Erro ao excluir venda');
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Imóvel', 'Vendedor', 'Email', 'Data', 'Comissão'],
      ...sales.map(sale => [
        sale.property_name,
        sale.seller?.full_name || 'N/A',
        sale.seller?.email || 'N/A',
        new Date(sale.sale_date).toLocaleDateString('pt-BR'),
        `R$ ${sale.commission_amount.toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSales = sales.filter(sale =>
    sale.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.seller?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border-red-200/50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Acesso Negado
            </h2>
            <p className="text-red-600 dark:text-red-300">
              Você não tem permissão para acessar esta área.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Painel Administrativo
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Controle total sobre vendas, comissões e performance da rede
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Sistema Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Corretores Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{stats.totalSales}</p>
                <p className="text-sm text-muted-foreground">Vendas Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">R$ {stats.totalCommissions.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Comissões Pagas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">+{stats.monthlyGrowth}%</p>
                <p className="text-sm text-muted-foreground">Crescimento Mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg"
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={exportData}
            variant="outline"
            className="h-12 px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Nova Venda
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="seller_email">Email do Vendedor</Label>
                <Input
                  id="seller_email"
                  type="email"
                  placeholder="vendedor@email.com"
                  value={newSale.seller_email}
                  onChange={(e) => setNewSale({...newSale, seller_email: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property_name">Nome do Imóvel</Label>
                <Input
                  id="property_name"
                  placeholder="Ex: Apartamento Vista Mar"
                  value={newSale.property_name}
                  onChange={(e) => setNewSale({...newSale, property_name: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale_date">Data da Venda</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={newSale.sale_date}
                  onChange={(e) => setNewSale({...newSale, sale_date: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission_amount">Valor da Comissão (R$)</Label>
                <Input
                  id="commission_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSale.commission_amount}
                  onChange={(e) => setNewSale({...newSale, commission_amount: parseFloat(e.target.value) || 0})}
                  className="h-12"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddSale}
                className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Venda
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Table */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Gerenciamento de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length > 0 ? (
            <div className="space-y-4">
              {filteredSales.map((sale, index) => (
                <Card 
                  key={sale.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <CardContent className="p-6">
                    {editingSale?.id === sale.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Nome do Imóvel</Label>
                            <Input
                              value={editingSale.property_name}
                              onChange={(e) => setEditingSale({...editingSale, property_name: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Data da Venda</Label>
                            <Input
                              type="date"
                              value={editingSale.sale_date}
                              onChange={(e) => setEditingSale({...editingSale, sale_date: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Comissão (R$)</Label>
                            <Input
                              type="number"
                              value={editingSale.commission_amount}
                              onChange={(e) => setEditingSale({...editingSale, commission_amount: parseFloat(e.target.value) || 0})}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSale(null)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateSale}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Building className="h-8 w-8 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold">{sale.property_name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{sale.seller?.full_name || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{sale.seller?.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(sale.sale_date).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              R$ {sale.commission_amount.toFixed(2)}
                            </p>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Comissão
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSale(sale)}
                              className="hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSale(sale.id)}
                              className="hover:bg-red-50 hover:border-red-200 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nenhuma venda encontrada</h3>
              <p className="text-muted-foreground text-lg mb-6">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando a primeira venda'}
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Venda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;