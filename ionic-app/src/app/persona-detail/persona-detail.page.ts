import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular/lazy';
import { Persona } from '../models/persona.model';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-persona-detail',
  templateUrl: './persona-detail.page.html',
  styleUrls: ['./persona-detail.page.scss'],
  standalone: false,
})
export class PersonaDetailPage implements OnInit {
  persona?: Persona;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personas: PersonaService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.persona = id ? this.personas.getById(id) : undefined;
  }

  ionViewWillEnter(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.persona = id ? this.personas.getById(id) : undefined;
  }

  async remove(): Promise<void> {
    if (!this.persona) {
      return;
    }
    const alert = await this.alertCtrl.create({
      header: 'Delete persona',
      message: `Delete persona "${this.persona.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.personas.remove(this.persona!.id);
            const toast = await this.toastCtrl.create({
              message: 'Persona deleted',
              duration: 1800,
            });
            await toast.present();
            this.router.navigateByUrl('/home');
          },
        },
      ],
    });
    await alert.present();
  }
}
