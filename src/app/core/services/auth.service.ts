import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isLoggedInSync(): boolean {
    if (this.loggedIn.value && this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return this.loggedIn.value;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('username', response.username);
          this.loggedIn.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
  }
}
