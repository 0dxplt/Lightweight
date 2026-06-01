import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from 'src/app/models/report.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  
  constructor(private http: HttpClient) {}

  reports() : Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.apiUrl}/api/reports/full`);
  }

  confirmReport(id_report: number, id_moderator: number | undefined, outcome: string): Observable<{confirmed: boolean}> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/reports/confirm-report`,
      {idReport: id_report, idModerator: id_moderator, outcome:outcome}
    );
  }

  report(reportee: number, reason: string): Observable<{reported: boolean}> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/report-user`,
      {reportee:reportee, reason:reason}
    );
  }

  exists(reportee: number | undefined): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/profile/already-reported`,
      {reportee:reportee}
    );
  }
}
