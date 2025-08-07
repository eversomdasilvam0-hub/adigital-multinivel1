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
  const [network, setNetwork] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Esta query busca por perfis que tenham o ID do usuário atual como referenciador.
        // Para isso funcionar, a tabela 'profiles' precisa de uma coluna 'referrer_id'.
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minha Rede</CardTitle>
        <CardDescription>Corretores que você indicou.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : network.length > 0 ? (
          <ul className="space-y-4">
            {network.map((member) => (
              <li key={member.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6/initials/${member.full_name}.svg`} />
                  <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.full_name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            <Users className="mx-auto h-8 w-8 mb-2" />
            <p>Você ainda não indicou nenhum corretor.</p>
            <p>Use seu link de convite para começar!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyNetworkCard;