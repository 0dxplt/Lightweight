import { Injectable } from '@angular/core';
import { Report } from 'src/app/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  reports() : Report[] {
    // fetch db
    const reports: Report[] = [];
    for (let i = 0; i < 200; i++) {
      const report: Report = {
        id: i+1,
        timestamp: Math.round(Math.random() * 1000000000000),
        reason: "Nothing, I was just bored",
        reportee: {
          id: i+1,
          username: "Reportee#" + Math.round(Math.random() * 1000),
          email: "reportee@prova",
          weight: 100,
          height: 180,
          followers: 0,
          following: 0,
          gLevel: 0,
          sLevel: 0,
          sxp: Math.round(Math.random() * 10000),
          gxp: Math.round(Math.random() * 10000),
          verified: (Math.random() < 0.5) ? true : false,
          sessions: Math.round(Math.random() * 300)
        },
        reporter: {
          id: i+1,
          username: "Reporter#" + Math.round(Math.random() * 1000),
          email: "reporter@prova",
          weight: 100,
          height: 180,
          followers: 0,
          following: 0,
          gLevel: 0,
          sLevel: 0,
          sxp: Math.round(Math.random() * 10000),
          gxp: Math.round(Math.random() * 10000),
          verified: (Math.random() < 0.5) ? true : false,
          sessions: Math.round(Math.random() * 300)
        }
      }
      reports.push(report);
    }
    return reports;
  }

  confirmReport(id_report: number, id_moderator: number | undefined, outcome: string) {
    if (!id_moderator) return;
    console.log("Confirming report #" + id_report);
    // Query per modificare i SolvedReport (DB)
  }

  report(reporter: number, reportee: number, reason: string) {
    // query al db
    console.log(reporter + " has reported " + reportee + " for \"" + reason + "\"");
  }

  exists(reporter: number | undefined, reportee: number | undefined): boolean {
    if (!reporter || !reportee) return false;
    // query al db
    return false;
  }
}
