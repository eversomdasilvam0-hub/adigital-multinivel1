import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Play, 
  Clock, 
  Star,
  Search,
  BookOpen,
  Award,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  views: number;
  rating: number;
}

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);

  const trainingVideos: TrainingVideo[] = [
    {
      id: "1",
      title: "Fundamentos do Marketing Imobiliário",
      description: "Aprenda os conceitos básicos para começar sua carreira no mercado imobiliário com estratégias comprovadas.",
      youtubeId: "dQw4w9WgXcQ",
      duration: "15:30",
      category: "Fundamentos",
      level: "Iniciante",
      views: 1250,
      rating: 4.8
    },
    {
      id: "2",
      title: "Técnicas de Vendas Avançadas",
      description: "Domine as técnicas mais eficazes para fechar vendas e aumentar suas comissões significativamente.",
      youtubeId: "dQw4w9WgXcQ",
      duration: "22:45",
      category: "Vendas",
      level: "Avançado",
      views: 890,
      rating: 4.9
    },
    {
      id: "3",
      title: "Construindo sua Rede de Indicações",
      description: "Estratégias para expandir sua rede e maximizar o potencial do marketing multinível.",
      youtubeId: "dQw4w9WgXcQ",
      duration: "18:20",
      category: "Networking",
      level: "Intermediário",
      views: 2100,
      rating: 4.7
    },
    {
      id: "4",
      title: "Negociação Imobiliária Profissional",
      description: "Técnicas avançadas de negociação para conseguir os melhores resultados em suas vendas.",
      youtubeId: "dQw4w9WgXcQ",
      duration: "25:10",
      category: "Negociação",
      level: "Avançado",
      views: 756,
      rating: 4.6
    },
    {
      id: "5",
      title: "Marketing Digital para Corretores",
      description: "Como usar as redes sociais e marketing digital para atrair mais clientes.",
      youtubeId: "dQw4w9WgXcQ",
      duration: "20:15",
      category: "Marketing",
      level: "Intermediário",
      views: 1580,
      rating: 4.8
    }
  ];

  const categories = ["Todos", "Fundamentos", "Vendas", "Networking", "Negociação", "Marketing"];

  const filteredVideos = trainingVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avançado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fundamentos': return <BookOpen className="h-4 w-4" />;
      case 'Vendas': return <TrendingUp className="h-4 w-4" />;
      case 'Networking': return <Users className="h-4 w-4" />;
      case 'Negociação': return <Award className="h-4 w-4" />;
      case 'Marketing': return <Zap className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Centro de Treinamento
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Desenvolva suas habilidades com nossos cursos exclusivos e torne-se um corretor de elite
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{trainingVideos.length}</p>
              <p className="text-white/80">Vídeos</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/80">Horas</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">4.8</p>
              <p className="text-white/80">Avaliação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar treinamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`h-12 px-6 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:scale-105 hover:shadow-lg'
              }`}
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video, index) => (
          <Card 
            key={video.id} 
            className="group overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="relative overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-black/40"></div>
                <Button
                  onClick={() => setSelectedVideo(video)}
                  size="lg"
                  className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/30 hover:scale-110 transition-all duration-300"
                >
                  <Play className="h-6 w-6 text-white ml-1" />
                </Button>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">{video.duration}</span>
                </div>
              </div>
            </div>
            
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getLevelColor(video.level)}>
                  {video.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{video.rating}</span>
                </div>
              </div>
              <CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors duration-300">
                {video.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(video.category)}
                  <span>{video.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{video.views} visualizações</span>
                </div>
              </div>
              <Button 
                onClick={() => setSelectedVideo(video)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="h-4 w-4 mr-2" />
                Assistir Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Nenhum treinamento encontrado</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Tente ajustar seus filtros ou termo de busca
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedVideo(null)}
                  className="rounded-full"
                >
                  Fechar
                </Button>
              </div>
              <p className="text-muted-foreground">{selectedVideo.description}</p>
              <div className="flex items-center gap-4">
                <Badge className={getLevelColor(selectedVideo.level)}>
                  {selectedVideo.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{selectedVideo.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;