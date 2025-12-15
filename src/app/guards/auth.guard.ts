import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.authLoaded$.pipe(
      filter((loaded) => loaded),
      take(1),
      switchMap(() =>
        this.auth.user$.pipe(
          take(1),
          map((user) => (user ? true : this.router.createUrlTree(['/login'])))
        )
      )
    );
  }
}
