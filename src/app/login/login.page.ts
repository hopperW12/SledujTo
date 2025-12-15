import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  submitted = false;
  errorMessage: string | null = null;

  private mapFirebaseError(code?: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Neplatný formát emailu.';
      case 'auth/user-disabled':
        return 'Účet byl deaktivován.';
      case 'auth/user-not-found':
        return 'Uživatel s tímto emailem neexistuje.';
      case 'auth/wrong-password':
        return 'Nesprávné heslo.';
      default:
        return 'Chyba při přihlášení. Zkuste to prosím znovu.';
    }
  }

  async submit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const { email, password } = this.form.value;
    try {
      await this.auth.signInWithEmail(email!, password!);
      this.router.navigate(['/']);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      this.errorMessage = this.mapFirebaseError(code) || e.message || 'Chyba při přihlášení.';
    } finally {
      this.loading = false;
    }
  }
}
