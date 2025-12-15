import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  private authLoadedSubject = new BehaviorSubject<boolean>(false);
  authLoaded$ = this.authLoadedSubject.asObservable();

  constructor() {
    authState(this.auth).subscribe(user => {
      this.userSubject.next(user as User | null);
      this.authLoadedSubject.next(true);
    });
  }

  displayName$: Observable<string | null> = this.user$.pipe(
    map((u) => (u ? u.displayName || u.email || null : null))
  );

  signInWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  registerWithEmail(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
  async refreshCurrentUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await user.reload();
      this.userSubject.next(user as User);
    }
  }

  setCurrentUserDisplayName(displayName: string): void {
    const user = this.userSubject.value;
    if (user) {
      (user as any).displayName = displayName;
      this.userSubject.next(user);
    }
  }

  async signInAndWaitForUser(email: string, password: string): Promise<User> {
    // Provede standardní přihlášení
    await this.signInWithEmail(email, password);

    // Počká na první nenull user z user$
    const user = await firstValueFrom(
      this.user$.pipe(
        filter((u): u is User => !!u),
        take(1)
      )
    );

    return user;
  }
}
