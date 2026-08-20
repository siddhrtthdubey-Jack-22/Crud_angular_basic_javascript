import { PersonaService } from './persona.service';

describe('PersonaService', () => {
  let service: PersonaService;

  beforeEach(() => {
    localStorage.clear();
    service = new PersonaService();
  });

  it('returns sample personas when storage is empty', () => {
    expect(service.list().length).toBe(2);
  });

  it('creates, updates, and deletes a persona', () => {
    const created = service.create({
      name: 'Coach',
      role: 'Career coach',
      tone: 'Friendly',
      description: 'Helps with career planning.',
      systemPrompt: 'You are a career coach.',
    });

    expect(service.getById(created.id)?.name).toBe('Coach');

    service.update(created.id, {
      name: 'Career Coach',
      role: 'Career coach',
      tone: 'Professional',
      description: 'Helps with career planning.',
      systemPrompt: 'You are a career coach.',
    });

    expect(service.getById(created.id)?.tone).toBe('Professional');

    service.remove(created.id);
    expect(service.getById(created.id)).toBeUndefined();
  });
});
