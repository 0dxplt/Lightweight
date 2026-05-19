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
          username: "Reportee#" + Math.round(Math.random() * 1000)
        },
        reporter: {
          id: i+1,
          username: "Reporter#" + Math.round(Math.random() * 1000)
        }
      }
      reports.push(report);
    }
    return reports;
  }

  confirmReport(id: number) {
    console.log("Approving Report request #" + id);
  }
}
