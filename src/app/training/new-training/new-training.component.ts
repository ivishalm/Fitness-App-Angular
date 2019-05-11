import { Component, OnInit} from '@angular/core';
import { TrainingService } from 'src/app/training/training.service';
import { Exercise } from 'src/app/training/exercise.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from 'src/app/shared/ui.service';

import * as fromRoot from '../../app.reducer';

import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  // exerciseSubscription: Subscription;
  isLoading$: Observable<boolean>;
  // loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   isloading => {
    //     this.isLoading = isloading;
    //   }
    // );


    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);

    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => {
    //     this.exercises = exercises;
    //   }
    // );
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  //   if (this.loadingSubs) {
  //     this.loadingSubs.unsubscribe();
  //   }
  // }
}
