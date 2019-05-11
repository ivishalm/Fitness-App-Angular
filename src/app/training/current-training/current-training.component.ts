import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from 'src/app/training/current-training/stop-training.component';
import { TrainingService } from 'src/app/training/training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer;

  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.startorResumerTimer();
  }

  startorResumerTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      const step = (ex.duration / 100) * 1000;

      this.timer = setInterval(() => {
        this.progress = this.progress + 5;

        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);

    const dialogref = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress }
    });

    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.trainingService.cancleExercise(this.progress);
      } else {
        this.startorResumerTimer();
      }
    });
  }
}
