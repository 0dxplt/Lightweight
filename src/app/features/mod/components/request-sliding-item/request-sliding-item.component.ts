import { Component, input, OnInit, output } from '@angular/core';
import { ValidationRequest } from 'src/app/models/request.model';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkDone, closeCircle } from 'ionicons/icons';
import { DatefyPipe } from "../../../../shared/pipes/datefy-pipe";

@Component({
  selector: 'app-request-sliding-item',
  templateUrl: './request-sliding-item.component.html',
  styleUrls: ['./request-sliding-item.component.scss'],
  imports: [IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, DatefyPipe]
})
export class RequestSlidingItemComponent  implements OnInit {

  request = input.required<ValidationRequest>();
  onApprove = output<void>();
  onReject = output<void>();
  onReview = output<void>();

  constructor() {
    addIcons({'close-circle':closeCircle, 'checkmark-done':checkmarkDone});
  }

  ngOnInit() {}

  approveRequest(slidingItem: IonItemSliding) {
    console.log("Approving request #" + this.request().id);
    slidingItem.close();
    this.onApprove.emit();
  }

  rejectRequest(slidingItem: IonItemSliding) {
    console.log("Rejecting request #" + this.request().id);
    slidingItem.close();
    this.onReject.emit();
  }

  requestReview() {
    console.log("Redirecting to request #" + this.request().id + " extended view");
    this.onReview.emit();
  }
}
