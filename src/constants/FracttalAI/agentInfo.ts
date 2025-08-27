export type AgentsType =
  | 'GENERAL'
  | 'WORK_ORDERS'
  | 'METERS'
  | 'ASSETS'
  | 'REQUESTS'
  | 'PLAN_TASKS';

export const agentInfo: Record<
  AgentsType,
  {
    header: string;
    intro: string;
    instructions?: string;
    placeholder?: string;
    subheader?: string;
    cards?: {
      prompt: string;
      icon: string;
    }[];
  }
> = {
  GENERAL: {
    header: 'GENERAL',
    intro: 'AI_GENERAL_INTRO',
    placeholder: 'IA_PLACEHOLDER',
    subheader: 'AI_GENERAL_SUBHEADER',
    instructions: 'AI_GENERAL_INSTRUCTIONS',
    cards: [
      {
        prompt: 'GENERAL_PROMPT_1',
        icon: 'map',
      },
      {
        prompt: 'GENERAL_PROMPT_2',
        icon: 'notes',
      },
      {
        prompt: 'GENERAL_PROMPT_3',
        icon: 'calendar',
      },
      {
        prompt: 'GENERAL_PROMPT_4',
        icon: 'clipboard_clock',
      },
    ],
  },
  REQUESTS: {
    header: 'REQUESTS',
    intro: 'AI_REQUESTS_INTRO',
    placeholder: 'IA_PLACEHOLDER',
    subheader: 'AI_REQUESTS_SUBHEADER',
    instructions: 'AI_REQUESTS_INSTRUCTIONS',
    cards: [
      {
        prompt: 'REQUESTS_PROMPT_1',
        icon: 'map',
      },
      {
        prompt: 'REQUESTS_PROMPT_2',
        icon: 'notes',
      },
    ],
  },
  WORK_ORDERS: {
    header: 'WORK_ORDERS',
    intro: 'AI_WORK_ORDERS_INTRO',
    instructions: 'AI_WORK_ORDERS_INSTRUCTIONS',
    placeholder: 'AI_WORK_ORDERS_PLACEHOLDER',
    subheader: 'AI_WORK_ORDERS_SUBHEADER',
    cards: [],
  },
  METERS: {
    header: 'METERS',
    intro: 'AI_WORK_METERS_INTRO',
    instructions: 'AI_WORK_METERS_INTRO',
    placeholder: 'AI_WORK_METERS_PLACEHOLDER',
    subheader: 'AI_WORK_METERS_SUBHEADER',
    cards: [
      {
        prompt: 'METERS_PROMPT_1',
        icon: 'clipboard_clock',
      },
      {
        prompt: 'METERS_PROMPT_2',
        icon: 'clipboard_text',
      },
    ],
  },
  ASSETS: {
    header: 'ASSETS',
    intro: 'AI_ASSETS_INTRO',
    instructions: 'AI_ASSETS_INTRO',
    placeholder: '',
    subheader: 'AI_ASSETS_SUBHEADER',
    cards: [
      {
        prompt: 'ASSETS_PROMPT_1',
        icon: 'clipboard_clock',
      },
      {
        prompt: 'ASSETS_PROMPT_2',
        icon: 'clipboard_text',
      },
    ],
  },
  PLAN_TASKS: {
    header: 'PLAN_TASKS',
    intro: 'AI_PLAN_TASKS_INTRO',
    instructions: 'AI_PLAN_TASKS_INSTRUCTIONS',
    placeholder: 'AI_PLAN_TASKS_PLACEHOLDER',
    subheader: 'AI_PLAN_TASKS_SUBHEADER',
    cards: [
      {
        prompt: 'PLAN_TASKS_PROMPT_1',
        icon: 'clipboard_clock',
      },
      {
        prompt: 'PLAN_TASKS_PROMPT_2',
        icon: 'clipboard_text',
      },
    ],
  },
};

export type ContextTypeAI = 'detail' | 'list';
