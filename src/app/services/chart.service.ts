import { Http , Headers} from '@angular/http';
import { Injectable } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class ChartService {
    useruid;
    constructor(private afDatabase: AngularFireDatabase, private afAuth : AngularFireAuth, private http : Http) {
        afAuth.authState.subscribe(
            user => {
                if(user){
                    this.useruid = user.uid;
                }
            }
        ) 
    }

    voteFor(key,index,owner){ // voters is updated just in the user charts its not updates in the allCharts and friends charts
        this.afDatabase.list(`allCharts/${key}`).take(1).subscribe(res => {
            if(res.length<=0){
                alert('this chart no longer exist...')
            }else{
                let headers = new Headers();
                this.afAuth.auth.currentUser.getIdToken().then(
                    token => {
                    headers.append('Authorization', 'Bearer '+token)
                    this.http.get(`https://us-central1-funvaotedata.cloudfunctions.net/voteFor?owner=${owner}&key=${key}&index=${index}`,{headers : headers})
                    .take(1).subscribe(res => {
                     //   console.log(res);
                    })
                 })
            }
        })
    }
    isVote(key,owner){ // voters is updated just in the user charts its not updates in the allCharts and friends charts
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voters/${this.useruid}`);
    }
    getImageUrl(owner,key){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/backgroundImage`);
    }
        getVoteCount(key,owner){
        return this.afDatabase.object(`users/${owner}/userCharts/${key}/voteCount`)
    }
}