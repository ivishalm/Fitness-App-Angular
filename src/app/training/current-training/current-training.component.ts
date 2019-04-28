import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from 'src/app/training/current-training/stop-training.component';
import { TrainingService } from 'src/app/training/training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {


  progress = 0;
  timer;

  constructor(public dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {

    this.startorResumerTimer();

  }

  startorResumerTimer() {

    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 5;

      if(this.progress >=100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }

    }, step);
  }


  onStop() {
    clearInterval(this.timer);

    const dialogref = this.dialog.open(StopTrainingComponent , {
      data: { progress: this.progress }
    })

    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        this.trainingService.cancleExercise(this.progress);
      }
      else {
        this.startorResumerTimer();
      }
    });

  }


}
