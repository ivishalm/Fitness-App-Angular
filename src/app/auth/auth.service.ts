import { Subject } from 'rxjs/Subject';
import { AuthData } from 'src/app/auth/auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListner() {
    this.afauth.authState.subscribe(user => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);

        this.store.dispatch(new Auth.SetAuthenticated());

        this.router.navigate(['/training']);
      } else {
        this.store.dispatch(new Auth.SetUnuthenticated());
        this.trainingService.cancleSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afauth.auth
    .createUserWithEmailAndPassword(String(authData.email), String(authData.password))
    .then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      // this.authChange.next(true);
    })
    .catch(err => {
      console.log(err);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnakbar(err.message, null, 3000);

      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afauth.auth
      .signInWithEmailAndPassword(String(authData.email), String(authData.password))
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(err => {
        console.log(err);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnakbar(err.message, null, 3000);
      });
  }

  logout() {
    this.afauth.auth.signOut();
  }

  // isAuth() {
  //   return this.isAuthenticated;
  // }

}
