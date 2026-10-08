import { FurnitureItem, PlacedFurniture, CampusLocation, StreetNPC, PhoneMessage, HustleJob } from '../types/game';

export const INITIAL_FURNITURE_CATALOG: FurnitureItem[] = [
  // COMFORT
  {
    id: 'plastic_chair',
    name: 'Plastic Chair',
    category: 'comfort',
    price: 500,
    dimensions: '1x1',
    description: 'Classic campus staple. Reliable and indestructible.',
    iconName: 'Armchair',
    color: '#e63946',
    modelType: 'chair',
    actions: [
      {
        id: 'sit_study',
        label: 'Sit & Gist',
        tag: '+Social',
        durationSeconds: 5,
        effect: { fun: 10, social: 15, energy: 5 },
        animation: 'sit'
      }
    ]
  },
  {
    id: 'velvet_sofa',
    name: 'Velvet Sofa',
    category: 'comfort',
    price: 10200,
    dimensions: '2x1',
    description: 'Mummy-approved. Keep the nylon on? Your choice.',
    iconName: 'Sofa',
    color: '#2a9d8f',
    modelType: 'sofa',
    actions: [
      {
        id: 'relax_sofa',
        label: 'Kick Back & Relax',
        tag: '+Energy +Fun',
        durationSeconds: 7,
        effect: { energy: 20, fun: 15 },
        animation: 'sit'
      },
      {
        id: 'nap_sofa',
        label: 'Nap on Sofa',
        tag: '+Energy',
        durationSeconds: 10,
        effect: { energy: 35 },
        animation: 'sleep'
      },
      {
        id: 'gist_phone',
        label: 'Gist on Phone',
        tag: '+Social',
        durationSeconds: 6,
        effect: { social: 25, fun: 15 },
        animation: 'relax'
      },
      {
        id: 'sit_chill',
        label: 'Sit & Chill',
        tag: '+Fun',
        durationSeconds: 5,
        effect: { fun: 10, energy: 10 },
        animation: 'sit'
      }
    ]
  },
  {
    id: 'seater_sofa',
    name: '3-Seater Family Sofa',
    category: 'comfort',
    price: 24000,
    dimensions: '3x1',
    description: 'Spacious leather sofa for the whole crew.',
    iconName: 'Sofa',
    color: '#d4a373',
    modelType: 'sofa',
    actions: [
      {
        id: 'big_chill',
        label: 'Host Friends & Gist',
        tag: '+Social +Fun',
        durationSeconds: 8,
        effect: { social: 30, fun: 25 },
        animation: 'sit'
      }
    ]
  },
  {
    id: 'standing_fan',
    name: 'Standing Fan',
    category: 'comfort',
    price: 2200,
    dimensions: '1x1',
    description: 'Essential Nigerian life saver when NEPA is smiling.',
    iconName: 'Fan',
    color: '#457b9d',
    modelType: 'fan',
    actions: [
      {
        id: 'cool_breeze',
        label: 'Enjoy High Speed Breeze',
        tag: '+Fun +Energy',
        durationSeconds: 5,
        effect: { energy: 15, fun: 10 },
        animation: 'relax'
      }
    ]
  },
  {
    id: 'dining_table',
    name: 'Round Dining Table',
    category: 'comfort',
    price: 8500,
    dimensions: '2x2',
    description: 'Wooden study and dining table with 2 seats.',
    iconName: 'UtensilsCrossed',
    color: '#bc6c25',
    modelType: 'table',
    actions: [
      {
        id: 'eat_jollof',
        label: 'Eat Jollof Rice & Plantain',
        tag: '+Hunger +Energy',
        durationSeconds: 6,
        effect: { hunger: 40, energy: 15 },
        animation: 'eat'
      },
      {
        id: 'group_study',
        label: 'Study Course Notes',
        tag: '+Skills',
        durationSeconds: 8,
        effect: { skill: 'coding', skillGain: 2, fun: -5 },
        animation: 'study'
      }
    ]
  },
  {
    id: 'split_ac',
    name: 'Split Air Conditioner',
    category: 'comfort',
    price: 65000,
    dimensions: '1x1',
    description: 'Pure luxury! Cool chilled room like London.',
    iconName: 'Wind',
    color: '#f8f9fa',
    modelType: 'ac',
    actions: [
      {
        id: 'ac_chill',
        label: 'Chill in 16°C Air',
        tag: '+Energy +Fun',
        durationSeconds: 6,
        effect: { energy: 25, fun: 20 },
        animation: 'relax'
      }
    ]
  },

  // SLEEP
  {
    id: 'foam_mattress',
    name: 'Student Foam Mattress',
    category: 'sleep',
    price: 4500,
    dimensions: '2x1',
    description: 'Foam on the floor. It does the job nicely.',
    iconName: 'BedDouble',
    color: '#60a5fa',
    modelType: 'bed',
    actions: [
      {
        id: 'deep_sleep',
        label: 'Sleep',
        tag: '+Energy',
        durationSeconds: 10,
        effect: { energy: 60, hunger: -15 },
        animation: 'sleep'
      },
      {
        id: 'power_nap',
        label: 'Take a Nap',
        tag: '+Energy',
        durationSeconds: 6,
        effect: { energy: 25 },
        animation: 'sleep'
      },
      {
        id: 'stay_in_bed',
        label: 'Stay in Bed & Browse Phone',
        tag: '+Fun',
        durationSeconds: 7,
        effect: { fun: 20, energy: 10 },
        animation: 'sleep'
      }
    ]
  },

  // BATH
  {
    id: 'bucket_bowl',
    name: 'Bucket & Bowl',
    category: 'bath',
    price: 600,
    dimensions: '1x1',
    description: 'The original Lagos and campus shower ritual.',
    iconName: 'Bath',
    color: '#0284c7',
    modelType: 'bucket',
    actions: [
      {
        id: 'bucket_bath',
        label: 'Take Bucket Bath',
        tag: '+Hygiene +Energy',
        durationSeconds: 7,
        effect: { hygiene: 70, energy: 20 },
        animation: 'bath'
      }
    ]
  },
  {
    id: 'wc_toilet',
    name: 'WC Toilet',
    category: 'bath',
    price: 9000,
    dimensions: '1x1',
    description: 'Flushes most of the time when water is running.',
    iconName: 'Sparkles',
    color: '#f1f5f9',
    modelType: 'toilet',
    actions: [
      {
        id: 'use_toilet',
        label: 'Use Toilet',
        tag: '+Bladder',
        durationSeconds: 5,
        effect: { bladder: 80, hygiene: -10 },
        animation: 'toilet'
      }
    ]
  },

  // LIGHT
  {
    id: 'rechargeable_lantern',
    name: 'Rechargeable LED Lantern',
    category: 'light',
    price: 1800,
    dimensions: '1x1',
    description: 'NEPA proof! Illuminates the entire room in darkness.',
    iconName: 'Lamp',
    color: '#eab308',
    modelType: 'lantern',
    actions: [
      {
        id: 'turn_on_lantern',
        label: 'Switch on Emergency Light',
        tag: '+Fun',
        durationSeconds: 3,
        effect: { fun: 10 },
        animation: 'relax'
      }
    ]
  },

  // SKILLS & FUN
  {
    id: 'study_desk_laptop',
    name: 'Study Desk & Laptop',
    category: 'skills',
    price: 18500,
    dimensions: '2x1',
    description: 'AFUED Tech Bro setup for coding and remote hustle.',
    iconName: 'Laptop',
    color: '#334155',
    modelType: 'desk',
    actions: [
      {
        id: 'code_react',
        label: 'Write Code & Freelance',
        tag: '+Coding +₦5,000',
        durationSeconds: 8,
        effect: { skill: 'coding', skillGain: 5, money: 5000, energy: -20, fun: 10 },
        animation: 'study'
      },
      {
        id: 'whatsapp_vendor',
        label: 'Sell on WhatsApp Status',
        tag: '+Hustle +₦3,000',
        durationSeconds: 6,
        effect: { skill: 'hustle', skillGain: 4, money: 3000, energy: -10, social: 15 },
        animation: 'study'
      }
    ]
  },
  {
    id: 'mini_generator',
    name: '"I Better Pass My Neighbor" Gen',
    category: 'skills',
    price: 28000,
    dimensions: '1x1',
    description: 'Tiger mini generator. Roars proudly on the balcony!',
    iconName: 'Zap',
    color: '#dc2626',
    modelType: 'generator',
    actions: [
      {
        id: 'pull_gen',
        label: 'Pull Cord & Start Gen',
        tag: '+Light +Fun',
        durationSeconds: 6,
        effect: { fun: 20, energy: -10 },
        animation: 'relax'
      }
    ]
  },
  {
    id: 'smart_tv',
    name: '43" Flat Screen TV',
    category: 'fun',
    price: 35000,
    dimensions: '1x1',
    description: 'Watch Premier League & Nollywood blockbusters.',
    iconName: 'Tv',
    color: '#1e293b',
    modelType: 'tv',
    actions: [
      {
        id: 'watch_match',
        label: 'Watch Premier League',
        tag: '+Fun +Social',
        durationSeconds: 8,
        effect: { fun: 35, social: 15, energy: 10 },
        animation: 'relax'
      }
    ]
  }
];

