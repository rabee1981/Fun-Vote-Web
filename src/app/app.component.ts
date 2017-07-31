import { UserInfoService } from './services/userInfo.service';
import { ChartService } from './services/chart.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth"
import { ChartDetails } from "app/data/chartDetails";
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";

declare var jQuery : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild('nav') nav : ElementRef;
  isAuth=true;
  closeResult: string;
  constructor(private af : AngularFireDatabase, private afAuth : AngularFireAuth, private chartService : ChartService,
              private userInfoService : UserInfoService, private afDatabase : AngularFireDatabase){
  }
  ngOnInit(){
    this.afAuth.authState.subscribe(
      user => {
        if(user){
          this.isAuth = true;
          this.chartService.useruid = user.uid;
          this.userInfoService.saveFriendsInfo(user)
          this.userInfoService.saveUserInfo(user)
          jQuery('#modal1').modal('close');
        }else{
          this.showModel()
          this.isAuth = false;
        }
      }
    )
   }
   logout(){
     this.afAuth.auth.signOut();
   }
   login(){
     this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
     .then(res => {
       this.afDatabase.object(`users/${res.user.uid}/userInfo`).update({accessToken : res.credential.accessToken});
     })
     .catch(err => console.log(err))
   }
   showModel(){
     jQuery('.modal1').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() {} // Callback for Modal close
    }
  );
  jQuery('#modal1').modal('open');
}
}
