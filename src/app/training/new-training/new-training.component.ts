import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from 'src/app/training/training.service';
import { Exercise } from 'src/app/training/exercise.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscription: Subscription;
  isLoading = false;
  loadingSubs: Subscription;


  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isloading => {
      this.isLoading = isloading;
    });

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }


  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
