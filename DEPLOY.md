# 🚀 **Guia Rápido de Deploy - Genius Social Cardia**

## ⚡ **Deploy em 5 Minutos**

### **1. Preparar o Repositório**

```bash
# No terminal, na pasta do projeto
git init
git add .
git commit -m "Initial commit: Image Generator with Subscription System"
```

### **2. Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `geniussocialcardia-image-generator`
4. Descrição: `Gerador de imagens com IA e sistema de assinatura`
5. Deixe **público** (para deploy gratuito na Vercel)
6. **NÃO** inicialize com README
7. Clique em **"Create repository"**

### **3. Conectar ao GitHub**

```bash
git remote add origin https://github.com/SEU_USUARIO/geniussocialcardia-image-generator.git
git branch -M main
git push -u origin main
```

### **4. Deploy na Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta **GitHub**
3. Clique em **"New Project"**
4. **Importe** o repositório que você criou
5. Clique em **"Deploy"**

### **5. Configurar Variáveis de Ambiente (Opcional)**

Na Vercel, vá em **Settings > Environment Variables**:

```env
# Para usar APIs reais (opcional)
FAL_API_KEY=sua_chave_da_fal_aqui

# Para analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🎯 **Próximos Passos Após o Deploy**

### **1. Configurar Domínio Personalizado**
- Na Vercel: **Settings > Domains**
- Adicione seu domínio personalizado

### **2. Implementar Pagamentos**
```bash
# Instalar Stripe
npm install @stripe/stripe-js stripe

# Configurar variáveis
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **3. Configurar Analytics**
```bash
# Google Analytics
npm install @next/third-parties

# Vercel Analytics
npm install @vercel/analytics
```

## 📊 **Monitoramento**

### **Vercel Dashboard**
- Acesse o dashboard da Vercel
- Monitore performance, erros e uso

### **Google Analytics**
- Configure para rastrear conversões
- Monitore comportamento dos usuários

## 🔧 **Comandos Úteis**

```bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Listar projetos
vercel ls

# Configurar projeto
vercel link
```

## 🚨 **Troubleshooting**

### **Erro de Build**
```bash
# Testar build local
npm run build

# Verificar dependências
npm install
```

### **Erro de API**
- Verificar variáveis de ambiente
- Verificar logs na Vercel
- Testar endpoint localmente

### **Problemas de Performance**
- Otimizar imagens
- Implementar cache
- Usar CDN

## 📈 **Métricas de Sucesso**

Após o deploy, monitore:

- **Visitas**: Quantos usuários acessam
- **Conversões**: % que fazem upgrade
- **Retenção**: Usuários que voltam
- **Performance**: Velocidade de carregamento

## 🎉 **Parabéns!**

Seu gerador de imagens está no ar! Agora você pode:

1. **Compartilhar** o link com amigos
2. **Testar** todas as funcionalidades
3. **Implementar** pagamentos reais
4. **Otimizar** baseado no feedback
5. **Escalar** conforme cresce

---

**Precisa de ajuda?** Abra uma issue no GitHub ou entre em contato! 