export const INITIAL_PLACED_FURNITURE: PlacedFurniture[] = [
  { instanceId: 'init_sofa', furnitureId: 'velvet_sofa', x: -2.8, z: 1.8, rotation: 0 },
  { instanceId: 'init_mattress', furnitureId: 'foam_mattress', x: -1.2, z: -3.0, rotation: 0 },
  { instanceId: 'init_chair', furnitureId: 'plastic_chair', x: 0.2, z: -0.5, rotation: 0 },
  { instanceId: 'init_table', furnitureId: 'dining_table', x: 2.2, z: 0.8, rotation: 0 },
  { instanceId: 'init_bucket', furnitureId: 'bucket_bowl', x: 3.2, z: -2.8, rotation: 0 },
  { instanceId: 'init_toilet', furnitureId: 'wc_toilet', x: 3.2, z: -1.5, rotation: 0 },
  { instanceId: 'init_fan', furnitureId: 'standing_fan', x: -3.2, z: -0.8, rotation: 0 },
  { instanceId: 'init_desk', furnitureId: 'study_desk_laptop', x: 2.2, z: -3.0, rotation: 0 },
  { instanceId: 'init_lantern', furnitureId: 'rechargeable_lantern', x: -0.8, z: 2.6, rotation: 0 }
];

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'hostel',
    name: 'My Hostel Room',
    zone: 'Mushin / Ondo Close',
    description: 'Home sweet home. Your personal sanctuary and study zone.',
    coordinates: { x: 15, y: 70 },
    activities: ['Rest', 'Decorate', 'Recharge', 'Host friends']
  },
  {
    id: 'gate',
    name: 'AFUED Main Gate',
    zone: 'Campus Boulevard',
    description: 'The monumental entrance. Bustling with Okada riders and students.',
    coordinates: { x: 42, y: 65 },
    activities: ['Take Okada', 'Meet friends', 'Buy gala & cold drinks']
  },
  {
    id: 'quadrangle',
    name: 'Central Quadrangle & Senate',
    zone: 'Academic Core',
    description: 'Heart of campus life. Green lawns and student hustlers.',
    coordinates: { x: 50, y: 48 },
    activities: ['Network', 'Attend rallies', 'Listen to gospel band']
  },
  {
    id: 'library',
    name: 'University Library & ETF Hall',
    zone: 'Academic Core',
    description: 'Air conditioned haven of knowledge. First class aspirants gather here.',
    coordinates: { x: 62, y: 40 },
    activities: ['Study hard', 'Level up Coding', 'Research project']
  },
  {
    id: 'bukka',
    name: 'Mama Put Food Court & Bukka',
    zone: 'Student Commercial Area',
    description: 'Aroma of steaming hot Amala with Gbegiri, Jollof and Suya.',
    coordinates: { x: 35, y: 35 },
    activities: ['Eat hot Amala', 'Order cold Zobo', 'Socialize']
  },
  {
    id: 'tejuosho',
    name: 'Tejuosho Campus Market',
    zone: 'Market Square',
    description: 'Everything is here. Haggle for sneakers, textbooks, and Ankara fabrics.',
    coordinates: { x: 75, y: 55 },
    activities: ['Shop for clothes', 'Buy gadgets', 'Bargain with Alhaji']
  },
  {
    id: 'tech_hub',
    name: 'YabaTech / AFUED Tech Hub',
    zone: 'Innovation Corridor',
    description: 'High-speed fiber WiFi, startup pitches, and future unicorn founders.',
    coordinates: { x: 55, y: 22 },
    activities: ['Pitch startup', 'Hackathon coding', 'Investor meet']
  },
  {
    id: 'elegushi',
    name: 'Elegushi Beach & Park',
    zone: 'Island Weekend Spot',
    description: 'Atlantic ocean breeze, horse rides, grilled fish, and afrobeats music.',
    coordinates: { x: 88, y: 80 },
    activities: ['Chill by waves', 'Dance to Asake', 'Take photos']
  }
];

