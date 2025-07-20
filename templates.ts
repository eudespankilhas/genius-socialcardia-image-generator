export interface Template {
  id: string;
  name: string;
  category: 'card' | 'flyer' | 'social' | 'business' | 'creative';
  description: string;
  prompt: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  tags: string[];
  preview: string;
}

export const TEMPLATES: Template[] = [
  // Cards de Redes Sociais
  {
    id: 'social-card-1',
    name: 'Card de Produto',
    category: 'social',
    description: 'Card elegante para apresentar produtos',
    prompt: 'A modern product card with clean design, white background, product showcase, elegant typography, social media ready, minimalist style',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    tags: ['produto', 'elegante', 'minimalista'],
    preview: '/templates/social-card-1.png'
  },
  {
    id: 'social-card-2',
    name: 'Card Motivacional',
    category: 'social',
    description: 'Card inspirador para motivar seguidores',
    prompt: 'Inspirational quote card with gradient background, modern typography, motivational message, social media design, vibrant colors',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    tags: ['motivacional', 'inspirador', 'gradiente'],
    preview: '/templates/social-card-2.png'
  },
  {
    id: 'social-card-3',
    name: 'Card de Evento',
    category: 'social',
    description: 'Card para divulgar eventos',
    prompt: 'Event announcement card with calendar elements, modern design, event details, professional layout, social media optimized',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    tags: ['evento', 'calendário', 'profissional'],
    preview: '/templates/social-card-3.png'
  },

  // Flyers
  {
    id: 'flyer-1',
    name: 'Flyer Promocional',
    category: 'flyer',
    description: 'Flyer para promoções e ofertas',
    prompt: 'Promotional flyer with discount elements, bold typography, attractive design, marketing layout, eye-catching colors',
    dimensions: { width: 2480, height: 3508 },
    aspectRatio: '3:4',
    tags: ['promoção', 'desconto', 'marketing'],
    preview: '/templates/flyer-1.png'
  },
  {
    id: 'flyer-2',
    name: 'Flyer de Serviços',
    category: 'flyer',
    description: 'Flyer para apresentar serviços',
    prompt: 'Professional service flyer with business elements, clean layout, service highlights, modern design, corporate style',
    dimensions: { width: 2480, height: 3508 },
    aspectRatio: '3:4',
    tags: ['serviços', 'profissional', 'corporativo'],
    preview: '/templates/flyer-2.png'
  },

  // Cards de Negócio
  {
    id: 'business-card-1',
    name: 'Card de Apresentação',
    category: 'business',
    description: 'Card para apresentação pessoal ou empresarial',
    prompt: 'Professional business presentation card with logo, contact information, modern corporate design, clean layout',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    tags: ['negócio', 'profissional', 'apresentação'],
    preview: '/templates/business-card-1.png'
  },
  {
    id: 'business-card-2',
    name: 'Card de Portfólio',
    category: 'business',
    description: 'Card para mostrar trabalhos e projetos',
    prompt: 'Portfolio showcase card with project examples, creative layout, professional presentation, modern design',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    tags: ['portfólio', 'projetos', 'criativo'],
    preview: '/templates/business-card-2.png'
  },

  // Conteúdo Criativo
  {
    id: 'creative-1',
    name: 'Ilustração Abstrata',
    category: 'creative',
    description: 'Ilustração abstrata para uso criativo',
    prompt: 'Abstract illustration with geometric shapes, vibrant colors, modern art style, creative design, artistic composition',
    dimensions: { width: 1920, height: 1080 },
    aspectRatio: '16:9',
    tags: ['abstrato', 'arte', 'criativo'],
    preview: '/templates/creative-1.png'
  },
  {
    id: 'creative-2',
    name: 'Background Decorativo',
    category: 'creative',
    description: 'Background decorativo para uso em designs',
    prompt: 'Decorative background with patterns, subtle design, versatile layout, modern aesthetic, wallpaper style',
    dimensions: { width: 1920, height: 1080 },
    aspectRatio: '16:9',
    tags: ['background', 'decorativo', 'padrões'],
    preview: '/templates/creative-2.png'
  }
];

export const getTemplatesByCategory = (category: Template['category']) => {
  return TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return TEMPLATES.find(template => template.id === id);
};

export const getRandomTemplate = () => {
  return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
}; 