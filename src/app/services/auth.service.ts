import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  user$: Observable<User | null> = authState(this.auth) as Observable<User | null>;

  // Vrací jméno nebo email aktuálního uživatele jako string nebo null
  displayName$: Observable<string | null> = this.user$.pipe(
    map((u) => (u ? u.displayName || u.email || null : null))
  );

  signInWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  registerWithEmail(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  signOut(): Promise<void> {
    return signOut(this.auth).then(() => {
      // Po odhlášení přesměrujeme na login
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(u => !!u));
  }
}