export const STREET_NPCS: StreetNPC[] = [
  {
    id: 'pure_water_hawker',
    name: 'Hawker: "Oyinbo Pure Water!"',
    role: 'Street Hawker',
    dialogue: 'Bros, cold pure water dey! Ice water ₦100!',
    actionLabel: 'Buy Water (₦100)',
    actionCost: 100,
    effect: { hunger: 10, energy: 15 },
    x: -12,
    z: 1.5
  },
  {
    id: 'gala_seller',
    name: 'Gala & LaCasera Boy',
    role: 'Snack Vendor',
    dialogue: 'Hot sausage roll and chilled LaCasera to hold body!',
    actionLabel: 'Buy Gala & Drink (₦500)',
    actionCost: 500,
    effect: { hunger: 35, energy: 20 },
    x: 0,
    z: 2
  },
  {
    id: 'okada_man',
    name: 'Rider: Baba Kasali',
    role: 'Okada Rider',
    dialogue: 'Tejuosho market sharp sharp? Climb motorcycle make we go!',
    actionLabel: 'Ride Okada (₦250)',
    actionCost: 250,
    effect: { fun: 15, energy: 5 },
    x: 10,
    z: -1.2
  },
  {
    id: 'course_rep',
    name: 'Course Rep Tolu',
    role: 'Faculty Leader',
    dialogue: 'Dr. Adeleke say test holds today by 4 PM at ETF hall o! You read?',
    actionLabel: 'Gist & Collect Notes',
    effect: { fun: 10 },
    x: 18,
    z: 1.8
  },
  {
    id: 'suya_mallam',
    name: 'Mallam Musa',
    role: 'Suya Master',
    dialogue: 'Spicy beef suya fresh off the grill with raw onions and yaji pepper!',
    actionLabel: 'Buy Suya Wrap (₦1,200)',
    actionCost: 1200,
    effect: { hunger: 60, energy: 30, fun: 25 },
    x: -24,
    z: -1.8
  }
];

