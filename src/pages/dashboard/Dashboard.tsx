import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <Button onClick={logout} variant="outline">Sair</Button>
      </header>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo(a), {user?.user_metadata?.full_name || user?.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Este é o seu painel. Em breve, você verá seus gráficos, estatísticas e muito mais aqui.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;