import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<any> {
    let body = { email, password };

    return this.http
      .post<any>("http://localhost:3000/api/login", body);
  }
}