export const INITIAL_PHONE_MESSAGES: PhoneMessage[] = [
  {
    id: 'm1',
    sender: 'Mummy ❤️',
    avatar: '👩🏾',
    text: 'My child, have you eaten today? Praying for your exams at AFUED. Don\'t forget to drink water.',
    time: '2:15 PM',
    unread: true,
    replies: ['Yes Mummy, I just ate!', 'Thank you Mummy, love you!']
  },
  {
    id: 'm2',
    sender: 'Course Rep Tolu 📚',
    avatar: '👨🏾‍🏫',
    text: 'Reminder guys! Lecture starts in 30 mins at ETF Hall. Attendance is strictly compulsory.',
    time: '1:45 PM',
    unread: true,
    replies: ['On my way now!', 'Save a seat for me bro']
  },
  {
    id: 'm3',
    sender: 'Roommate Femi ⚡',
    avatar: '😎',
    text: 'NEPA don take light again o! Did you fuel the tiger gen or should I buy ₦1,000 petrol?',
    time: '12:30 PM',
    unread: false,
    replies: ['Buy ₦1k petrol abeg', 'Let me come home first']
  },
  {
    id: 'm4',
    sender: 'Mama Put Bukka 🍲',
    avatar: '🥘',
    text: 'Fresh goat meat and pounded yam just landed! Come sharp before e finish.',
    time: '11:10 AM',
    unread: false,
    replies: ['Keep 2 wraps for me!', 'Coming soon ma!']
  }
];

export const HUSTLE_JOBS: HustleJob[] = [
  {
    id: 'h1',
    title: 'Design Campus Event Flyer',
    client: 'Student Union AFUED',
    payout: 8500,
    energyCost: 15,
    requiredSkill: 'charisma',
    requiredLevel: 1,
    description: 'Create an eye-catching poster for the annual Cultural Fiesta.'
  },
  {
    id: 'h2',
    title: 'Build Department Website Portal',
    client: 'Computer Science Dept',
    payout: 25000,
    energyCost: 30,
    requiredSkill: 'coding',
    requiredLevel: 2,
    description: 'React SPA for uploading lecture slides and department notices.'
  },
  {
    id: 'h3',
    title: 'Record Viral TikTok Skit',
    client: 'Naija Brands Promo',
    payout: 15000,
    energyCost: 20,
    requiredSkill: 'music',
    requiredLevel: 1,
    description: 'Comedy skit about hostel life and NEPA power cuts.'
  },
  {
    id: 'h4',
    title: 'POS Terminal Cash Withdrawal Agent',
    client: 'Campus Square POS',
    payout: 12000,
    energyCost: 25,
    requiredSkill: 'hustle',
    requiredLevel: 2,
    description: 'Run withdrawal services for students during bank network blackout.'
  }
];
