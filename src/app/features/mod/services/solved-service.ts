import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolvedReport } from 'src/app/models/solved_report.model';
import { SolvedRequest } from 'src/app/models/solved_request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolvedService {

  constructor(private http: HttpClient) {}

  getSolvedReports(): Observable<SolvedReport[]> {
    return this.http.get<SolvedReport[]>(`${environment.apiUrl}/api/solved/reports/full`);
  }

  getSolvedRequests(): Observable<SolvedRequest[]> {
    return this.http.get<SolvedRequest[]>(`${environment.apiUrl}/api/solved/requests/full`);
  }

  numberOfSolved(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/api/solved/count`);
  }
}
