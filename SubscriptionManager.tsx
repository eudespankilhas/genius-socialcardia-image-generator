"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Star,
  TrendingUp,
  Calendar,
  CreditCard
} from "lucide-react";
import { 
  SUBSCRIPTION_PLANS, 
  subscriptionManager, 
  SubscriptionPlan 
} from "@/lib/subscription";

export function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[0]);
  const [usageStats, setUsageStats] = useState(subscriptionManager.getUsageStats());

  useEffect(() => {
    setCurrentPlan(subscriptionManager.getCurrentPlan());
    setUsageStats(subscriptionManager.getUsageStats());
  }, []);

  const handleUpgrade = (planId: string) => {
    // Simulate payment process
    if (confirm(`Deseja fazer upgrade para o plano ${SUBSCRIPTION_PLANS.find(p => p.id === planId)?.name}?`)) {
      subscriptionManager.upgradePlan(planId);
      setCurrentPlan(subscriptionManager.getCurrentPlan());
      setUsageStats(subscriptionManager.getUsageStats());
    }
  };

  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      subscriptionManager.cancelSubscription();
      setCurrentPlan(subscriptionManager.getCurrentPlan());
      setUsageStats(subscriptionManager.getUsageStats());
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Seu Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
              <p className="text-muted-foreground">
                {currentPlan.price === 0 ? 'Gratuito' : `R$ ${currentPlan.price}/${currentPlan.interval}`}
              </p>
            </div>
            <Badge variant={currentPlan.id === 'free' ? 'secondary' : 'default'}>
              {currentPlan.id === 'free' ? 'Gratuito' : 'Ativo'}
            </Badge>
          </div>

          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Imagens geradas este mês</span>
              <span>{usageStats.imagesUsed} / {usageStats.imagesLimit === -1 ? '∞' : usageStats.imagesLimit}</span>
            </div>
            <Progress value={usageStats.percentageUsed} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Reset em {usageStats.daysUntilReset} dias
            </p>
          </div>

          {!usageStats.canGenerate && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Você atingiu o limite do seu plano. Faça upgrade para continuar gerando imagens.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan.id;
          const isPopular = plan.id === 'pro';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${isPopular ? 'border-primary' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2">
                  {plan.id === 'free' && <Zap className="w-4 h-4" />}
                  {plan.id === 'basic' && <TrendingUp className="w-4 h-4" />}
                  {plan.id === 'pro' && <Crown className="w-4 h-4" />}
                  {plan.id === 'business' && <Star className="w-4 h-4" />}
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plano Atual
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade(plan.id)}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      {plan.id === 'free' ? 'Voltar ao Gratuito' : 'Fazer Upgrade'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="w-8 h-5 bg-blue-600 rounded"></div>
              <span className="text-sm">Cartão de Crédito</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="w-8 h-5 bg-green-600 rounded"></div>
              <span className="text-sm">PIX</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="w-8 h-5 bg-orange-600 rounded"></div>
              <span className="text-sm">Boleto</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="w-8 h-5 bg-purple-600 rounded"></div>
              <span className="text-sm">PayPal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      {currentPlan.id !== 'free' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Cancelar Assinatura</h3>
                <p className="text-sm text-muted-foreground">
                  Sua assinatura continuará ativa até o final do período atual
                </p>
              </div>
              <Button variant="destructive" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 