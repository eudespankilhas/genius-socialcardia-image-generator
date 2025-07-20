"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
import { TemplateSelector } from "@/components/TemplateSelector";
import { HistoryViewer } from "@/components/HistoryViewer";
import { ImageEditor } from "@/components/ImageEditor";
import {
  MODEL_CONFIGS,
  PROVIDERS,
  PROVIDER_ORDER,
  ProviderKey,
  ModelMode,
} from "@/lib/provider-config";
import { Suggestion } from "@/lib/suggestions";
import { Template } from "@/lib/templates";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { imageHistory, GeneratedImage } from "@/lib/history";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  History, 
  Palette, 
  Settings,
  Download,
  Edit3,
  Trash2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProviderInstance {
  id: string;
  providerKey: ProviderKey;
  model: string;
  enabled: boolean;
}

export function ImagePlayground({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
  } = useImageGeneration();

  const [showProviders, setShowProviders] = useState(true);
  const [providerInstances, setProviderInstances] = useState<ProviderInstance[]>(
    PROVIDER_ORDER.flatMap((key) => [
      {
        id: `${key}-1`,
        providerKey: key,
        model: MODEL_CONFIGS.performance[key],
        enabled: true,
      },
      {
        id: `${key}-2`,
        providerKey: key,
        model: MODEL_CONFIGS.quality[key],
        enabled: true,
      },
    ])
  );
  const [mode, setMode] = useState<ModelMode>("performance");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [activeTab, setActiveTab] = useState("generator");

  const toggleView = () => {
    setShowProviders((prev) => !prev);
  };

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setProviderInstances((prev: ProviderInstance[]) =>
      prev.map((instance: ProviderInstance) => ({
        ...instance,
        model: MODEL_CONFIGS[newMode][instance.providerKey],
      }))
    );
    setShowProviders(true);
  };

  const handleModelChange = (instanceId: string, model: string) => {
    setProviderInstances((prev: ProviderInstance[]) =>
      prev.map((instance: ProviderInstance) =>
        instance.id === instanceId ? { ...instance, model } : instance
      )
    );
  };

  const handleProviderToggle = (instanceId: string, enabled: boolean) => {
    setProviderInstances((prev: ProviderInstance[]) =>
      prev.map((instance: ProviderInstance) =>
        instance.id === instanceId ? { ...instance, enabled } : instance
      )
    );
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeInstances = providerInstances.filter((instance) => instance.enabled);
    if (activeInstances.length > 0) {
      const providerInstancesForGeneration = activeInstances.map(instance => ({
        provider: instance.providerKey,
        instanceId: instance.id,
        model: instance.model
      }));
      
      startGeneration(newPrompt, providerInstancesForGeneration);
    }
    setShowProviders(false);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab("generator");
  };

  const handleImageGenerated = (imageData: string, provider: string, modelId: string) => {
    // Save to history
    imageHistory.addImage({
      prompt: activePrompt || "",
      imageData,
      provider,
      modelId,
      template: selectedTemplate?.id,
      tags: selectedTemplate?.tags || [],
      category: selectedTemplate?.category || 'creative',
    });
  };

  const handleEditImage = (image: GeneratedImage) => {
    setEditingImage(image);
  };

  const handleSaveEditedImage = (editedImageData: string) => {
    if (editingImage) {
      // Update the image in history
      const history = imageHistory.getAllImages();
      const updatedHistory = history.map(img => 
        img.id === editingImage.id 
          ? { ...img, imageData: editedImageData }
          : img
      );
      // Note: This would need to be implemented in the history class
      setEditingImage(null);
    }
  };

  const getModelProps = () => {
    return providerInstances.map((instance) => {
      const provider = PROVIDERS[instance.providerKey];
      const imageItem = images.find((img) => 
        img.provider === instance.providerKey && 
        "instanceId" in img && img.instanceId === instance.id
      );
      const imageData = imageItem?.image;
      const modelId = imageItem?.modelId ?? "N/A";
      const timing = timings[instance.id] || {};

      return {
        label: `${provider.displayName} ${instance.id.split('-')[1]}`,
        models: provider.models,
        value: instance.model,
        providerKey: instance.providerKey,
        onChange: (model: string) => handleModelChange(instance.id, model),
        iconPath: provider.iconPath,
        color: provider.color,
        enabled: instance.enabled,
        onToggle: (enabled: boolean) => handleProviderToggle(instance.id, enabled),
        image: imageData,
        modelId,
        timing,
        failed: failedProviders.includes(instance.id),
        onEdit: imageData ? () => handleEditImage({
          id: instance.id,
          prompt: activePrompt || "",
          imageData,
          provider: instance.providerKey,
          modelId,
          timestamp: Date.now(),
          tags: selectedTemplate?.tags || [],
          category: selectedTemplate?.category || 'creative',
        }) : undefined,
      };
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gerador
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              showProviders={showProviders}
              onToggleProviders={toggleView}
              mode={mode}
              onModeChange={handleModeChange}
              suggestions={suggestions}
              selectedTemplate={selectedTemplate}
            />
            
            {selectedTemplate && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Template Selecionado: {selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <>
              {(() => {
                return (
                  <>
                    <div className="md:hidden">
                      <ModelCardCarousel models={getModelProps()} />
                    </div>
                    <div className="hidden md:grid md:grid-cols-2 gap-8">
                      {getModelProps().map((props) => (
                        <ModelSelect key={props.label} {...props} />
                      ))}
                    </div>
                    {activePrompt && activePrompt.length > 0 && (
                      <div className="text-center mt-4 text-muted-foreground">
                        {activePrompt}
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryViewer 
              onImageSelect={handleEditImage}
              onClose={() => setActiveTab("generator")}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Configurações</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Histórico</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setActiveTab("history")}>
                          <History className="w-4 h-4 mr-2" />
                          Ver Histórico
                        </Button>
                        <Button variant="outline" onClick={() => {
                          if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                            imageHistory.clearHistory();
                          }
                        }}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Limpar Histórico
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Exportar</h4>
                      <Button variant="outline" onClick={() => {
                        const data = imageHistory.exportHistory();
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'image-history.json';
                        link.click();
                        URL.revokeObjectURL(url);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Histórico
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{imageHistory.getStats().total}</div>
                      <div className="text-sm text-muted-foreground">Total de Imagens</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{Object.keys(imageHistory.getStats().byCategory).length}</div>
                      <div className="text-sm text-muted-foreground">Categorias Usadas</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{imageHistory.getStats().recentActivity.length}</div>
                      <div className="text-sm text-muted-foreground">Atividade Recente</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Editor Modal */}
      {editingImage && (
        <ImageEditor
          imageData={editingImage.imageData}
          onSave={handleSaveEditedImage}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
}
