import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { updateProfile } from '@angular/fire/auth';
import { NgIf } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonButton,
  ],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  passwordMismatch = false;

  constructor() {}

  private mapFirebaseError(code?: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Tento email je již používán.';
      case 'auth/invalid-email':
        return 'Neplatný formát emailu.';
      case 'auth/operation-not-allowed':
        return 'Registrace pomocí emailu není povolena.';
      case 'auth/weak-password':
        return 'Heslo je příliš slabé.';
      default:
        return 'Chyba při registraci. Zkuste to prosím znovu.';
    }
  }

  async submit() {
    this.submitted = true;
    this.errorMessage = null;
    this.passwordMismatch = false;

    if (this.form.invalid) {
      return;
    }

    const { displayName, email, password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.loading = true;
    try {
      const cred = await this.auth.registerWithEmail(email!, password!);
      if (cred.user && displayName) {
        await updateProfile(cred.user, { displayName });
      }
      // Po registraci automaticky přihlášeno -> přesměrujeme na hlavní stránku
      this.router.navigate(['/']);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      this.errorMessage =
        this.mapFirebaseError(code) || e.message || 'Chyba při registraci.';
    } finally {
      this.loading = false;
    }
  }
}
