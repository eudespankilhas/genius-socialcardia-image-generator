"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  Image as ImageIcon,
  Calendar,
  Tag,
  BarChart3,
  FileText,
  X
} from "lucide-react";
import { imageHistory, GeneratedImage } from "@/lib/history";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryViewerProps {
  onImageSelect?: (image: GeneratedImage) => void;
  onClose?: () => void;
}

export function HistoryViewer({ onImageSelect, onClose }: HistoryViewerProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [stats, setStats] = useState(imageHistory.getStats());

  const categories = [
    { key: "all", label: "Todas", icon: ImageIcon },
    { key: "social", label: "Redes Sociais", icon: ImageIcon },
    { key: "business", label: "Negócios", icon: ImageIcon },
    { key: "creative", label: "Criativo", icon: ImageIcon },
    { key: "marketing", label: "Marketing", icon: ImageIcon },
    { key: "personal", label: "Pessoal", icon: ImageIcon },
    { key: "event", label: "Eventos", icon: ImageIcon },
  ];

  useEffect(() => {
    loadImages();
  }, [activeCategory, searchQuery]);

  const loadImages = () => {
    let filteredImages = imageHistory.getAllImages();

    if (activeCategory !== "all") {
      filteredImages = filteredImages.filter(img => img.category === activeCategory);
    }

    if (searchQuery) {
      filteredImages = imageHistory.searchImages(searchQuery);
    }

    setImages(filteredImages);
    setStats(imageHistory.getStats());
  };

  const handleDeleteImage = (id: string) => {
    imageHistory.deleteImage(id);
    loadImages();
  };

  const handleDownloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.download = `image-${image.id}.png`;
    link.href = image.imageData;
    link.click();
  };

  const handleExportHistory = () => {
    const data = imageHistory.exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      imageHistory.clearHistory();
      loadImages();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Imagens
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportHistory}>
            <FileText className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium capitalize">{category}</span>
                </div>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por prompt ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {images.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma imagem encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative group">
                      <img
                        src={image.imageData}
                        alt={image.prompt}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => onImageSelect?.(image)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadImage(image)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium line-clamp-2 mb-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(image.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {image.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {image.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{image.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
} 