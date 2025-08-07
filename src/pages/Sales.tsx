import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Search,
  Building,
  User
} from "lucide-react";
import { toast } from "sonner";

interface Sale {
  id: string;
  property_name: string;
  sale_date: string;
  commission_amount: number;
  created_at: string;
  seller: {
    full_name: string;
    email: string;
  };
}

interface Commission {
  id: string;
  amount: number;
  generation: number;
  created_at: string;
  sale: {
    property_name: string;
    sale_date: string;
    seller: {
      full_name: string;
    };
  };
}

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'sales' | 'commissions'>('sales');

  useEffect(() => {
    if (user) {
      loadSalesData();
    }
  }, [user]);

  const loadSalesData = async () => {
    try {
      // Carregar vendas da rede
      const { data: salesData } = await supabase
        .from('sales')
        .select(`
          *,
          profiles:seller_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      // Carregar comissões do usuário
      const { data: commissionsData } = await supabase
        .from('commissions')
        .select(`
          *,
          sales:sale_id (
            property_name,
            sale_date,
            profiles:seller_id (full_name)
          )
        `)
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false });

      setSales(salesData?.map(sale => ({
        ...sale,
        seller: sale.profiles
      })) || []);

      setCommissions(commissionsData?.map(commission => ({
        ...commission,
        sale: {
          ...commission.sales,
          seller: commission.sales?.profiles
        }
      })) || []);

    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      toast.error('Erro ao carregar dados de vendas');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissions = commissions.filter(commission =>
    commission.sale?.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.sale?.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommissions = commissions.reduce((sum,  comm) => sum + comm.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Carregando dados de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Vendas e Comissões
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe as vendas da sua rede e suas comissões
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">R$ {totalCommissions.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Minhas Comissões</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{commissions.length}</p>
                <p className="text-sm text-muted-foreground">Comissões Recebidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'sales'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Vendas da Rede
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'commissions'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Minhas Comissões
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por imóvel ou corretor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {activeTab === 'sales' ? (
        <div className="space-y-4">
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <Card key={sale.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{sale.property_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Vendido por: {sale.seller?.full_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(sale.sale_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {sale.commission_amount.toFixed(2)}
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">
                        Comissão
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma venda encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar sua busca' : 'As vendas da sua rede aparecerão aqui'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCommissions.length > 0 ? (
            filteredCommissions.map((commission) => (
              <Card key={commission.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{commission.sale?.property_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Vendido por: {commission.sale?.seller?.full_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(commission.sale?.sale_date || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        R$ {commission.amount.toFixed(2)}
                      </p>
                      <Badge className={`${
                        commission.generation === 1 ? 'bg-yellow-100 text-yellow-800' :
                        commission.generation === 2 ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {commission.generation}ª Geração
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma comissão encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Suas comissões aparecerão aqui quando sua rede fizer vendas'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;