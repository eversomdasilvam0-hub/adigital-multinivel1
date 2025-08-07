import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { Label } from "../ui/label";

const InviteCard = () => {
  const { user } = useAuth();
  
  // O link de referência aponta para a página de cadastro com o ID do usuário como parâmetro.
  const referralLink = user 
    ? `${window.location.origin}/register?ref=${user.id}` 
    : "";

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      showSuccess("Link de convite copiado!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar Corretor</CardTitle>
        <CardDescription>
          Compartilhe este link para adicionar corretores à sua rede.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
            <Label htmlFor="referral-link">Seu link de convite</Label>
            <div className="flex gap-2">
                <Input id="referral-link" value={referralLink} readOnly />
                <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!user}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;