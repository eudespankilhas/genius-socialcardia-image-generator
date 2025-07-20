# 🎨 **Genius Social Cardia - Gerador de Imagens com IA**

Um gerador de imagens inteligente com sistema de assinatura, templates profissionais e editor integrado.

## ✨ **Funcionalidades Principais**

### 🎯 **Geração de Imagens**
- **Múltiplos modelos de IA** (Fast SDXL, Flux Pro, etc.)
- **Templates profissionais** para cards, flyers e redes sociais
- **Sugestões inteligentes** categorizadas por tipo de conteúdo
- **Editor de imagens integrado** com filtros avançados

### 💰 **Sistema de Assinatura**
- **Plano Gratuito**: 5 imagens/mês, templates básicos
- **Plano Básico**: R$ 19,90/mês - 50 imagens, editor básico
- **Plano Pro**: R$ 39,90/mês - 200 imagens, editor avançado
- **Plano Business**: R$ 99,90/mês - 1000 imagens, white-label

### 📊 **Recursos Avançados**
- **Histórico completo** de imagens geradas
- **Dashboard de estatísticas** em tempo real
- **Sistema de tags** para organização
- **Exportação** em múltiplos formatos
- **Busca inteligente** por categoria e conteúdo

## 🚀 **Deploy na Vercel**

### **1. Preparação do Repositório**

```bash
# Inicializar Git (se ainda não feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Image Generator with Subscription System"

# Criar repositório no GitHub
# 1. Vá para github.com
# 2. Clique em "New repository"
# 3. Nome: geniussocialcardia-image-generator
# 4. Deixe público ou privado
# 5. Não inicialize com README

# Conectar ao repositório remoto
git remote add origin https://github.com/SEU_USUARIO/geniussocialcardia-image-generator.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

### **2. Deploy na Vercel**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Importe o repositório** que você acabou de criar
5. **Configure as variáveis de ambiente**:

```env
# Para usar APIs reais (opcional)
FAL_API_KEY=sua_chave_da_fal_aqui

# Para analytics (opcional)
NEXT_PUBLIC_GA_ID=seu_google_analytics_id
```

6. **Clique em "Deploy"**

### **3. Configuração Pós-Deploy**

Após o deploy, configure:

1. **Domínio personalizado** (opcional)
2. **Analytics** (Google Analytics, Vercel Analytics)
3. **Monitoramento** (Sentry, LogRocket)

## 💳 **Sistema de Pagamentos**

### **Integração com Gateways**

Para implementar pagamentos reais, você pode usar:

1. **Stripe** (Recomendado)
   ```bash
   npm install @stripe/stripe-js stripe
   ```

2. **PayPal**
   ```bash
   npm install @paypal/react-paypal-js
   ```

3. **Mercado Pago** (Brasil)
   ```bash
   npm install mercadopago
   ```

### **Configuração do Stripe**

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
```

## 📈 **Estratégia de Monetização**

### **Modelo Freemium**
- **Gratuito**: Atrai usuários, demonstra valor
- **Pago**: Recursos premium, sem limitações

### **Métricas Importantes**
- **Conversão**: % de usuários gratuitos → pagos
- **Churn**: Taxa de cancelamento
- **LTV**: Valor do cliente ao longo do tempo
- **CAC**: Custo de aquisição de cliente

### **Táticas de Crescimento**
1. **SEO** para tráfego orgânico
2. **Marketing de conteúdo** (blog, tutoriais)
3. **Parcerias** com criadores de conteúdo
4. **Programa de afiliados**
5. **Email marketing** para retenção

## 🛠️ **Desenvolvimento Local**

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar produção local
pnpm start
```

## 📁 **Estrutura do Projeto**

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── ImagePlayground.tsx
│   ├── TemplateSelector.tsx
│   ├── SubscriptionManager.tsx
│   └── ...
├── lib/                  # Utilitários e configurações
│   ├── subscription.ts   # Sistema de assinatura
│   ├── templates.ts      # Templates de imagens
│   ├── history.ts        # Histórico de imagens
│   └── ...
└── public/               # Arquivos estáticos
```

## 🔧 **Configuração de Ambiente**

Crie um arquivo `.env.local`:

```env
# APIs de IA (opcional)
FAL_API_KEY=sua_chave_aqui

# Stripe (para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Database (se usar)
DATABASE_URL=postgresql://...
```

## 📊 **Analytics e Monitoramento**

### **Google Analytics**
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### **Vercel Analytics**
```bash
npm install @vercel/analytics
```

## 🚀 **Próximos Passos**

1. **✅ Deploy na Vercel**
2. **🔗 Configurar domínio personalizado**
3. **💳 Implementar sistema de pagamentos real**
4. **📊 Configurar analytics**
5. **📧 Implementar email marketing**
6. **🔍 Otimizar SEO**
7. **📱 Criar versão mobile**
8. **🤖 Adicionar mais modelos de IA**

## 📞 **Suporte**

- **Email**: suporte@geniussocialcardia.com
- **Discord**: [Link do servidor]
- **Documentação**: [Link da docs]

## 📄 **Licença**

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para criadores de conteúdo**
