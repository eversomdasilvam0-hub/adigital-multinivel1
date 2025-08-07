import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/dashboard/ProfileCard";
import MyNetworkCard from "@/components/dashboard/MyNetworkCard";
import InviteCard from "@/components/dashboard/InviteCard";
import CommissionsChart from "@/components/dashboard/CommissionsChart";
import { Sparkles, TrendingUp } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Carregando Painel...
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Aguarde enquanto preparamos sua experiência personalizada.
          </p>
        </div>
        <div className="pt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col gap-8">
            <Skeleton className="h-64 w-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
            <Skeleton className="h-48 w-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse delay-150" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <Skeleton className="h-96 w-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse delay-300" />
            <Skeleton className="h-80 w-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse delay-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center space-y-4 animate-in fade-in-0 duration-1000 slide-in-from-top-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
          Bem-vindo ao seu Painel
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
          Gerencie sua rede e acompanhe seus resultados em tempo real com nossa plataforma inteligente.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Sistema online e atualizado</span>
        </div>
      </header>
      
      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-8 animate-in fade-in-0 duration-1000 slide-in-from-left-4 delay-200">
          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <ProfileCard />
          </div>
          <div className="transform transition-all duration-500 hover:scale-[1.02] delay-100">
            <InviteCard />
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-0 duration-1000 slide-in-from-right-4 delay-400">
          <div className="lg:col-span-2 transform transition-all duration-500 hover:scale-[1.01]">
            <CommissionsChart />
          </div>
          <div className="lg:col-span-2 transform transition-all duration-500 hover:scale-[1.01] delay-100">
            <MyNetworkCard />
          </div>
        </div>
      </main>
      
      <div className="animate-in fade-in-0 duration-1000 delay-600">
        <MadeWithLasy />
      </div>
    </div>
  );
};

export default Index;