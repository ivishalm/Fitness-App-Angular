import { Component, OnInit } from '@angular/core';
import { TrainingService } from 'src/app/training/training.service';
import { Exercise } from 'src/app/training/exercise.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {


  exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
