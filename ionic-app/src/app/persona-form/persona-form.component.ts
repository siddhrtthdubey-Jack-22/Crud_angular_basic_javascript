import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/lazy';
import { PERSONA_TONES, Persona } from '../models/persona.model';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss'],
  standalone: false,
})
export class PersonaFormComponent implements OnInit {
  @Input() persona?: Persona;

  tones = PERSONA_TONES;
  isEdit = false;
  form = {
    name: '',
    role: '',
    tone: 'Friendly',
    description: '',
    systemPrompt: '',
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    if (this.persona) {
      this.isEdit = true;
      this.form = {
        name: this.persona.name,
        role: this.persona.role,
        tone: this.persona.tone,
        description: this.persona.description,
        systemPrompt: this.persona.systemPrompt,
      };
    }
  }

  get canSave(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      this.form.role.trim().length > 0 &&
      this.form.description.trim().length > 0 &&
      this.form.systemPrompt.trim().length > 0
    );
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        name: this.form.name.trim(),
        role: this.form.role.trim(),
        tone: this.form.tone,
        description: this.form.description.trim(),
        systemPrompt: this.form.systemPrompt.trim(),
      },
      'confirm'
    );
  }
}
