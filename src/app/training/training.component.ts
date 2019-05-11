import { Component, OnInit } from '@angular/core';
import { TrainingService } from 'src/app/training/training.service';
import { Subscription } from 'rxjs/Subscription';

import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  ongoingTraining$: Observable<boolean>;
  exerciseSubcription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {

    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);

    // this.exerciseSubcription = this.trainingService.exerciseChanged.subscribe(
    //   exercise => {
    //   if (exercise) {
    //     this.ongoingTraining = true;
    //   } else {
    //     this.ongoingTraining = false;
    //   }
    // });
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubcription) {
  //     this.exerciseSubcription.unsubscribe();
  //   }
  // }



}
