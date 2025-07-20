export interface GeneratedImage {
  id: string;
  prompt: string;
  imageData: string;
  provider: string;
  modelId: string;
  timestamp: number;
  template?: string;
  tags: string[];
  category: 'social' | 'business' | 'creative' | 'marketing' | 'personal' | 'event';
}

class ImageHistory {
  private storageKey = 'image-generator-history';
  private maxHistorySize = 100;

  private getHistory(): GeneratedImage[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  private saveHistory(history: GeneratedImage[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  addImage(image: Omit<GeneratedImage, 'id' | 'timestamp'>): void {
    const history = this.getHistory();
    const newImage: GeneratedImage = {
      ...image,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    // Add to beginning of array
    history.unshift(newImage);

    // Keep only the most recent images
    if (history.length > this.maxHistorySize) {
      history.splice(this.maxHistorySize);
    }

    this.saveHistory(history);
  }

  getAllImages(): GeneratedImage[] {
    return this.getHistory();
  }

  getImagesByCategory(category: GeneratedImage['category']): GeneratedImage[] {
    return this.getHistory().filter(img => img.category === category);
  }

  getImagesByTag(tag: string): GeneratedImage[] {
    return this.getHistory().filter(img => 
      img.tags.some(imgTag => 
        imgTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  searchImages(query: string): GeneratedImage[] {
    const history = this.getHistory();
    const lowerQuery = query.toLowerCase();
    
    return history.filter(img => 
      img.prompt.toLowerCase().includes(lowerQuery) ||
      img.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  deleteImage(id: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter(img => img.id !== id);
    this.saveHistory(filteredHistory);
  }

  clearHistory(): void {
    this.saveHistory([]);
  }

  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  importHistory(jsonData: string): boolean {
    try {
      const history = JSON.parse(jsonData);
      if (Array.isArray(history)) {
        this.saveHistory(history);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing history:', error);
      return false;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getStats() {
    const history = this.getHistory();
    const stats = {
      total: history.length,
      byCategory: {} as Record<GeneratedImage['category'], number>,
      byProvider: {} as Record<string, number>,
      recentActivity: history.slice(0, 10).map(img => ({
        id: img.id,
        prompt: img.prompt,
        timestamp: img.timestamp,
        category: img.category,
      })),
    };

    // Count by category
    history.forEach(img => {
      stats.byCategory[img.category] = (stats.byCategory[img.category] || 0) + 1;
    });

    // Count by provider
    history.forEach(img => {
      stats.byProvider[img.provider] = (stats.byProvider[img.provider] || 0) + 1;
    });

    return stats;
  }
}

export const imageHistory = new ImageHistory(); 