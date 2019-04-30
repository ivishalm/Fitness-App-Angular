import { Injectable } from "@angular/core";
import { Exercise } from "src/app/training/exercise.model";
import { Subject } from "rxjs/internal/Subject";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExerciseChanged = new Subject<Exercise[]>();

  private fbSubs: Subscription[] = [];
  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection("availableExercises")
        .snapshotChanges()
        .pipe(
          map(docArray => {
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
          this.availableExercises = exercise;
          this.exercisesChanged.next([...this.availableExercises]);
        })
    );
  }

  startExercise(selectedId: String) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancleExercise(progress) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedorCancelledExercises() {
    this.fbSubs.push(this.db
      .collection("finishedExercises")
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExerciseChanged.next(exercises);
      }));
  }

  cancleSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }


  addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }
}
