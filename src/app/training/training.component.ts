import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from 'src/app/training/training.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {

  ongoingTraining = false;
  exerciseSubcription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {


    this.exerciseSubcription = this.trainingService.exerciseChanged.subscribe(
      exercise => {
      if (exercise) {
        this.ongoingTraining = true;
      } else {
        this.ongoingTraining = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.exerciseSubcription) {
      this.exerciseSubcription.unsubscribe();
    }
  }



}
