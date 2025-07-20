export interface Suggestion {
  text: string;
  category: 'social' | 'business' | 'creative' | 'marketing' | 'personal' | 'event';
  tags: string[];
}

export const SUGGESTIONS: Suggestion[] = [
  // Sugestões para Redes Sociais
  {
    text: "Um card elegante para apresentar um produto com design minimalista e cores vibrantes",
    category: "social",
    tags: ["produto", "minimalista", "elegante"]
  },
  {
    text: "Quote motivacional com fundo gradiente e tipografia moderna para Instagram",
    category: "social",
    tags: ["motivacional", "gradiente", "instagram"]
  },
  {
    text: "Card de evento com elementos de calendário e design profissional",
    category: "social",
    tags: ["evento", "calendário", "profissional"]
  },
  {
    text: "Story do Instagram com elementos interativos e cores chamativas",
    category: "social",
    tags: ["story", "interativo", "chamativo"]
  },

  // Sugestões para Negócios
  {
    text: "Card de apresentação empresarial com logo e informações de contato",
    category: "business",
    tags: ["empresa", "apresentação", "contato"]
  },
  {
    text: "Flyer promocional com ofertas especiais e design atrativo",
    category: "business",
    tags: ["promoção", "ofertas", "atrativo"]
  },
  {
    text: "Card de portfólio para mostrar trabalhos e projetos",
    category: "business",
    tags: ["portfólio", "trabalhos", "projetos"]
  },
  {
    text: "Banner corporativo com elementos profissionais e layout limpo",
    category: "business",
    tags: ["corporativo", "profissional", "limpo"]
  },

  // Sugestões Criativas
  {
    text: "Ilustração abstrata com formas geométricas e cores vibrantes",
    category: "creative",
    tags: ["abstrato", "geométrico", "vibrante"]
  },
  {
    text: "Background decorativo com padrões sutis e design moderno",
    category: "creative",
    tags: ["background", "padrões", "moderno"]
  },
  {
    text: "Arte digital com elementos futuristas e tecnologia",
    category: "creative",
    tags: ["digital", "futurista", "tecnologia"]
  },
  {
    text: "Composição artística com elementos da natureza e cores orgânicas",
    category: "creative",
    tags: ["arte", "natureza", "orgânico"]
  },

  // Sugestões de Marketing
  {
    text: "Anúncio promocional com call-to-action e design persuasivo",
    category: "marketing",
    tags: ["anúncio", "promocional", "persuasivo"]
  },
  {
    text: "Banner de vendas com elementos de urgência e escassez",
    category: "marketing",
    tags: ["vendas", "urgência", "escassez"]
  },
  {
    text: "Card de desconto com números grandes e design atrativo",
    category: "marketing",
    tags: ["desconto", "números", "atrativo"]
  },
  {
    text: "Infográfico com dados e estatísticas em design visual",
    category: "marketing",
    tags: ["infográfico", "dados", "estatísticas"]
  },

  // Sugestões Pessoais
  {
    text: "Card de aniversário com elementos festivos e cores alegres",
    category: "personal",
    tags: ["aniversário", "festivo", "alegre"]
  },
  {
    text: "Convite personalizado com design elegante e detalhes especiais",
    category: "personal",
    tags: ["convite", "elegante", "personalizado"]
  },
  {
    text: "Card de agradecimento com mensagem sincera e design acolhedor",
    category: "personal",
    tags: ["agradecimento", "sincero", "acolhedor"]
  },
  {
    text: "Lembrança de viagem com elementos turísticos e memórias",
    category: "personal",
    tags: ["viagem", "turístico", "memórias"]
  },

  // Sugestões de Eventos
  {
    text: "Convite de casamento com design romântico e elegante",
    category: "event",
    tags: ["casamento", "romântico", "elegante"]
  },
  {
    text: "Flyer de workshop com informações detalhadas e design profissional",
    category: "event",
    tags: ["workshop", "profissional", "detalhado"]
  },
  {
    text: "Card de conferência com palestrantes e agenda do evento",
    category: "event",
    tags: ["conferência", "palestrantes", "agenda"]
  },
  {
    text: "Convite de inauguração com elementos festivos e celebração",
    category: "event",
    tags: ["inauguração", "festivo", "celebração"]
  }
];

export function getRandomSuggestions(count: number = 6): Suggestion[] {
  const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getSuggestionsByCategory(category: Suggestion['category']): Suggestion[] {
  return SUGGESTIONS.filter(suggestion => suggestion.category === category);
}

export function getSuggestionsByTag(tag: string): Suggestion[] {
  return SUGGESTIONS.filter(suggestion => 
    suggestion.tags.some(suggestionTag => 
      suggestionTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}