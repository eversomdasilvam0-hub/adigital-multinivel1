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
import { User, Mail, Fingerprint, Phone } from "lucide-react";

interface Profile {
  full_name: string;
  cpf: string;
  phone: string;
}

const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("full_name, cpf, phone")
          .eq("id", user.id)
          .single();

        if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = 'exact one row not found'
          console.error("Erro ao buscar o perfil:", dbError);
          throw new Error("Não foi possível carregar os detalhes do perfil.");
        }

        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Suas informações de corretor.</CardDescription>
            </Header>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
            </CardContent>
        </Card>
    )
  }

  if (error) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
            </Header>
            <CardContent>
                <p className="text-destructive">{error}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Suas informações de corretor.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{profile?.full_name || "Nome não informado"}</span>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{user?.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Fingerprint className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{profile?.cpf || "CPF não informado"}</span>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{profile?.phone || "Telefone não informado"}</span>
          </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;