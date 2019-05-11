import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as formRoot from '../../app.reducer';
import { Observable } from 'types/rxjs';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  isAuth$: Observable;
  @Output() closeSidenav = new EventEmitter();
  authSubscription: Subscription;

  constructor(private authService: AuthService, private store: Store<formRoot.State>) { }

  ngOnInit() {

    this.isAuth$ = this.store.select(formRoot.getIsAuth);

    // this.authSubscription = this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }


}
