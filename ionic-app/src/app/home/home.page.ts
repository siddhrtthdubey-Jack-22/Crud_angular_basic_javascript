import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular/lazy';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Persona } from '../models/persona.model';
import { PersonaService } from '../services/persona.service';
import { PersonaFormComponent } from '../persona-form/persona-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  searchText = '';
  personas: Persona[] = [];

  constructor(
    private personaService: PersonaService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    this.refresh();
  }

  refresh(): void {
    this.personas = this.personaService.search(this.searchText);
  }

  openDetail(persona: Persona): void {
    this.router.navigate(['/persona', persona.id]);
  }

  async openForm(persona?: Persona): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PersonaFormComponent,
      componentProps: { persona },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role !== 'confirm' || !data) {
      return;
    }
    if (persona) {
      this.personaService.update(persona.id, data);
      await this.notify('Persona updated');
    } else {
      this.personaService.create(data);
      await this.notify('Persona created');
    }
    this.refresh();
  }

  async remove(persona: Persona, event: Event): Promise<void> {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Delete persona',
      message: `Delete persona "${persona.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.personaService.remove(persona.id);
            await this.tap();
            await this.notify('Persona deleted');
            this.refresh();
          },
        },
      ],
    });
    await alert.present();
  }

  private async notify(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 1800 });
    await toast.present();
  }

  private async tap(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Web browser has no haptics hardware.
    }
  }
}
