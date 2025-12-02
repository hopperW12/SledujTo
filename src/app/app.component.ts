import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonLabel, IonContent } from '@ionic/angular/standalone';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonLabel,
    IonContent,
    AsyncPipe,
    NgIf,
    RouterLink,
  ],
})
export class AppComponent {
  private auth = inject(AuthService);

  displayName$ = this.auth.displayName$;

  logout() {
    this.auth.signOut();
  }
}
