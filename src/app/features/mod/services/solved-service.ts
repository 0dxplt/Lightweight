import { Injectable } from '@angular/core';
import { SolvedReport } from 'src/app/models/solved_report.model';
import { SolvedRequest } from 'src/app/models/solved_request.model';

@Injectable({
  providedIn: 'root',
})
export class SolvedService {

  getSolvedReports(): SolvedReport[] {
    // fetch al db
    const reports: SolvedReport[] = [];
    for (let i = 0; i < 200; i++) {
      const report: SolvedReport = {
        id: i + 1,
        moderator: {
          id: 0,
          email: "prova@prova.prv",
          username: "Checco#" + Math.round(Math.random() * 1000)
        },
        report: {
          id: 0,
          reporter: {
            id: 10,
            username: "Samuel#" + Math.round(Math.random() * 1000),
            email: "reporter@prova",
            weight: 100,
            height: 180,
            followers: 0,
            following: 0,
            gLevel: 0,
            sLevel: 0,
            xp: 0,
            verified: (Math.random() < 0.5) ? true : false,
            sessions: Math.round(Math.random() * 300)
          },
          reportee: {
            id: 21,
            username: "L. Jackson#" + Math.round(Math.random() * 1000),
            email: "reportee@prova",
            weight: 100,
            height: 180,
            followers: 0,
            following: 0,
            gLevel: 0,
            sLevel: 0,
            xp: 0,
            verified: (Math.random() < 0.5) ? true : false,
            sessions: Math.round(Math.random() * 300)
          },
          timestamp: Math.round(Math.random() * 1000000000000),
          reason: "Nothing"
        },
        timestamp: Math.round(Math.random() * 1000000000000),
        outcome: "Nothing to do"
      };
      reports.push(report);
    }
    return reports;
  }

  getSolvedRequests(): SolvedRequest[] {
    // fetch al db
    const requests: SolvedRequest[] = [];
    for (let i = 0; i < 200; i++) {
      const request: SolvedRequest = {
        id: i + 1,
        moderator: {
          id: 0,
          email: "prova@prova.prv",
          username: "Checco#" + Math.round(Math.random() * 1000)
        },
        request: {
          id: 0,
          user: {
            id: 0,
            username: "Batman#" + Math.round(Math.random() * 1000),
            email: "user@prova",
            weight: 100,
            height: 180,
            followers: 0,
            following: 0,
            gLevel: 0,
            sLevel: 0,
            xp: 0,
            verified: (Math.random() < 0.5) ? true : false,
            sessions: Math.round(Math.random() * 300)
          },
          timestamp: Math.round(Math.random() * 1000000000000)
        },
        timestamp: Math.round(Math.random() * 1000000000000),
        status: (Math.random() < 0.5) ? 'APPROVED' : 'REJECTED'
      };
      requests.push(request);
    };
    return requests;
  }

  getNumberOfSolved(): number {
    // fetch al db
    return Math.round(Math.random() * 100);
  }
}
