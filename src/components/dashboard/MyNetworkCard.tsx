import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface ReferredUser {
  id: string;
  full_name: string;
  email: string;
}

const MyNetworkCard = () => {
  const { user } = useAuth();
  // const [network, setNetwork] = useState<ReferredUser[]>([]);
  // const [loading, setLoading] = useState(true);

  /*
  // TEMPORARIAMENTE DESATIVADO PARA DEBUG
  useEffect(() => {
    const fetchNetwork = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("referrer_id", user.id);

        if (error) {
          console.error("Erro ao buscar a rede:", error.message);
        } else if (data) {
          setNetwork(data);
        }
      } catch (err: any) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [user]);
  */

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minha Rede</CardTitle>
        <CardDescription>Corretores que você indicou.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground py-8">
          <Users className="mx-auto h-8 w-8 mb-2" />
          <p>As informações da sua rede aparecerão aqui.</p>
          <p>(Busca de dados temporariamente desativada)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyNetworkCard;