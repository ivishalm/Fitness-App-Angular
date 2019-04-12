import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from 'src/app/training/current-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {

  @Output() trainingExit = new EventEmitter();

  progress = 0;
  timer: number;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
   
    this.startorResumerTimer();
   
  }

  startorResumerTimer() {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;

      if(this.progress >=100) {
        clearInterval(this.timer);
      }

    }, 1000);
  }


  onStop() {
    clearInterval(this.timer);

    const dialogref = this.dialog.open(StopTrainingComponent , {
      data: { progress: this.progress }
    })

    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        this.trainingExit.emit();
      }
      else {
        this.startorResumerTimer();
      }
    });

  }


}
