import { Language } from '../types';

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' }
];

export const translations = {
  en: {
    // Header
    appTitle: 'Arch Calculator',
    appSubtitle: 'Engineering Toolkit',
    tagline: 'Precision Engineering Solutions for Global Professionals',
    
    // Navigation
    allTools: 'All Tools',
    quantity: 'Quantity Calculators',
    area: 'Area Calculators', 
    volume: 'Volume Calculators',
    converter: 'Unit Converters',
    proTools: 'Pro Tools',
    
    // Search
    searchPlaceholder: 'Search calculators...',
    searchStart: 'Start typing to search through our engineering calculators',
    noResults: 'No calculators found matching',
    
    // Categories
    allEngineering: 'All Engineering Calculators',
    allDescription: 'Professional tools for architects, civil engineers, and construction professionals',
    proDescription: 'Advanced engineering calculators for professional analysis and design',
    specializesCalculators: 'specialized calculators for',
    calculations: 'calculations',
    
    // Popular & Recent
    popularCalculators: 'Popular Calculators',
    recentlyUsed: 'Recently Used',
    noRecentCalculators: 'No recently used calculators',
    startUsing: 'Start using calculators to see them here',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    unitSystem: 'Unit System',
    aboutUs: 'About Us',
    ourMission: 'Our Mission',
    contactDeveloper: 'Contact Developer',
    
    // Unit Systems
    metric: 'Metric',
    imperial: 'Imperial',
    metricDesc: 'Meters, kilograms, Celsius',
    imperialDesc: 'Feet, pounds, Fahrenheit',
    
    // Themes
    defaultTheme: 'Default',
    oceanTheme: 'Ocean Blue',
    forestTheme: 'Forest Green',
    sunsetTheme: 'Sunset Orange',
    purpleTheme: 'Royal Purple',
    
    // About & Mission
    aboutTitle: 'About Arch Calculator',
    aboutContent: 'Arch Calculator is a comprehensive engineering toolkit designed for architects, civil engineers, and construction professionals worldwide. Our platform provides accurate, reliable calculations essential for modern engineering practice.',
    missionTitle: 'Our Mission',
    missionContent: 'To empower engineering professionals globally with precise, accessible calculation tools that enhance productivity, ensure accuracy, and support innovative design solutions across all engineering disciplines.',
    
    // Contact
    contactTitle: 'Contact Developer',
    contactContent: 'Have questions, suggestions, or need support? We\'d love to hear from you.',
    emailDeveloper: 'Email Developer',
    
    // Tags
    structural: 'Structural',
    civil: 'Civil',
    mechanical: 'Mechanical',
    electrical: 'Electrical',
    hvac: 'HVAC',
    geotechnical: 'Geotechnical',
    environmental: 'Environmental',
    materials: 'Materials',
    design: 'Design',
    analysis: 'Analysis',
    
    // Pro Features
    proFeature: 'This is a Pro feature. Upgrade to access advanced engineering calculators.',
    upgradeNow: 'Upgrade Now',
    
    // Empty States
    noCalculatorsFound: 'No calculators found',
    tryDifferentCategory: 'Try selecting a different category or use the search function to find specific calculators.',
    
    // Common
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    reset: 'Reset'
  },
  ar: {
    // Header
    appTitle: 'حاسبة المعمار',
    appSubtitle: 'أدوات الهندسة',
    tagline: 'حلول هندسية دقيقة للمحترفين العالميين',
    
    // Navigation
    allTools: 'جميع الأدوات',
    quantity: 'حاسبات الكمية',
    area: 'حاسبات المساحة',
    volume: 'حاسبات الحجم',
    converter: 'محولات الوحدات',
    proTools: 'الأدوات المتقدمة',
    
    // Search
    searchPlaceholder: 'البحث في الحاسبات...',
    searchStart: 'ابدأ الكتابة للبحث في حاسباتنا الهندسية',
    noResults: 'لم يتم العثور على حاسبات تطابق',
    
    // Categories
    allEngineering: 'جميع الحاسبات الهندسية',
    allDescription: 'أدوات احترافية للمعماريين والمهندسين المدنيين ومحترفي البناء',
    proDescription: 'حاسبات هندسية متقدمة للتحليل والتصميم المهني',
    specializesCalculators: 'حاسبات متخصصة لـ',
    calculations: 'الحسابات',
    
    // Popular & Recent
    popularCalculators: 'الحاسبات الشائعة',
    recentlyUsed: 'المستخدمة مؤخراً',
    noRecentCalculators: 'لا توجد حاسبات مستخدمة مؤخراً',
    startUsing: 'ابدأ باستخدام الحاسبات لرؤيتها هنا',
    
    // Settings
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    unitSystem: 'نظام الوحدات',
    aboutUs: 'من نحن',
    ourMission: 'مهمتنا',
    contactDeveloper: 'اتصل بالمطور',
    
    // Unit Systems
    metric: 'متري',
    imperial: 'إمبراطوري',
    metricDesc: 'متر، كيلوغرام، مئوية',
    imperialDesc: 'قدم، رطل، فهرنهايت',
    
    // Themes
    defaultTheme: 'افتراضي',
    oceanTheme: 'أزرق المحيط',
    forestTheme: 'أخضر الغابة',
    sunsetTheme: 'برتقالي الغروب',
    purpleTheme: 'بنفسجي ملكي',
    
    // About & Mission
    aboutTitle: 'حول حاسبة المعمار',
    aboutContent: 'حاسبة المعمار هي مجموعة أدوات هندسية شاملة مصممة للمعماريين والمهندسين المدنيين ومحترفي البناء في جميع أنحاء العالم. توفر منصتنا حسابات دقيقة وموثوقة ضرورية للممارسة الهندسية الحديثة.',
    missionTitle: 'مهمتنا',
    missionContent: 'تمكين المهندسين المحترفين عالمياً بأدوات حساب دقيقة ومتاحة تعزز الإنتاجية وتضمن الدقة وتدعم حلول التصميم المبتكرة عبر جميع التخصصات الهندسية.',
    
    // Contact
    contactTitle: 'اتصل بالمطور',
    contactContent: 'هل لديك أسئلة أو اقتراحات أو تحتاج دعم؟ نحب أن نسمع منك.',
    emailDeveloper: 'راسل المطور',
    
    // Tags
    structural: 'إنشائي',
    civil: 'مدني',
    mechanical: 'ميكانيكي',
    electrical: 'كهربائي',
    hvac: 'تكييف',
    geotechnical: 'جيوتقني',
    environmental: 'بيئي',
    materials: 'مواد',
    design: 'تصميم',
    analysis: 'تحليل',
    
    // Pro Features
    proFeature: 'هذه ميزة متقدمة. قم بالترقية للوصول إلى الحاسبات الهندسية المتقدمة.',
    upgradeNow: 'ترقية الآن',
    
    // Empty States
    noCalculatorsFound: 'لم يتم العثور على حاسبات',
    tryDifferentCategory: 'جرب اختيار فئة مختلفة أو استخدم وظيفة البحث للعثور على حاسبات محددة.',
    
    // Common
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    apply: 'تطبيق',
    reset: 'إعادة تعيين'
  },
  zh: {
    // Header
    appTitle: '建筑计算器',
    appSubtitle: '工程工具包',
    tagline: '为全球专业人士提供精密工程解决方案',
    
    // Navigation
    allTools: '所有工具',
    quantity: '数量计算器',
    area: '面积计算器',
    volume: '体积计算器',
    converter: '单位转换器',
    proTools: '专业工具',
    
    // Search
    searchPlaceholder: '搜索计算器...',
    searchStart: '开始输入以搜索我们的工程计算器',
    noResults: '未找到匹配的计算器',
    
    // Categories
    allEngineering: '所有工程计算器',
    allDescription: '为建筑师、土木工程师和建筑专业人士提供的专业工具',
    proDescription: '用于专业分析和设计的高级工程计算器',
    specializesCalculators: '专门的计算器用于',
    calculations: '计算',
    
    // Popular & Recent
    popularCalculators: '热门计算器',
    recentlyUsed: '最近使用',
    noRecentCalculators: '没有最近使用的计算器',
    startUsing: '开始使用计算器以在此处查看它们',
    
    // Settings
    settings: '设置',
    language: '语言',
    theme: '主题',
    unitSystem: '单位系统',
    aboutUs: '关于我们',
    ourMission: '我们的使命',
    contactDeveloper: '联系开发者',
    
    // Unit Systems
    metric: '公制',
    imperial: '英制',
    metricDesc: '米、千克、摄氏度',
    imperialDesc: '英尺、磅、华氏度',
    
    // Themes
    defaultTheme: '默认',
    oceanTheme: '海洋蓝',
    forestTheme: '森林绿',
    sunsetTheme: '日落橙',
    purpleTheme: '皇家紫',
    
    // About & Mission
    aboutTitle: '关于建筑计算器',
    aboutContent: '建筑计算器是为全球建筑师、土木工程师和建筑专业人士设计的综合工程工具包。我们的平台提供现代工程实践所必需的准确、可靠的计算。',
    missionTitle: '我们的使命',
    missionContent: '通过精确、易用的计算工具赋能全球工程专业人士，提高生产力，确保准确性，并支持所有工程学科的创新设计解决方案。',
    
    // Contact
    contactTitle: '联系开发者',
    contactContent: '有问题、建议或需要支持？我们很乐意听取您的意见。',
    emailDeveloper: '发邮件给开发者',
    
    // Tags
    structural: '结构',
    civil: '土木',
    mechanical: '机械',
    electrical: '电气',
    hvac: '暖通空调',
    geotechnical: '岩土',
    environmental: '环境',
    materials: '材料',
    design: '设计',
    analysis: '分析',
    
    // Pro Features
    proFeature: '这是专业功能。升级以访问高级工程计算器。',
    upgradeNow: '立即升级',
    
    // Empty States
    noCalculatorsFound: '未找到计算器',
    tryDifferentCategory: '尝试选择不同的类别或使用搜索功能查找特定的计算器。',
    
    // Common
    close: '关闭',
    save: '保存',
    cancel: '取消',
    apply: '应用',
    reset: '重置'
  },
  es: {
    // Header
    appTitle: 'Calculadora Arquitectónica',
    appSubtitle: 'Kit de Herramientas de Ingeniería',
    tagline: 'Soluciones de Ingeniería de Precisión para Profesionales Globales',
    
    // Navigation
    allTools: 'Todas las Herramientas',
    quantity: 'Calculadoras de Cantidad',
    area: 'Calculadoras de Área',
    volume: 'Calculadoras de Volumen',
    converter: 'Convertidores de Unidades',
    proTools: 'Herramientas Pro',
    
    // Search
    searchPlaceholder: 'Buscar calculadoras...',
    searchStart: 'Comience a escribir para buscar en nuestras calculadoras de ingeniería',
    noResults: 'No se encontraron calculadoras que coincidan',
    
    // Categories
    allEngineering: 'Todas las Calculadoras de Ingeniería',
    allDescription: 'Herramientas profesionales para arquitectos, ingenieros civiles y profesionales de la construcción',
    proDescription: 'Calculadoras de ingeniería avanzadas para análisis y diseño profesional',
    specializesCalculators: 'calculadoras especializadas para',
    calculations: 'cálculos',
    
    // Popular & Recent
    popularCalculators: 'Calculadoras Populares',
    recentlyUsed: 'Usadas Recientemente',
    noRecentCalculators: 'No hay calculadoras usadas recientemente',
    startUsing: 'Comience a usar calculadoras para verlas aquí',
    
    // Settings
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    unitSystem: 'Sistema de Unidades',
    aboutUs: 'Acerca de Nosotros',
    ourMission: 'Nuestra Misión',
    contactDeveloper: 'Contactar Desarrollador',
    
    // Unit Systems
    metric: 'Métrico',
    imperial: 'Imperial',
    metricDesc: 'Metros, kilogramos, Celsius',
    imperialDesc: 'Pies, libras, Fahrenheit',
    
    // Themes
    defaultTheme: 'Predeterminado',
    oceanTheme: 'Azul Océano',
    forestTheme: 'Verde Bosque',
    sunsetTheme: 'Naranja Atardecer',
    purpleTheme: 'Púrpura Real',
    
    // About & Mission
    aboutTitle: 'Acerca de Calculadora Arquitectónica',
    aboutContent: 'Calculadora Arquitectónica es un kit de herramientas de ingeniería integral diseñado para arquitectos, ingenieros civiles y profesionales de la construcción en todo el mundo. Nuestra plataforma proporciona cálculos precisos y confiables esenciales para la práctica de ingeniería moderna.',
    missionTitle: 'Nuestra Misión',
    missionContent: 'Empoderar a los profesionales de ingeniería globalmente con herramientas de cálculo precisas y accesibles que mejoren la productividad, aseguren la precisión y apoyen soluciones de diseño innovadoras en todas las disciplinas de ingeniería.',
    
    // Contact
    contactTitle: 'Contactar Desarrollador',
    contactContent: '¿Tiene preguntas, sugerencias o necesita soporte? Nos encantaría escuchar de usted.',
    emailDeveloper: 'Enviar Email al Desarrollador',
    
    // Tags
    structural: 'Estructural',
    civil: 'Civil',
    mechanical: 'Mecánico',
    electrical: 'Eléctrico',
    hvac: 'HVAC',
    geotechnical: 'Geotécnico',
    environmental: 'Ambiental',
    materials: 'Materiales',
    design: 'Diseño',
    analysis: 'Análisis',
    
    // Pro Features
    proFeature: 'Esta es una característica Pro. Actualice para acceder a calculadoras de ingeniería avanzadas.',
    upgradeNow: 'Actualizar Ahora',
    
    // Empty States
    noCalculatorsFound: 'No se encontraron calculadoras',
    tryDifferentCategory: 'Intente seleccionar una categoría diferente o use la función de búsqueda para encontrar calculadoras específicas.',
    
    // Common
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    apply: 'Aplicar',
    reset: 'Restablecer'
  },
  hi: {
    // Header
    appTitle: 'आर्क कैलकुलेटर',
    appSubtitle: 'इंजीनियरिंग टूलकिट',
    tagline: 'वैश्विक पेशेवरों के लिए सटीक इंजीनियरिंग समाधान',
    
    // Navigation
    allTools: 'सभी उपकरण',
    quantity: 'मात्रा कैलकुलेटर',
    area: 'क्षेत्रफल कैलकुलेटर',
    volume: 'आयतन कैलकुलेटर',
    converter: 'यूनिट कन्वर्टर',
    proTools: 'प्रो टूल्स',
    
    // Search
    searchPlaceholder: 'कैलकुलेटर खोजें...',
    searchStart: 'हमारे इंजीनियरिंग कैलकुलेटर खोजने के लिए टाइप करना शुरू करें',
    noResults: 'मेल खाने वाले कैलकुलेटर नहीं मिले',
    
    // Categories
    allEngineering: 'सभी इंजीनियरिंग कैलकुलेटर',
    allDescription: 'आर्किटेक्ट्स, सिविल इंजीनियर्स और निर्माण पेशेवरों के लिए पेशेवर उपकरण',
    proDescription: 'पेशेवर विश्लेषण और डिजाइन के लिए उन्नत इंजीनियरिंग कैलकुलेटर',
    specializesCalculators: 'के लिए विशेष कैलकुलेटर',
    calculations: 'गणना',
    
    // Popular & Recent
    popularCalculators: 'लोकप्रिय कैलकुलेटर',
    recentlyUsed: 'हाल ही में उपयोग किए गए',
    noRecentCalculators: 'कोई हाल ही में उपयोग किए गए कैलकुलेटर नहीं',
    startUsing: 'उन्हें यहाँ देखने के लिए कैलकुलेटर का उपयोग शुरू करें',
    
    // Settings
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    unitSystem: 'यूनिट सिस्टम',
    aboutUs: 'हमारे बारे में',
    ourMission: 'हमारा मिशन',
    contactDeveloper: 'डेवलपर से संपर्क करें',
    
    // Unit Systems
    metric: 'मेट्रिक',
    imperial: 'इम्पीरियल',
    metricDesc: 'मीटर, किलोग्राम, सेल्सियस',
    imperialDesc: 'फीट, पाउंड, फारेनहाइट',
    
    // Themes
    defaultTheme: 'डिफ़ॉल्ट',
    oceanTheme: 'समुद्री नीला',
    forestTheme: 'वन हरा',
    sunsetTheme: 'सूर्यास्त नारंगी',
    purpleTheme: 'शाही बैंगनी',
    
    // About & Mission
    aboutTitle: 'आर्क कैलकुलेटर के बारे में',
    aboutContent: 'आर्क कैलकुलेटर दुनिया भर के आर्किटेक्ट्स, सिविल इंजीनियर्स और निर्माण पेशेवरों के लिए डिज़ाइन किया गया एक व्यापक इंजीनियरिंग टूलकिट है। हमारा प्लेटफॉर्म आधुनिक इंजीनियरिंग अभ्यास के लिए आवश्यक सटीक, विश्वसनीय गणना प्रदान करता है।',
    missionTitle: 'हमारा मिशन',
    missionContent: 'सटीक, सुलभ गणना उपकरणों के साथ वैश्विक स्तर पर इंजीनियरिंग पेशेवरों को सशक्त बनाना जो उत्पादकता बढ़ाते हैं, सटीकता सुनिश्चित करते हैं, और सभी इंजीनियरिंग विषयों में नवाचार डिजाइन समाधानों का समर्थन करते हैं।',
    
    // Contact
    contactTitle: 'डेवलपर से संपर्क करें',
    contactContent: 'क्या आपके पास प्रश्न, सुझाव हैं या सहायता की आवश्यकता है? हम आपसे सुनना पसंद करेंगे।',
    emailDeveloper: 'डेवलपर को ईमेल करें',
    
    // Tags
    structural: 'संरचनात्मक',
    civil: 'सिविल',
    mechanical: 'मैकेनिकल',
    electrical: 'इलेक्ट्रिकल',
    hvac: 'एचवीएसी',
    geotechnical: 'भू-तकनीकी',
    environmental: 'पर्यावरणीय',
    materials: 'सामग्री',
    design: 'डिजाइन',
    analysis: 'विश्लेषण',
    
    // Pro Features
    proFeature: 'यह एक प्रो फीचर है। उन्नत इंजीनियरिंग कैलकुलेटर तक पहुंचने के लिए अपग्रेड करें।',
    upgradeNow: 'अभी अपग्रेड करें',
    
    // Empty States
    noCalculatorsFound: 'कोई कैलकुलेटर नहीं मिला',
    tryDifferentCategory: 'एक अलग श्रेणी का चयन करने का प्रयास करें या विशिष्ट कैलकुलेटर खोजने के लिए खोज फ़ंक्शन का उपयोग करें।',
    
    // Common
    close: 'बंद करें',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    apply: 'लागू करें',
    reset: 'रीसेट करें'
  },
  fr: {
    // Header
    appTitle: 'Calculatrice Architecturale',
    appSubtitle: 'Boîte à Outils d\'Ingénierie',
    tagline: 'Solutions d\'Ingénierie de Précision pour les Professionnels Mondiaux',
    
    // Navigation
    allTools: 'Tous les Outils',
    quantity: 'Calculatrices de Quantité',
    area: 'Calculatrices de Surface',
    volume: 'Calculatrices de Volume',
    converter: 'Convertisseurs d\'Unités',
    proTools: 'Outils Pro',
    
    // Search
    searchPlaceholder: 'Rechercher des calculatrices...',
    searchStart: 'Commencez à taper pour rechercher dans nos calculatrices d\'ingénierie',
    noResults: 'Aucune calculatrice trouvée correspondant à',
    
    // Categories
    allEngineering: 'Toutes les Calculatrices d\'Ingénierie',
    allDescription: 'Outils professionnels pour architectes, ingénieurs civils et professionnels de la construction',
    proDescription: 'Calculatrices d\'ingénierie avancées pour l\'analyse et la conception professionnelles',
    specializesCalculators: 'calculatrices spécialisées pour',
    calculations: 'calculs',
    
    // Popular & Recent
    popularCalculators: 'Calculatrices Populaires',
    recentlyUsed: 'Récemment Utilisées',
    noRecentCalculators: 'Aucune calculatrice récemment utilisée',
    startUsing: 'Commencez à utiliser des calculatrices pour les voir ici',
    
    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    unitSystem: 'Système d\'Unités',
    aboutUs: 'À Propos de Nous',
    ourMission: 'Notre Mission',
    contactDeveloper: 'Contacter le Développeur',
    
    // Unit Systems
    metric: 'Métrique',
    imperial: 'Impérial',
    metricDesc: 'Mètres, kilogrammes, Celsius',
    imperialDesc: 'Pieds, livres, Fahrenheit',
    
    // Themes
    defaultTheme: 'Par Défaut',
    oceanTheme: 'Bleu Océan',
    forestTheme: 'Vert Forêt',
    sunsetTheme: 'Orange Coucher de Soleil',
    purpleTheme: 'Violet Royal',
    
    // About & Mission
    aboutTitle: 'À Propos de Calculatrice Architecturale',
    aboutContent: 'Calculatrice Architecturale est une boîte à outils d\'ingénierie complète conçue pour les architectes, ingénieurs civils et professionnels de la construction du monde entier. Notre plateforme fournit des calculs précis et fiables essentiels à la pratique de l\'ingénierie moderne.',
    missionTitle: 'Notre Mission',
    missionContent: 'Autonomiser les professionnels de l\'ingénierie mondialement avec des outils de calcul précis et accessibles qui améliorent la productivité, assurent la précision et soutiennent des solutions de conception innovantes dans toutes les disciplines d\'ingénierie.',
    
    // Contact
    contactTitle: 'Contacter le Développeur',
    contactContent: 'Avez-vous des questions, des suggestions ou besoin de support ? Nous aimerions avoir de vos nouvelles.',
    emailDeveloper: 'Envoyer un Email au Développeur',
    
    // Tags
    structural: 'Structurel',
    civil: 'Civil',
    mechanical: 'Mécanique',
    electrical: 'Électrique',
    hvac: 'CVC',
    geotechnical: 'Géotechnique',
    environmental: 'Environnemental',
    materials: 'Matériaux',
    design: 'Conception',
    analysis: 'Analyse',
    
    // Pro Features
    proFeature: 'Ceci est une fonctionnalité Pro. Mettez à niveau pour accéder aux calculatrices d\'ingénierie avancées.',
    upgradeNow: 'Mettre à Niveau Maintenant',
    
    // Empty States
    noCalculatorsFound: 'Aucune calculatrice trouvée',
    tryDifferentCategory: 'Essayez de sélectionner une catégorie différente ou utilisez la fonction de recherche pour trouver des calculatrices spécifiques.',
    
    // Common
    close: 'Fermer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    apply: 'Appliquer',
    reset: 'Réinitialiser'
  }
};