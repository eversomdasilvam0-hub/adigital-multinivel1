import { Button } from "@/components/ui/button";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-5xl font-bold mb-4">Plataforma Imobiliária</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Junte-se à nossa rede de corretores, realize vendas e ganhe comissões. A oportunidade que você esperava está aqui.
        </p>
        <div className="flex gap-4 mt-4">
          <Button asChild size="lg">
            <Link to="/login">Fazer Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/register">Cadastrar-se</Link>
          </Button>
        </div>
      </main>
      <div className="absolute bottom-4">
        <MadeWithLasy />
      </div>
    </div>
  );
};

export default Index;