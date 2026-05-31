import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RankUser } from 'src/app/models/rank-user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RankingService {  
  constructor(private http: HttpClient) {}

  private _mapFromData(data: any): RankUser {
    return {
      level: data.level,
      rank: data.rank,
      username: data.username,
      pt: data.pt,
      avatar: !data.avatar ? undefined : data.avatar
    };
  }

  getRankedUsers(global: boolean): Observable<RankUser[]> {
    let filter: string = (global) ? "global" : "seasonal";
    const url: string = `${environment.apiUrl}/api/rankings/${filter}`;
    return this.http.get<any[]>(url).pipe(
      map(data => data.map(value => this._mapFromData(value)))
    );
  }
}