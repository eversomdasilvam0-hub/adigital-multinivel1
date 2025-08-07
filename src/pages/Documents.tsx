import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Camera,
  Trash2,
  Download,
  Eye,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas arquivos JPEG, JPG e PNG são permitidos');
      return;
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user?.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type
        });

      if (dbError) throw dbError;

      toast.success('Documento enviado com sucesso!');
      loadDocuments();

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    try {
      // Deletar do storage
      const fileName = doc.file_url.split('/').pop();
      await supabase.storage
        .from('documents')
        .remove([`${user?.id}/${fileName}`]);

      // Deletar do banco
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;

      toast.success('Documento removido com sucesso!');
      loadDocuments();

    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover documento');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Meus Documentos
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Gerencie seus documentos de forma segura e organizada
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload de Arquivo</h3>
            <p className="text-muted-foreground mb-6">
              Selecione arquivos JPEG, JPG ou PNG (máx. 5MB)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              {uploading ? 'Enviando...' : 'Escolher Arquivo'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Usar Câmera</h3>
            <p className="text-muted-foreground mb-6">
              Tire uma foto diretamente do seu dispositivo
            </p>
            <Button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploading ? 'Enviando...' : 'Abrir Câmera'}
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Documentos Enviados</h2>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {documents.length} documento{documents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <Card 
                key={doc.id}
                className="group overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
                  {doc.file_type.startsWith('image/') ? (
                    <img 
                      src={doc.file_url} 
                      alt={doc.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center">
                      {getFileIcon(doc.file_type)}
                      <p className="text-sm text-muted-foreground mt-2">Documento</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enviado
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold truncate" title={doc.file_name}>
                      {doc.file_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc.file_url, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.file_url;
                        link.download = doc.file_name;
                        link.click();
                      }}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(doc)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Nenhum documento enviado</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Comece enviando seus primeiros documentos
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Arquivo
              </Button>
              <Button 
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Usar Câmera
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Informações Importantes
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Apenas arquivos JPEG, JPG e PNG são aceitos</li>
                <li>• Tamanho máximo por arquivo: 5MB</li>
                <li>• Seus documentos são armazenados com segurança</li>
                <li>• Você pode visualizar e baixar seus documentos a qualquer momento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;