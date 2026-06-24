import type { PortfolioData } from '@/types/portfolio'

export const portfolioData: PortfolioData = {
  seo: {
    title: 'Wicolly Pedro Alcantara | Portifolio de software e produtos digitais',
    description:
      'Portifolio profissional com sistemas reais, apps multiplataforma, galeria visual e estrutura comercial pronta para personalizacao.',
    keywords: [
      'portifolio pessoal',
      'portfolio desenvolvedor flutter',
      'portfolio react typescript',
      'sistema de estoque',
      'app de estudos',
      'produto digital sob encomenda',
      'portfolio premium',
    ],
    siteUrl: 'https://wicolly.com.br/portfolio/',
    ogImage: '/og-cover.svg',
  },
  theme: {
    colors: {
      background: '#07111d',
      backgroundAlt: '#0d1830',
      surface: 'rgba(10, 24, 40, 0.82)',
      surfaceAlt: '#11233b',
      text: '#edf4ff',
      muted: '#98adca',
      primary: '#5eead4',
      secondary: '#ffbe78',
      accent: '#8db0ff',
      border: 'rgba(136, 162, 198, 0.2)',
      success: '#5ed88e',
      warning: '#ffbe78',
      overlay: 'rgba(7, 17, 29, 0.68)',
    },
    gradients: {
      hero:
        'linear-gradient(135deg, rgba(94, 234, 212, 0.24), rgba(141, 176, 255, 0.18) 55%, rgba(255, 190, 120, 0.2))',
      spotlight:
        'radial-gradient(circle at 10% 10%, rgba(94, 234, 212, 0.15), transparent 26%), radial-gradient(circle at 85% 15%, rgba(141, 176, 255, 0.18), transparent 32%), radial-gradient(circle at 50% 85%, rgba(255, 190, 120, 0.12), transparent 28%)',
      card:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    },
    fonts: {
      display: "'Space Grotesk', sans-serif",
      body: "'Manrope', sans-serif",
    },
    layout: {
      maxWidth: '1180px',
      radius: '30px',
    },
  },
  header: {
    cta: {
      label: 'Agendar conversa',
      href: '#contact',
      variant: 'primary',
      icon: 'phone',
    },
  },
  navigation: [
    { label: 'Inicio', target: 'hero' },
    { label: 'Sobre', target: 'about' },
    { label: 'Projetos', target: 'projects' },
    { label: 'Planos', target: 'roadmap' },
    { label: 'Credenciais', target: 'credentials' },
    { label: 'Midia', target: 'gallery' },
    { label: 'Servico', target: 'services' },
    { label: 'Contato', target: 'contact' },
  ],
  sectionOrder: [
    'hero',
    'about',
    'projects',
    'roadmap',
    'credentials',
    'gallery',
    'services',
    'contact',
  ],
  hero: {
    eyebrow: 'Portifolio pessoal + produto digital sob encomenda',
    name: 'Wícolly Pedro Alcântara',
    role: 'Desenvolvedor de software focado em apps, sistemas e experiencias digitais premium',
    title: 'Projetos reais que conectam organizacao, usabilidade e valor de produto.',
    description:
      'Aqui eu apresento um portifolio que mistura sistemas desktop, apps Flutter, organizadores offline-first e uma estrutura visual que tambem pode ser vendida como produto para outros clientes.',
    subtitle:
      'A base continua modular e totalmente editavel, mas agora destacando projetos autorais como controle de estoque, gerenciador academico, simulador de habitos e app de leitura.',
    availability: 'Disponivel para novos projetos e personalizacoes',
    actions: [
      {
        label: 'Falar comigo',
        href: '#contact',
        variant: 'primary',
        icon: 'whatsapp',
      },
      {
        label: 'Ver projetos',
        href: '#projects',
        variant: 'secondary',
        icon: 'folder',
      },
      {
        label: 'Abrir curriculo',
        href: '/curriculo.pdf',
        variant: 'ghost',
        icon: 'download',
      },
    ],
    badges: ['React', 'TypeScript', 'Flutter', 'Electron', 'Fastify', 'Drift'],
    metrics: [
      {
        value: '5',
        label: 'projetos reais em destaque',
        detail: 'entre portfolio, desktop corporativo e apps Flutter',
      },
      {
        value: '100%',
        label: 'conteudo editavel por configuracao',
        detail: 'textos, cores, links e ordem das secoes',
      },
      {
        value: '3 frentes',
        label: 'web, desktop e mobile',
        detail: 'experiencia multiplataforma com foco em manutencao',
      },
    ],
    image: {
      src: '/media/avatar-tech.svg',
      alt: 'Ilustracao abstrata representando um portfolio digital premium',
    },
    feature: {
      title: 'O mesmo formato pode virar um produto comercial',
      description:
        'Cada bloco foi estruturado para ser reaproveitado em entregas sob medida para profissionais e empresas que precisam de um site elegante, confiavel e facil de atualizar.',
      items: [
        'Troca simples de identidade visual, fontes e imagens.',
        'Projetos, certificados e midia carregados a partir de dados estruturados.',
        'Secoes reorganizaveis para criar desde um portfolio ate uma vitrine comercial.',
      ],
    },
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com/TSWill03', icon: 'github' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/wicolly-alcantara-3454102a7/',
        icon: 'linkedin',
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/wicolly',
        icon: 'instagram',
      },
    ],
  },
  about: {
    eyebrow: 'Sobre mim',
    title: 'Apps, sistemas e interfaces pensados para crescer com clareza.',
    description:
      'Este portfolio foi reorganizado para mostrar projetos reais de software, combinando Flutter, React, Electron e organizacao de produto em uma apresentacao clara e escalavel.',
    paragraphs: [
      'Atuo unindo desenvolvimento de software, organizacao de informacao e direcao visual para criar projetos que transmitam profissionalismo sem parecerem genericos.',
      'Penso cada projeto como um ativo de negocio: ele precisa funcionar bem, explicar seu valor, organizar o dominio com clareza e facilitar futuras evolucoes sem reescrever tudo do zero.',
    ],
    skills: [
      'Arquitetura de interfaces',
      'Apps desktop e mobile',
      'Sistemas offline-first',
      'Desenvolvimento responsivo',
      'Organizacao de dominio e conteudo',
      'Solucoes com valor comercial',
    ],
    technologies: [
      {
        label: 'Front-end e desktop',
        items: ['React', 'TypeScript', 'Vite', 'Electron', 'CSS moderno'],
      },
      {
        label: 'Mobile e offline-first',
        items: ['Flutter', 'Riverpod', 'Drift', 'SQLite', 'Go Router'],
      },
      {
        label: 'Back-end e dados',
        items: ['Node.js', 'Fastify', 'Prisma', 'PostgreSQL', 'JSON backup'],
      },
      {
        label: 'Fluxo de entrega',
        items: ['Git', 'Deploy simplificado', 'Escalabilidade', 'Documentacao'],
      },
    ],
    highlights: [
      {
        icon: 'layers',
        title: 'Estrutura escalavel',
        description:
          'Secoes independentes e dados centralizados para adicionar novos cases, cursos ou servicos sem retrabalho.',
      },
      {
        icon: 'palette',
        title: 'Identidade personalizavel',
        description:
          'Cores, fontes e atmosfera visual podem ser adaptadas para diferentes perfis profissionais.',
      },
      {
        icon: 'workflow',
        title: 'Pensado como produto',
        description:
          'A mesma base pode virar um modelo comercial para atender outros clientes com rapidez e consistencia.',
      },
    ],
  },
  projects: {
    eyebrow: 'Projetos em andamento e concluidos',
    title: 'Projetos reais organizados com contexto tecnico, status e proposta de produto.',
    description:
      'Agora os projetos usam capturas reais versionadas no proprio repositorio, o que garante que as imagens aparecam corretamente tambem no GitHub Pages.',
    items: [
      {
        id: 'portfolio-premium',
        title: 'Portifolio Comercial Personalizavel',
        description:
          'Este proprio site funciona como portfolio pessoal, vitrine de servicos e base reaproveitavel para novos clientes.',
        status: 'completed',
        phase: 'Publicado em wicolly.com.br/portfolio/',
        technologies: ['React', 'TypeScript', 'Vite', 'Arquitetura por componentes', 'SEO'],
        cover: '/media/project-portfolio.svg',
        coverAlt: 'Capa do portfolio comercial personalizavel',
        githubUrl: 'https://github.com/TSWill03/Portifolio',
        demoUrl: 'https://wicolly.com.br/portfolio/',
        gallery: [
          {
            src: '/media/project-controle-estoque-real.png',
            alt: 'Screenshot real do projeto controle de estoque',
          },
          {
            src: '/media/project-campusflow-real.png',
            alt: 'Screenshot real do projeto CampusFlow',
          },
          {
            src: '/media/project-quanto-custa-real.png',
            alt: 'Screenshot real do projeto Quanto Custa',
          },
          {
            src: '/media/project-txt-webnovel-reader.png',
            alt: 'Screenshot real do projeto TXT Webnovel Reader',
          },
        ],
        highlights: [
          'Conteudo e interface separados para facilitar manutencao e revenda.',
          'Projetos, contatos e galerias atualizados por configuracao central.',
          'Publicacao continua no Cloudflare Pages com deploy automatizado.',
        ],
        details:
          'Este projeto representa o lado comercial do seu trabalho: uma estrutura premium, responsiva e adaptavel para apresentar servicos, cases e evolucao profissional sem depender de um CMS.',
      },
      {
        id: 'controle-estoque',
        title: 'Controle de Estoque Corporativo',
        description:
          'Sistema desktop para operacao de estoque em rede local, com servidor centralizado, auditoria, Excel e fluxos seguros de entrada, saida e transferencia.',
        status: 'in-progress',
        phase: 'Dashboard e modulos internos ativos',
        technologies: ['Electron', 'React', 'TypeScript', 'Fastify', 'Prisma', 'PostgreSQL'],
        cover: '/media/project-controle-estoque-real.png',
        coverAlt: 'Screenshot do sistema de controle de estoque corporativo',
        highlights: [
          'Dashboard com indicadores de produtos, depositos, movimentos e alerta de reposicao.',
          'Desktop profissional conectado a uma API centralizada para uso interno.',
          'Arquitetura modular preparada para crescer com relatorios, usuarios e operacao em rede local.',
        ],
        details:
          'O projeto foi pensado para operacao real em ambiente corporativo, com autenticacao, categorias, fornecedores, depositos, produtos, alertas de estoque minimo, auditoria e importacao/exportacao por Excel.',
      },
      {
        id: 'campusflow',
        title: 'CampusFlow | Gerenciador de Estudos',
        description:
          'Gerenciador academico pessoal offline-first para estudantes universitarios, com perfis, disciplinas, horas obrigatorias, estudos e backup local em JSON.',
        status: 'in-progress',
        phase: 'Perfis academicos e modulos base validados',
        technologies: ['Flutter', 'Riverpod', 'Drift', 'SQLite', 'Go Router', 'Material 3'],
        cover: '/media/project-campusflow-real.png',
        coverAlt: 'Screenshot do app CampusFlow',
        highlights: [
          'Tela de perfis academicos com status ativo, carga total e blocos por area.',
          'Funciona 100% offline com banco local e metadados para sync futura.',
          'Organiza disciplinas, tarefas, sessoes de estudo, horas complementares, estagios e extensao.',
          'Backup e restauracao em JSON para manter os dados portaveis.',
        ],
        details:
          'A arquitetura do app foi preparada para crescer com sincronizacao incremental, multi-dispositivo e publicacao em web, desktop e mobile, sem perder a clareza da estrutura por features.',
      },
      {
        id: 'quanto-custa',
        title: 'Quanto Custa?',
        description:
          'Simulador de impacto financeiro para pequenos habitos recorrentes, comparando o custo atual com cenarios mais sustentaveis ao longo do tempo.',
        status: 'completed',
        phase: 'MVP multiplataforma com historico local',
        technologies: ['Flutter', 'Dart', 'SharedPreferences', 'Material 3'],
        cover: '/media/project-quanto-custa-real.png',
        coverAlt: 'Screenshot do app Quanto Custa',
        highlights: [
          'Transforma habitos recorrentes em simulacoes mensais, anuais e de cinco anos.',
          'Interface com presets rapidos, sliders e leitura visual imediata do impacto.',
          'Salva cenarios localmente para restaurar ou excluir depois.',
          'Projeto pensado como app de portfolio para Windows, Android e iOS.',
        ],
        details:
          'O foco do app e mostrar com clareza visual como pequenos gastos recorrentes afetam o bolso no longo prazo, tornando a simulacao facil de entender e util para tomada de decisao.',
      },
      {
        id: 'txt-webnovel-reader',
        title: 'Veredra',
        description:
          'Leitor continuo com foco inicial em desktop para TXT, EPUB e PDF, com biblioteca local, importacao simples, perfis e navegacao sem ruido.',
        status: 'in-progress',
        phase: 'Biblioteca local e fluxo de leitura em evolucao',
        technologies: ['Flutter', 'Desktop', 'EPUBX', 'pdfrx', 'SharedPreferences'],
        cover: '/media/project-txt-webnovel-reader.png',
        coverAlt: 'Screenshot do leitor TXT Webnovel Reader',
        highlights: [
          'Biblioteca local com busca, filtros, favoritos, recentes e acao rapida para abrir.',
          'Importa conteudo local e organiza a leitura por perfil com suporte a backup.',
          'Base preparada para TXT, EPUB, PDF e persistencia local.',
        ],
        details:
          'Esse projeto mostra seu lado de produto utilitario: uma base Flutter para leitura local que pode evoluir com progresso, favoritos, colecoes pessoais e experiencia continua de leitura em desktop.',
      },
    ],
  },
  roadmap: {
    eyebrow: 'Planejamentos e ideias futuras',
    title: 'Uma visao de roadmap que valoriza evolucao continua.',
    description:
      'Nem todo trabalho precisa estar finalizado para comunicar maturidade. Esta secao ajuda a mostrar direcao estrategica, proximos passos e oportunidades comerciais.',
    items: [
      {
        phase: 'Q2 2026',
        title: 'Template white-label para especialistas',
        description:
          'Adaptar esta base para um pacote que possa ser entregue com mais velocidade para consultores, mentores e pequenos estudios.',
        status: 'Em definicao',
        outcomes: [
          'Kit de secoes reaproveitaveis',
          'Checklist de onboarding',
          'Modo rapido de customizacao',
        ],
      },
      {
        phase: 'Q3 2026',
        title: 'Painel simples para edicao de conteudo',
        description:
          'Estudar uma camada administrativa leve para clientes que prefiram atualizar textos e links sem abrir o codigo.',
        status: 'Pesquisa',
        outcomes: ['Mapeamento de campos', 'Estrutura de formularios', 'Sincronizacao com assets'],
      },
      {
        phase: 'Q3 2026',
        title: 'Biblioteca de blocos de prova social',
        description:
          'Criar novos componentes para depoimentos, numeros de resultado, cases resumidos e secao de FAQ.',
        status: 'Backlog priorizado',
        outcomes: ['Cards de depoimento', 'Variantes de destaque', 'Secao FAQ reutilizavel'],
      },
      {
        phase: 'Q4 2026',
        title: 'Pacote com manutencao recorrente',
        description:
          'Transformar a entrega em um servico continuo com suporte para novas secoes, atualizacoes e refinamentos visuais.',
        status: 'Validacao comercial',
        outcomes: ['Plano mensal', 'SLA basico', 'Documentacao de mudancas'],
      },
    ],
  },
  credentials: {
    eyebrow: 'Certificados e cursos',
    title: 'Credenciais apresentadas com contexto visual e facilidade de acesso.',
    description:
      'Os itens podem receber imagem, data, carga horaria, instituicao e link para certificado ou PDF. Isso ajuda a mostrar evolucao tecnica de forma organizada e profissional.',
    items: [
      {
        type: 'Curso',
        title: 'Formacao em React para interfaces escalaveis',
        institution: 'Plataforma de Ensino Exemplo',
        workload: '72 horas',
        date: 'Janeiro 2026',
        image: '/media/certificate-react.svg',
        imageAlt: 'Certificado estilizado de React',
        credentialUrl: 'https://seusite.com/certificados/react',
        summary:
          'Foco em componentizacao, fluxo de dados, organizacao de projeto e boas praticas de interface.',
      },
      {
        type: 'Certificado',
        title: 'UX e arquitetura de informacao',
        institution: 'Instituicao Criativa',
        workload: '40 horas',
        date: 'Outubro 2025',
        image: '/media/certificate-ux.svg',
        imageAlt: 'Certificado visual de UX e arquitetura',
        credentialUrl: 'https://seusite.com/certificados/ux',
        summary:
          'Estudos voltados para hierarquia visual, fluxo de conteudo e clareza de navegacao.',
      },
      {
        type: 'Curso',
        title: 'Acessibilidade e interfaces inclusivas',
        institution: 'Academia Digital',
        workload: '24 horas',
        date: 'Agosto 2025',
        image: '/media/certificate-accessibility.svg',
        imageAlt: 'Certificado com simbolo de acessibilidade',
        credentialUrl: 'https://seusite.com/certificados/a11y',
        summary:
          'Aplicacao pratica de contraste, semantica, navegacao por teclado e boas praticas para web.',
      },
      {
        type: 'Certificado',
        title: 'Fundamentos de cloud e deploy',
        institution: 'Programa Tech Cloud',
        workload: '18 horas',
        date: 'Maio 2025',
        image: '/media/certificate-cloud.svg',
        imageAlt: 'Certificado com elementos de cloud e deploy',
        credentialUrl: 'https://seusite.com/certificados/cloud',
        summary:
          'Capacitacao orientada a organizacao para deploy, versionamento e manutencao basica.',
      },
    ],
  },
  gallery: {
    eyebrow: 'Galeria multimidia',
    title: 'Screenshots reais dos projetos, agora publicados junto com o site.',
    description:
      'As imagens que voce me mandou agora foram colocadas dentro do repositorio e ligadas aos projetos. Assim o portfolio mostra telas reais e o GitHub Pages publica tudo junto.',
    images: [
      {
        title: 'Controle de Estoque',
        description:
          'Dashboard desktop com indicadores, alerta de reposicao e menu operacional para ambiente corporativo.',
        src: '/media/project-controle-estoque-real.png',
        alt: 'Screenshot do sistema de controle de estoque',
        tag: 'Desktop',
      },
      {
        title: 'Gerenciador de Estudos',
        description:
          'Tela real do CampusFlow com perfis academicos, modulos laterais e resumo da graduacao ativa.',
        src: '/media/project-campusflow-real.png',
        alt: 'Screenshot do app CampusFlow',
        tag: 'Flutter',
      },
      {
        title: 'Quanto Custa?',
        description:
          'Simulador com comparacao visual, presets de habito, sliders e leitura de impacto no curto e longo prazo.',
        src: '/media/project-quanto-custa-real.png',
        alt: 'Capa do app Quanto Custa',
        tag: 'Habitos',
      },
      {
        title: 'TXT Webnovel Reader',
        description:
          'Biblioteca local com capas, busca, filtros, favoritos e abertura rapida para leitura continua.',
        src: '/media/project-txt-webnovel-reader.png',
        alt: 'Capa do leitor TXT Webnovel Reader',
        tag: 'Leitura',
      },
    ],
    videos: [],
  },
  services: {
    eyebrow: 'Servicos e produto',
    title: 'Esta pagina tambem funciona como vitrine de um servico sob encomenda.',
    description:
      'O visitante entende nao apenas quem voce e, mas tambem o que pode contratar. A base foi estruturada para transmitir valor comercial de forma elegante e convincente.',
    offerLabel: 'Produto personalizavel',
    offerings: [
      {
        icon: 'sparkles',
        title: 'Portifolio premium',
        description:
          'Para profissionais que precisam apresentar projetos, experiencia, provas de capacidade e contatos em uma pagina mais sofisticada.',
        features: [
          'Hero personalizado',
          'Projetos dinamicos',
          'Certificados e cursos',
          'Links e redes sociais',
        ],
      },
      {
        icon: 'monitor',
        title: 'Site vitrine para servicos',
        description:
          'Versao focada em posicionamento comercial, com secoes de servico, diferenciais, processo e CTA forte.',
        features: [
          'Adaptacao da narrativa',
          'Secoes comerciais',
          'Ajuste de identidade visual',
          'Otimizacao para conversao',
        ],
      },
      {
        icon: 'shield',
        title: 'Pacote de evolucao',
        description:
          'Ideal para quem deseja uma base pronta para crescer com novos cases, materiais, paginas e atualizacoes visuais.',
        features: [
          'Documentacao de edicao',
          'Estrutura expansivel',
          'Apoio para novas secoes',
          'Entrega pronta para deploy',
        ],
      },
    ],
    customization: {
      title: 'Tudo foi pensado para ser facilmente adaptado a cada cliente.',
      description:
        'A mesma estrutura acomoda marcas pessoais, estudios criativos, especialistas e pequenos negocios sem exigir uma reconstrucao completa do projeto.',
      groups: [
        {
          title: 'Identidade visual',
          description:
            'Troque rapidamente o clima do site para combinar com a proposta de cada marca.',
          items: [
            'Cores principais, secundarias e tons de apoio',
            'Fontes de titulos e textos',
            'Gradientes, contraste e acabamento visual',
          ],
        },
        {
          title: 'Narrativa e secoes',
          description:
            'Reorganize a historia que o visitante enxerga e destaque o que gera mais valor.',
          items: [
            'Titulos, subtitulos e descricoes de todas as secoes',
            'Ordem de exibicao das secoes',
            'Botoes, links rapidos e CTA principal',
          ],
        },
        {
          title: 'Projetos e credenciais',
          description:
            'Mostre provas concretas de capacidade sem depender de um painel externo.',
          items: [
            'Projetos com status, galerias, GitHub, demo e video',
            'Certificados, cursos, imagens, links e PDFs',
            'Planejamentos e roadmap com proximos passos',
          ],
        },
        {
          title: 'Contato e conversao',
          description:
            'Adapte os canais de atendimento e a mensagem comercial para cada publico.',
          items: [
            'WhatsApp, e-mail, GitHub, LinkedIn e outras redes',
            'Mensagem inicial sugerida para o visitante',
            'Bloco de servicos sob encomenda e proposta comercial',
          ],
        },
      ],
    },
    differentiators: [
      'Conteudo separado da interface para facilitar manutencao.',
      'Componentes reutilizaveis que encurtam futuras expansoes.',
      'Visual com cara de produto real, nao de landing page generica.',
      'Codigo organizado para adaptar o mesmo projeto a diferentes clientes.',
    ],
    process: [
      {
        step: '01',
        title: 'Imersao rapida',
        description:
          'Coleta de referencias, objetivos, materiais e definicao do posicionamento que o site precisa comunicar.',
      },
      {
        step: '02',
        title: 'Estrutura e narrativa',
        description:
          'Organizacao das secoes, hierarquia das informacoes e distribuicao dos componentes que sustentam a experiencia.',
      },
      {
        step: '03',
        title: 'Design e implementacao',
        description:
          'Aplicacao da identidade visual, construcao responsiva e ajustes para performance, SEO e acessibilidade basica.',
      },
      {
        step: '04',
        title: 'Entrega pronta para evoluir',
        description:
          'Projeto com documentacao de edicao e base limpa para receber novos cases, imagens, links e refinamentos.',
      },
    ],
    cta: {
      label: 'Solicitar proposta',
      href: '#contact',
      variant: 'primary',
      icon: 'phone',
    },
  },
  contact: {
    eyebrow: 'Contato',
    title: 'Vamos transformar sua presenca digital em uma vitrine memoravel.',
    description:
      'Use esta secao para concentrar seus canais principais, estimular um contato rapido e deixar claro que o projeto pode ser contratado ou adaptado para outros cenarios.',
    availability:
      'Atendimento remoto, briefing por mensagem ou reuniao online e entregas pensadas para facilitar aprovacoes e evolucao do projeto.',
    quickMessage:
      'Ola! Vi seu portfolio e gostaria de conversar sobre um site personalizado.',
    methods: [
      {
        title: 'WhatsApp',
        value: '+55 34 99767-5400',
        href: 'https://wa.me/5534997675400?text=Ola!%20Vi%20seu%20portfolio%20e%20gostaria%20de%20conversar%20sobre%20um%20site%20personalizado.',
        icon: 'whatsapp',
        description: 'Canal ideal para um primeiro contato rapido e objetivo.',
      },
      {
        title: 'E-mail',
        value: 'wicolly@gmail.com',
        href: 'mailto:wicolly@gmail.com',
        icon: 'mail',
        description: 'Melhor opcao para orcamentos, materiais e informacoes detalhadas.',
      },
      {
        title: 'GitHub',
        value: 'github.com/TSWill03',
        href: 'https://github.com/TSWill03',
        icon: 'github',
        description: 'Repositorio e historico tecnico para quem quer aprofundar no codigo.',
      },
      {
        title: 'LinkedIn',
        value: 'linkedin.com/in/wicolly-alcantara-3454102a7/',
        href: 'https://www.linkedin.com/in/wicolly-alcantara-3454102a7/',
        icon: 'linkedin',
        description: 'Perfil profissional com networking, experiencia e atualizacoes.',
      },
    ],
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com/TSWill03', icon: 'github' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/wicolly-alcantara-3454102a7/',
        icon: 'linkedin',
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/wicollyo',
        icon: 'instagram',
      },
      {
        label: 'Site',
        href: 'https://wicolly.com.br/portfolio/',
        icon: 'globe',
      },
    ],
    quickLinks: [
      {
        label: 'Chamar no WhatsApp',
        href: 'https://wa.me/5534997675400?text=Ola!%20Vi%20seu%20portfolio%20e%20gostaria%20de%20conversar%20sobre%20um%20site%20personalizado.',
        variant: 'primary',
        icon: 'whatsapp',
      },
      {
        label: 'Enviar e-mail',
        href: 'mailto:wicolly@gmail.com',
        variant: 'secondary',
        icon: 'mail',
      },
    ],
  },
  footer: {
    note:
      'Portfolio pessoal com projetos reais e estrutura visual pronta para crescer ou ser adaptada a novas entregas.',
    copyright: 'Wicolly Alcantara. Todos os direitos reservados.',
  },
}
