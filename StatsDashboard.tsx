"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Image as ImageIcon, 
  TrendingUp, 
  Clock, 
  Palette,
  Instagram,
  Briefcase,
  Heart,
  Calendar,
  Megaphone
} from "lucide-react";
import { imageHistory } from "@/lib/history";

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  byProvider: Record<string, number>;
  recentActivity: Array<{
    id: string;
    prompt: string;
    timestamp: number;
    category: string;
  }>;
}

const categoryIcons = {
  social: Instagram,
  business: Briefcase,
  creative: Palette,
  marketing: Megaphone,
  personal: Heart,
  event: Calendar,
};

const categoryColors = {
  social: "bg-gradient-to-r from-pink-500 to-purple-500",
  business: "bg-gradient-to-r from-blue-500 to-indigo-500",
  creative: "bg-gradient-to-r from-green-500 to-teal-500",
  marketing: "bg-gradient-to-r from-orange-500 to-red-500",
  personal: "bg-gradient-to-r from-purple-500 to-pink-500",
  event: "bg-gradient-to-r from-yellow-500 to-orange-500",
};

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byCategory: {},
    byProvider: {},
    recentActivity: [],
  });

  useEffect(() => {
    const loadStats = () => {
      const currentStats = imageHistory.getStats();
      setStats(currentStats);
    };

    loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return "Agora";
  };

  const getTopCategory = () => {
    const entries = Object.entries(stats.byCategory);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => a[1] > b[1] ? a : b);
  };

  const topCategory = getTopCategory();

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imagens</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentActivity.length} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Mais Usada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {topCategory ? (
              <>
                <div className="text-2xl font-bold capitalize">{topCategory[0]}</div>
                <p className="text-xs text-muted-foreground">
                  {topCategory[1]} imagens geradas
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Nenhuma imagem ainda</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provedores</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byProvider).length}</div>
            <p className="text-xs text-muted-foreground">
              Provedores utilizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.byCategory).map(([category, count]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const colorClass = categoryColors[category as keyof typeof categoryColors];
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div key={category} className="text-center">
                  <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{category}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{activity.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 