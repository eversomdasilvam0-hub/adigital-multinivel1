import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showSuccess } from '@/utils/toast';

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    showSuccess("Sua conta foi confirmada com sucesso!");
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-fit">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4">Conta Confirmada!</CardTitle>
          <CardDescription>
            Seu e-mail foi verificado com sucesso. Agora você pode entrar na sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLoginRedirect} className="w-full">
            Ir para o Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmation;