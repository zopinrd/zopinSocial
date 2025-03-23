import { Group, GroupMember, GroupPost, GroupEvent, MarketplaceItem } from '../types/group';

export const mockGroup: Group = {
  id: '1',
  name: 'Zopin Creators Hub',
  description: 'Comunidade oficial para criadores de conteúdo da Zopin',
  detailedDescription: 'Um espaço para criadores compartilharem experiências, dicas e colaborarem em projetos. Aqui você encontra outros criadores para networking, aprende sobre as últimas tendências e participa de eventos exclusivos.',
  bannerUrl: 'https://picsum.photos/1920/1080',
  avatarUrl: 'https://picsum.photos/200',
  memberCount: 15423,
  createdAt: '2024-01-01T00:00:00Z',
  rules: [
    'Seja respeitoso com todos os membros',
    'Não compartilhe conteúdo inadequado ou ofensivo',
    'Mantenha as discussões relevantes ao tema do grupo',
    'Não faça spam ou autopromoção excessiva',
    'Siga as diretrizes da comunidade Zopin'
  ],
  isPrivate: false
};

export const mockMembers: GroupMember[] = [
  {
    id: '1',
    userId: '1',
    groupId: '1',
    role: 'admin',
    joinedAt: '2024-01-01T00:00:00Z',
    name: 'Amanda Silva',
    avatarUrl: 'https://picsum.photos/200'
  },
  {
    id: '2',
    userId: '2',
    groupId: '1',
    role: 'moderator',
    joinedAt: '2024-01-02T00:00:00Z',
    name: 'João Pedro',
    avatarUrl: 'https://picsum.photos/201'
  },
  // Adicione mais membros aqui...
];

export const mockPosts: GroupPost[] = [
  {
    id: '1',
    groupId: '1',
    authorId: '1',
    author: {
      name: 'Amanda Silva',
      avatarUrl: 'https://picsum.photos/200'
    },
    content: 'Pessoal, compartilhando minha última live! O que acharam? 🎮',
    mediaUrl: 'https://picsum.photos/800/450',
    mediaType: 'image',
    createdAt: '2024-03-21T15:30:00Z',
    isPinned: true,
    isAnnouncement: false,
    reactions: [
      { type: '👍', count: 156, userReacted: true },
      { type: '❤️', count: 89, userReacted: false },
      { type: '🔥', count: 45, userReacted: false }
    ],
    commentCount: 23,
    tags: ['live', 'gameplay', 'highlights']
  },
  {
    id: '2',
    groupId: '1',
    authorId: '2',
    author: {
      name: 'João Pedro',
      avatarUrl: 'https://picsum.photos/201'
    },
    content: 'Qual setup vocês preferem para lives? Vamos votar! 🎯',
    createdAt: '2024-03-21T14:00:00Z',
    isPinned: false,
    isAnnouncement: false,
    reactions: [
      { type: '👍', count: 45, userReacted: false },
      { type: '🤔', count: 12, userReacted: true }
    ],
    commentCount: 67,
    tags: ['enquete', 'setup'],
    poll: {
      question: 'Qual setup você prefere para lives?',
      options: [
        { id: '1', text: 'PC Gamer + Câmera DSLR', votes: 234 },
        { id: '2', text: 'Notebook + Webcam', votes: 156 },
        { id: '3', text: 'Console + Capture Card', votes: 89 }
      ],
      totalVotes: 479,
      endsAt: '2024-03-28T14:00:00Z'
    }
  }
];

export const mockEvents: GroupEvent[] = [
  {
    id: '1',
    groupId: '1',
    title: 'Workshop: Como Crescer na Zopin',
    description: 'Aprenda as melhores estratégias para crescer sua audiência e engajamento na plataforma.',
    coverUrl: 'https://picsum.photos/800/400',
    startDate: '2024-04-01T18:00:00Z',
    endDate: '2024-04-01T20:00:00Z',
    location: 'Online',
    attendeeCount: 234,
    isOnline: true,
    status: 'upcoming'
  },
  {
    id: '2',
    groupId: '1',
    title: 'Encontro de Criadores SP',
    description: 'Encontro presencial dos criadores de São Paulo! Venha networking e muito mais.',
    coverUrl: 'https://picsum.photos/800/401',
    startDate: '2024-04-15T14:00:00Z',
    endDate: '2024-04-15T18:00:00Z',
    location: 'São Paulo, SP',
    attendeeCount: 89,
    isOnline: false,
    status: 'upcoming'
  }
];

export const mockMarketplace: MarketplaceItem[] = [
  {
    id: '1',
    groupId: '1',
    sellerId: '1',
    seller: {
      name: 'Amanda Silva',
      avatarUrl: 'https://picsum.photos/200'
    },
    title: 'Microfone Blue Yeti USB',
    description: 'Microfone em ótimo estado, usado apenas por 6 meses. Acompanha pop filter e braço articulado.',
    price: 899.90,
    currency: 'BRL',
    images: ['https://picsum.photos/400/400', 'https://picsum.photos/400/401'],
    condition: 'like_new',
    createdAt: '2024-03-20T10:00:00Z',
    status: 'available',
    category: 'Equipamentos de Áudio'
  },
  {
    id: '2',
    groupId: '1',
    sellerId: '2',
    seller: {
      name: 'João Pedro',
      avatarUrl: 'https://picsum.photos/201'
    },
    title: 'Ring Light LED 18"',
    description: 'Ring light profissional com tripé e suporte para celular. Perfeita para lives e gravações.',
    price: 299.90,
    currency: 'BRL',
    images: ['https://picsum.photos/400/402'],
    condition: 'good',
    createdAt: '2024-03-19T15:00:00Z',
    status: 'available',
    category: 'Iluminação'
  }
];
