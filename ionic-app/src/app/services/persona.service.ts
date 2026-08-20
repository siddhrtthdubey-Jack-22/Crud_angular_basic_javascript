import { Injectable } from '@angular/core';
import { Persona } from '../models/persona.model';

const STORAGE_KEY = 'ai-assistant-personas';

const COLORS = ['#4f46e5', '#0f766e', '#b45309', '#be123c', '#0369a1', '#7c3aed'];

const SAMPLE_PERSONAS: Persona[] = [
  {
    id: 'p-1',
    name: 'Code Mentor',
    role: 'Programming tutor',
    tone: 'Friendly',
    description: 'Helps beginners learn JavaScript with small examples.',
    systemPrompt:
      'You are a patient coding tutor. Explain concepts in simple language and show short code snippets.',
    color: '#4f46e5',
  },
  {
    id: 'p-2',
    name: 'Support Desk',
    role: 'Customer support agent',
    tone: 'Professional',
    description: 'Answers product questions clearly and politely.',
    systemPrompt:
      'You are a professional support agent. Be concise, accurate, and empathetic.',
    color: '#0f766e',
  },
];

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  list(): Persona[] {
    return this.load().map((persona) => ({ ...persona }));
  }

  getById(id: string): Persona | undefined {
    const persona = this.load().find((item) => item.id === id);
    return persona ? { ...persona } : undefined;
  }

  search(query: string): Persona[] {
    const text = (query || '').trim().toLowerCase();
    const personas = this.list();
    if (!text) {
      return personas;
    }
    return personas.filter(
      (persona) =>
        persona.name.toLowerCase().includes(text) ||
        persona.role.toLowerCase().includes(text) ||
        persona.tone.toLowerCase().includes(text)
    );
  }

  create(input: Omit<Persona, 'id' | 'color'>): Persona {
    const personas = this.load();
    const persona: Persona = {
      ...input,
      id: 'p-' + Date.now(),
      color: COLORS[personas.length % COLORS.length],
    };
    personas.push(persona);
    this.save(personas);
    return { ...persona };
  }

  update(id: string, input: Omit<Persona, 'id' | 'color'>): Persona | undefined {
    const personas = this.load();
    const index = personas.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    personas[index] = {
      ...personas[index],
      ...input,
    };
    this.save(personas);
    return { ...personas[index] };
  }

  remove(id: string): void {
    this.save(this.load().filter((item) => item.id !== id));
  }

  private load(): Persona[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return SAMPLE_PERSONAS.map((persona) => ({ ...persona }));
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SAMPLE_PERSONAS.map((persona) => ({ ...persona }));
    } catch {
      return SAMPLE_PERSONAS.map((persona) => ({ ...persona }));
    }
  }

  private save(personas: Persona[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
  }
}
