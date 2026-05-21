import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'betterMsViewer',
  standalone: true
})
export class BetterMsViewerPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return "";
    }

    const seconds = Math.floor(value / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return (remainingSeconds > 0) ? `${minutes}\' ${remainingSeconds}\'\'` : `${minutes}\'`;
    } else {
      return `${remainingSeconds}\'\'`;
    }
  }

}
