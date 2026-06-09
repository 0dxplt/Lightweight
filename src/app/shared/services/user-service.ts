import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { SearchUserInfo } from 'src/app/models/search-user-info.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { PROPIC_PATH } from '../global';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _mapUserFromData(data: any): User {
    return ({
      id: data.id,
      email: data.email,
      username: data.username,
      weight: data.weight,
      height: data.height,
      gxp: data.xp_globali,
      sxp: data.xp_stagionali,
      gLevel: data.livello_globale,
      sLevel: data.livello_stagionale,
      followers: data.numero_followers,
      following: data.numero_followed,
      sessions: data.numero_sessioni,
      verified: data.verificato === 0 ? false : true,
      propic: !!data.propic ? `${environment.apiUrl}/api/imgs/users?id=${data.id}&timestamp=${Date.now()}` : undefined,
      birthdate: !data.data_nascita ? undefined : data.data_nascita,
      name: !data.nome ? undefined : data.nome,
      surname: !data.cognome ? undefined : data.cognome,
      nationality: !data.nazionalita ? undefined : data.nazionalita,
      pt: !data.pt ? undefined : data.pt
    });
  }

  constructor(private http: HttpClient) {}

  user(username: string): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${username}`).pipe(
      map(data => {
        const propic = this._mapUserFromData(data).propic;
        data.propic = propic;
        return data;
      })
    );
  }

  updateVerified(userId: number, value: boolean): Observable<{status_changed: true}> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/moderators/update-verify`,
      {userId:userId, value:value}
    );
  }

  followersOf(username: string): Observable<User[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users/${username}/followers`).pipe(
      map(data => data.map(value => this._mapUserFromData(value)))
    );
  }

  followingOf(username: string): Observable<User[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users/${username}/followings`).pipe(
      map(data => data.map(value => this._mapUserFromData(value)))
    );
  }

  getUsersMinimal():Observable<SearchUserInfo[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/api/users/minimal`).pipe(
      map(rows => {
        return rows.map(row => {
          return {
            username: row.username,
            name: row.nome || undefined,
            surname: row.cognome || undefined,
            avatarUrl: !!row.img ? `${environment.apiUrl}/api/imgs/users?id=${row.id}&timestamp=${Date.now()}` : PROPIC_PATH
          }
        })
      })
    )
  }

  getSeasonalRankInfos(userId: number): Observable<{rankName: string, url: string}> {
    return this.http.get<{rankName: string, url: string}>(`${environment.apiUrl}/api/imgs/seasonal-icon/${userId}?timestamp=${Date.now()}`);
  }

  getSeasonalIcon(username: string): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/api/imgs/seasonal-icon/by-username/${username}`);
  }
}
