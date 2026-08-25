export interface Persona {
  id: string;
  name: string;
  role: string;
  tone: string;
  description: string;
  systemPrompt: string;
  color: string;
}

export const PERSONA_TONES = [
  'Friendly',
  'Professional',
  'Concise',
  'Playful',
  'Formal',
] as const;

export type PersonaTone = (typeof PERSONA_TONES)[number];
