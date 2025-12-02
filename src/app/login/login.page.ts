import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, RouterLink, NgIf]
})
export class LoginPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

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

  async googleSignIn() {
    this.errorMessage = null;
    try {
      await this.auth.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      // Google login může mít jiné kódy, ale fallback zpráva stačí
      this.errorMessage = this.mapFirebaseError(code) || e.message || 'Chyba při přihlášení přes Google.';
    }
  }
}
