import { Subject } from "rxjs/Subject";
import { User } from "src/app/auth/user.model";
import { AuthData } from "src/app/auth/auth-data.model";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from "../training/training.service";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthListner() {
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancleSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(["/login"]);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afauth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
      })
      .catch(err => {
        console.log(err);
      });
    this.authChange.next(true);
  }

  login(authData: AuthData) {
    this.afauth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
      })
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    this.afauth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
