import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy } from "lucide-react";

interface ReferralCardProps {
  userId: string;
  onCopyLink: () => void;
}

const ReferralCard = ({ userId, onCopyLink }: ReferralCardProps) => {
  const referralLink = `${window.location.origin}/register?ref=${userId}`;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Users className="h-5 w-5" />
          Link de Indicação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-green-600 dark:text-green-400">
          Compartilhe seu link e ganhe comissões pelas vendas da sua rede
        </p>
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-white/70 dark:bg-gray-800/70 font-mono text-sm"
          />
          <Button
            onClick={onCopyLink}
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;