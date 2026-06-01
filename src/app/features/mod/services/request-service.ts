import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationRequest } from 'src/app/models/request.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  
  constructor(private http: HttpClient) {}

  requests(): Observable<ValidationRequest[]> {
    return this.http.get<ValidationRequest[]>(`${environment.apiUrl}/api/requests/full`);
  }

  numberOfRequests(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/api/requests/count`);
  }

  approve(moderatorId: number, request: ValidationRequest): Observable<{approved: boolean}> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/requests/approve`,
      {request:request, moderatorId:moderatorId}
    );
  }

  reject(moderatorId: number, request: ValidationRequest): Observable<{rejected: boolean}> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/requests/reject`,
      {request:request, moderatorId:moderatorId}
    );
  }

  new(): Observable<{requested: boolean, message?: string}> {
    return this.http.post<any>(`${environment.apiUrl}/api/profile/new-verify-request`, {});
  }
}
