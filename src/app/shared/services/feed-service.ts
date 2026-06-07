import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchUserInfo } from 'src/app/models/search-user-info.model';
import { SessionCard } from 'src/app/models/session-card.model';
import { environment } from 'src/environments/environment';
import { PROPIC_PATH } from '../global';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private http = inject(HttpClient);

  getFeed(): Observable<SessionCard[]> {
    return this.http.get<{
      id: number,
      username: string,
      avatarUrl: string | null,
      verified: number,
      sessionName: string,
      sessionId: number,
      gainedXP: number,
      pt: number,
      tags: string
    }[]>(
      environment.apiUrl + "/api/feed/myfeed/"
    ).pipe(
      map(rows => {
        return rows.map(row => {
          const tagsSet = new Set<string>(JSON.parse((row.tags || '[]')));
          return {
            username: row.username,
            sessionName: row.sessionName,
            sessionId: row.sessionId,
            gainedXP: row.gainedXP,
            tags: [...tagsSet],
            avatarUrl: !!row.avatarUrl ? `${environment.apiUrl}/api/imgs/users?id=${row.id}&timestamp=${Date.now()}` : PROPIC_PATH,
            verified: row.verified === 1,
            pt: row.pt === 1,
          }
        })
      })
    );
  }
}
