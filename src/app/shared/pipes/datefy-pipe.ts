import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datefy',
  standalone: true
})
export class DatefyPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (!value) return '';
    
    const date = new Date(value);
    const DD = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const YYYY = date.getFullYear();
    
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    
    return `${DD}/${MM}/${YYYY} - ${hh}:${mm}:${ss}`;
  }
}