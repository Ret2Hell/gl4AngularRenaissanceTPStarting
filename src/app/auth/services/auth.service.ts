import { Injectable, inject, signal, computed } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { AuthenticatedUser } from '../dto/authenticated-user.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private currentUserSignal = signal<AuthenticatedUser | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.initializeUserState();
  }

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) => {
        const user: AuthenticatedUser = {
          id: response.userId,
          email: credentials.email,
          token: response.id,
        };

        this.currentUserSignal.set(user);

        localStorage.setItem('token', response.id);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('userEmail', credentials.email);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

    this.currentUserSignal.set(null);
  }

  private initializeUserState() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userId && userEmail) {
      const user: AuthenticatedUser = {
        id: parseInt(userId, 10),
        email: userEmail,
        token: token,
      };
      this.currentUserSignal.set(user);
    }
  }

  getUserId(): number | null {
    return this.currentUserSignal()?.id ?? null;
  }

  getUserEmail(): string | null {
    return this.currentUserSignal()?.email ?? null;
  }
}
