import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";

declare var jQuery : any;

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(private afAuth : AngularFireAuth) { }

  ngOnInit() {
    jQuery('nav').ready(function(){})
    jQuery(".button-collapse").sideNav();
  }
  logout(){
    this.afAuth.auth.signOut();
    jQuery(".button-collapse").sideNav('hide');
  }
  sideNavHide(){
    jQuery(".button-collapse").sideNav('hide');
  }
}
