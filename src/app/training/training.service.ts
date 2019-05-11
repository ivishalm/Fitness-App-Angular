import { Injectable } from '@angular/core';
import { Exercise } from 'src/app/training/exercise.model';
import { Subject } from 'rxjs/internal/Subject';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as training from './training.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExerciseChanged = new Subject<Exercise[]>();

  private fbSubs: Subscription[] = [];
  // private availableExercises: Exercise[] = [];

  // private runningExercise: Exercise;
  // private exercises: Exercise[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) {}

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            // throw(new Error());
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories
              };
            });
          })
        )
        .subscribe((exercise: Exercise[]) => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          // this.availableExercises = exercise;
          // this.exercisesChanged.next([...this.availableExercises]);

          this.store.dispatch(new training.SetAvailableTrainings(exercise));

        }, error => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnakbar('fetching exercise failed, Please try again after some time', null, 3000);
          this.exercisesChanged.next(null);
        }
        )
    );
  }

  startExercise(selectedId: string) {
    // this.runningExercise = this.availableExercises.find(
    //   ex => ex.id === selectedId
    // );
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new training.StartTraining(selectedId));
  }

  completeExercise() {

    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new training.StopTraining());
    });

    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
  }

  cancleExercise(progress) {

    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new training.StopTraining());
    });

    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedorCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          // this.finishedExerciseChanged.next(exercises);
          this.store.dispatch(new training.SetFinishedTrainings(exercises));
        })
    );
  }

  cancleSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
