import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/dashboard/ProfileCard";
import MyNetworkCard from "@/components/dashboard/MyNetworkCard";
import InviteCard from "@/components/dashboard/InviteCard";
import CommissionsChart from "@/components/dashboard/CommissionsChart";
import { TrendingUp, Sparkles } from "lucide-react";

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Carregando Painel...
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Preparando sua experiência personalizada...
          </p>
        </div>
        <div className="pt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col gap-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Bem-vindo ao seu Painel
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
          Gerencie sua rede e acompanhe seus resultados em tempo real com nossa plataforma inteligente.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Sistema online e atualizado</span>
        </div>
      </header>
      
      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <ProfileCard />
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <InviteCard />
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2 transform hover:scale-102 transition-transform duration-300">
            <CommissionsChart />
          </div>
          <div className="lg:col-span-2 transform hover:scale-102 transition-transform duration-300">
            <MyNetworkCard />
          </div>
        </div>
      </main>
      
      <MadeWithLasy />
    </div>
  );
};

export default Index;