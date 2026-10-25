export interface IeltsTopic {
  id: string;
  title: string;
  part: 'Part 1' | 'Part 2' | 'Part 3';
  category: string;
  questions: string[];
  cueCard?: {
    topic: string;
    bulletPoints: string[];
    prepTimeSec: number;
    speakTimeSec: number;
  };
  sampleVocab: string[];
}

export const IELTS_TOPICS: IeltsTopic[] = [
  {
    id: 'ielts-1',
    title: 'Hometown & Living Environment',
    part: 'Part 1',
    category: 'Daily Life',
    questions: [
      'Where is your hometown, and what do you like most about it?',
      'Has your hometown changed much since you were a child?',
      'Do you prefer living in a bustling city or a tranquil countryside? Why?',
    ],
    sampleVocab: ['bustling metropolis', 'picturesque scenery', 'amenities', 'tranquil atmosphere'],
  },
  {
    id: 'ielts-2',
    title: 'Describe an Ambitious Goal You Achieved',
    part: 'Part 2',
    category: 'Personal Achievement',
    questions: [],
    cueCard: {
      topic: 'Describe a goal that you set and achieved successfully.',
      bulletPoints: [
        'What the goal was and when you set it',
        'What steps or hurdles you faced while striving for it',
        'Who supported or encouraged you',
        'And explain how you felt when you finally reached this goal',
      ],
      prepTimeSec: 60,
      speakTimeSec: 120,
    },
    sampleVocab: ['unwavering dedication', 'surmount obstacles', 'sense of accomplishment', 'milestone'],
  },
  {
    id: 'ielts-3',
    title: 'Artificial Intelligence and Future Employment',
    part: 'Part 3',
    category: 'Technology & Society',
    questions: [
      'How do you think automation and AI will transform the job market in the next decade?',
      'Should schools teach children more coding and AI skills, or soft communication skills?',
      'Can computers ever completely replace human creativity and empathy?',
    ],
    sampleVocab: ['paradigm shift', 'technological redundancy', 'adaptability', 'indispensable human intuition'],
  },
  {
    id: 'ielts-4',
    title: 'Environmental Protection & Sustainable Living',
    part: 'Part 3',
    category: 'Environment',
    questions: [
      'What can individuals do on a daily basis to reduce their carbon footprint?',
      'Do you think governments or large corporations bear the biggest responsibility for global warming?',
      'How can renewable energy sources be promoted more effectively in developing countries?',
    ],
    sampleVocab: ['carbon footprint', 'renewable energy', 'collective accountability', 'sustainable practices'],
  },
];
