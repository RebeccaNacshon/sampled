import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private apiUrl = 'http://localhost:8000';

  async login(username: string, email: string) {
    const response = await axios.post(`${this.apiUrl}/login`, { username, email });
    localStorage.setItem('token', response.data.access_token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  
}
