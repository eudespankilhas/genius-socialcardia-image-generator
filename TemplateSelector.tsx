"use client";

import { useState } from "react";
import { Template, TEMPLATES, getTemplatesByCategory } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram, 
  Briefcase, 
  Palette, 
  Megaphone, 
  Heart, 
  Calendar,
  Image as ImageIcon,
  Download,
  Copy
} from "lucide-react";

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: Template;
}

const categoryIcons = {
  social: Instagram,
  business: Briefcase,
  creative: Palette,
  marketing: Megaphone,
  personal: Heart,
  event: Calendar,
};

const categoryLabels = {
  social: "Redes Sociais",
  business: "Negócios",
  creative: "Criativo",
  marketing: "Marketing",
  personal: "Pessoal",
  event: "Eventos",
};

export function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<Template['category']>('social');

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect(template);
  };

  const copyTemplatePrompt = (template: Template) => {
    navigator.clipboard.writeText(template.prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">Escolha um Template</h2>
        <p className="text-muted-foreground text-center">
          Selecione um template para começar a criar seu conteúdo visual
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as Template['category'])}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(categoryLabels).map(([categoryKey, label]) => {
          const templates = getTemplatesByCategory(categoryKey as Template['category']);
          
          return (
            <TabsContent key={categoryKey} value={categoryKey}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyTemplatePrompt(template);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Preview Placeholder */}
                        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                          <div className="aspect-square flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.aspectRatio}
                            </Badge>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Dimensions */}
                        <div className="text-xs text-muted-foreground">
                          {template.dimensions.width} × {template.dimensions.height}px
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Template Selecionado: {selectedTemplate.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 