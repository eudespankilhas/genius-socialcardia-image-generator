export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    imagesPerMonth: number;
    maxResolution: string;
    templates: string[];
    editorAccess: boolean;
    watermark: boolean;
    historyDays: number;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  usage: {
    imagesGenerated: number;
    imagesThisMonth: number;
    lastResetDate: Date;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    features: [
      '5 imagens por mês',
      'Templates básicos',
      'Resolução padrão',
      'Com marca d\'água'
    ],
    limits: {
      imagesPerMonth: 5,
      maxResolution: '1024x1024',
      templates: ['social-card-1', 'social-card-2'],
      editorAccess: false,
      watermark: true,
      historyDays: 7,
      apiAccess: false,
      prioritySupport: false,
    }
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 19.90,
    currency: 'BRL',
    interval: 'month',
    features: [
      '50 imagens por mês',
      'Todos os templates',
      'Alta resolução',
      'Editor básico',
      'Sem marca d\'água',
      'Histórico de 30 dias'
    ],
    limits: {
      imagesPerMonth: 50,
      maxResolution: '2048x2048',
      templates: ['social-card-1', 'social-card-2', 'social-card-3', 'flyer-1', 'flyer-2'],
      editorAccess: true,
      watermark: false,
      historyDays: 30,
      apiAccess: false,
      prioritySupport: false,
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39.90,
    currency: 'BRL',
    interval: 'month',
    features: [
      '200 imagens por mês',
      'Templates exclusivos',
      'Máxima resolução',
      'Editor avançado',
      'Histórico ilimitado',
      'Exportação múltipla',
      'API access'
    ],
    limits: {
      imagesPerMonth: 200,
      maxResolution: '4096x4096',
      templates: ['*'], // All templates
      editorAccess: true,
      watermark: false,
      historyDays: -1, // Unlimited
      apiAccess: true,
      prioritySupport: false,
    }
  },
  {
    id: 'business',
    name: 'Business',
    price: 99.90,
    currency: 'BRL',
    interval: 'month',
    features: [
      '1000 imagens por mês',
      'Templates personalizados',
      'Prioridade no suporte',
      'White-label',
      'Integração APIs',
      'Relatórios avançados'
    ],
    limits: {
      imagesPerMonth: 1000,
      maxResolution: '4096x4096',
      templates: ['*'], // All templates
      editorAccess: true,
      watermark: false,
      historyDays: -1, // Unlimited
      apiAccess: true,
      prioritySupport: true,
    }
  }
];

export class SubscriptionManager {
  private storageKey = 'user-subscription';
  private usageKey = 'usage-stats';

  getCurrentPlan(): SubscriptionPlan {
    const subscription = this.getUserSubscription();
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.planId) || SUBSCRIPTION_PLANS[0];
  }

  getUserSubscription(): UserSubscription {
    if (typeof window === 'undefined') {
      return this.getDefaultSubscription();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          startDate: new Date(parsed.startDate),
          endDate: new Date(parsed.endDate),
          usage: {
            ...parsed.usage,
            lastResetDate: new Date(parsed.usage.lastResetDate),
          }
        };
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }

    return this.getDefaultSubscription();
  }

  private getDefaultSubscription(): UserSubscription {
    return {
      planId: 'free',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usage: {
        imagesGenerated: 0,
        imagesThisMonth: 0,
        lastResetDate: new Date(),
      }
    };
  }

  canGenerateImage(): boolean {
    const subscription = this.getUserSubscription();
    const plan = this.getCurrentPlan();
    
    // Check if subscription is active
    if (subscription.status !== 'active' || new Date() > subscription.endDate) {
      return false;
    }

    // Check monthly limit
    if (plan.limits.imagesPerMonth > 0 && subscription.usage.imagesThisMonth >= plan.limits.imagesPerMonth) {
      return false;
    }

    return true;
  }

  recordImageGeneration(): void {
    const subscription = this.getUserSubscription();
    const now = new Date();
    
    // Reset monthly count if it's a new month
    if (now.getMonth() !== subscription.usage.lastResetDate.getMonth() || 
        now.getFullYear() !== subscription.usage.lastResetDate.getFullYear()) {
      subscription.usage.imagesThisMonth = 0;
      subscription.usage.lastResetDate = now;
    }

    subscription.usage.imagesGenerated++;
    subscription.usage.imagesThisMonth++;

    this.saveUserSubscription(subscription);
  }

  getUsageStats() {
    const subscription = this.getUserSubscription();
    const plan = this.getCurrentPlan();
    
    return {
      plan: plan.name,
      imagesUsed: subscription.usage.imagesThisMonth,
      imagesLimit: plan.limits.imagesPerMonth,
      percentageUsed: plan.limits.imagesPerMonth > 0 
        ? Math.round((subscription.usage.imagesThisMonth / plan.limits.imagesPerMonth) * 100)
        : 0,
      canGenerate: this.canGenerateImage(),
      daysUntilReset: this.getDaysUntilReset(),
    };
  }

  private getDaysUntilReset(): number {
    const subscription = this.getUserSubscription();
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextMonth.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private saveUserSubscription(subscription: UserSubscription): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(subscription));
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  upgradePlan(planId: string): void {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const subscription = this.getUserSubscription();
    subscription.planId = planId;
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    subscription.status = 'active';

    this.saveUserSubscription(subscription);
  }

  cancelSubscription(): void {
    const subscription = this.getUserSubscription();
    subscription.status = 'cancelled';
    this.saveUserSubscription(subscription);
  }
}

export const subscriptionManager = new SubscriptionManager(); 