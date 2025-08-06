import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <Button onClick={handleLogout} variant="outline">Sair</Button>
      </div>
      <p className="text-lg">
        Bem-vindo, {user?.email}!
      </p>
      <p className="mt-4">Em breve, este painel terá gráficos, estatísticas e muito mais!</p>
    </div>
  );
};

export default Dashboard;