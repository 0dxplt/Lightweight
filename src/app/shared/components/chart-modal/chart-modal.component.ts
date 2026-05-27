import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { IonButton, IonImg, IonChip, IonFab, IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, ModalController } from "@ionic/angular/standalone";
import { ExercisesChart } from 'src/app/models/exercises-chart';
import { SessionExercise } from 'src/app/models/session-modal-component-info';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, RadarController } from 'chart.js';
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, RadarController);

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.scss'],
  imports: [IonContent],
})
export class ChartModalComponent implements OnInit {

  public hasExercise = false;

  private modalCtrl = inject(ModalController);
  public musclePercs: ExercisesChart[] = [];
  @Input({ required: true }) exercises!: SessionExercise[];

  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;
  radarChart: any;

  constructor() { }

  ngOnInit() {
    if (this.exercises.length >= 1) {
      this.hasExercise = true;
    }
  }

  ngAfterViewInit() {
    this.createRadarChart();
  }

  calculateMusclePercs(exercises: SessionExercise[]) {
    const dizionarioEsercizi: Record<string, number> = {};

    exercises.forEach(exercise => {
      const totalReps = exercise.serie.reduce((sum, serie) => sum + serie.reps, 0);

      exercise.tags.forEach(tag => {
        dizionarioEsercizi[tag.nome] = (dizionarioEsercizi[tag.nome] || 0) + (totalReps * tag.perc);
      });
    });

    const volumeTotale = Object.values(dizionarioEsercizi).reduce((sum, val) => sum + val, 0);

    const dizionarioPercentuali: Record<string, number> = {};

    for (const [muscolo, volume] of Object.entries(dizionarioEsercizi)) {
      dizionarioPercentuali[muscolo] = Number(((volume / volumeTotale) * 100).toFixed(1));
    }
    return dizionarioPercentuali;
  }

  createRadarChart() {
    if (this.radarChart) {
      this.radarChart.destroy();
    }
    const dizionarioEsercizi = this.calculateMusclePercs(this.exercises);
    this.radarChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: Object.keys(dizionarioEsercizi),
        datasets: [
          {
            label: 'Volume Allenamento (%)',
            data: Object.values(dizionarioEsercizi),
            fill: true,
            backgroundColor: 'rgba(49, 141, 172, 0.2)',
            borderColor: 'rgb(49, 141, 172)',
            pointBackgroundColor: 'rgb(40, 116, 141)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(40, 116, 141)'
          },
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 3,
            tension: 0.1
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#333',
              callback: function (label: string) {
                return [label, `${dizionarioEsercizi[label]}%`];
              }
            },
            ticks: {
              display: true,
              stepSize: 10,
              backdropColor: 'transparent',
              color: '#666',
              callback: function (value) {
                return value + '%';
              }
            },
            suggestedMin: 0,
            suggestedMax: Math.max(...Object.values(dizionarioEsercizi))
          }
        }
      }
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }


}
