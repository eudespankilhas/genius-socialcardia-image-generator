"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  RotateCcw, 
  Download, 
  Image as ImageIcon,
  Palette,
  Sun,
  Contrast,
  Zap,
  Undo,
  Redo
} from "lucide-react";

interface ImageEditorProps {
  imageData: string;
  onSave: (editedImageData: string) => void;
  onClose: () => void;
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  hue: number;
}

export function ImageEditor({ imageData, onSave, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    hue: 0,
  });
  const [history, setHistory] = useState<ImageFilters[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (newFilters: ImageFilters) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFilters);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFilters(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFilters(history[newIndex]);
    }
  };

  const resetFilters = () => {
    const defaultFilters: ImageFilters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      hue: 0,
    };
    setFilters(defaultFilters);
    addToHistory(defaultFilters);
  };

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create image element
    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filters
      ctx.filter = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px) 
        sepia(${filters.sepia}%) 
        hue-rotate(${filters.hue}deg)
      `;

      // Draw image
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  };

  const handleFilterChange = (filter: keyof ImageFilters, value: number) => {
    const newFilters = { ...filters, [filter]: value };
    setFilters(newFilters);
    addToHistory(newFilters);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedImageData = canvas.toDataURL();
    onSave(editedImageData);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, imageData]);

  useEffect(() => {
    // Initialize history with default filters
    addToHistory(filters);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Editor de Imagem
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadImage}>
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={saveImage}>
              Salvar
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex gap-4 overflow-hidden">
          {/* Image Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>

          {/* Controls */}
          <div className="w-80 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Brilho
                </Label>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={([value]) => handleFilterChange('brightness', value)}
                  max={200}
                  min={0}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  Contraste
                </Label>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={([value]) => handleFilterChange('contrast', value)}
                  max={200}
                  min={0}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Saturação
                </Label>
                <Slider
                  value={[filters.saturation]}
                  onValueChange={([value]) => handleFilterChange('saturation', value)}
                  max={200}
                  min={0}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Desfoque
                </Label>
                <Slider
                  value={[filters.blur]}
                  onValueChange={([value]) => handleFilterChange('blur', value)}
                  max={10}
                  min={0}
                  step={0.1}
                />
                <span className="text-xs text-muted-foreground">{filters.blur}px</span>
              </div>

              <div className="space-y-2">
                <Label>Sepia</Label>
                <Slider
                  value={[filters.sepia]}
                  onValueChange={([value]) => handleFilterChange('sepia', value)}
                  max={100}
                  min={0}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{filters.sepia}%</span>
              </div>

              <div className="space-y-2">
                <Label>Matiz</Label>
                <Slider
                  value={[filters.hue]}
                  onValueChange={([value]) => handleFilterChange('hue', value)}
                  max={360}
                  min={0}
                  step={1}
                />
                <span className="text-xs text-muted-foreground">{filters.hue}°</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 