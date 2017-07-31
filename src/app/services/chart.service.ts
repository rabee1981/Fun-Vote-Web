import { Injectable, OnInit } from "@angular/core";
import { ChartDetails } from "../data/chartDetails";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import 'rxjs/add/operator/map';

@Injectable()
export class ChartService implements OnInit{
    ngOnInit(): void {
        this.afAuth.authState.subscribe(
            user => {
                if(user){
                    this.useruid = user.uid;
                }
            }
        )
    }
    useruid;
    constructor(private afDatabase: AngularFireDatabase, private afAuth : AngularFireAuth) { 
    }

    voteFor(key,data){
        this.afDatabase.object(`allCharts/${key}/chartData`).set(data);
        this.afDatabase.object(`users/${this.useruid}/voted/${key}`).set(true);
        this.afDatabase.object(`users/${this.useruid}/favorites/${key}`).$ref.transaction(
            currentValue => {
                if(currentValue!==null){
                    this.afDatabase.object(`users/${this.useruid}/favorites/${key}/chartData`).set(data);
                }
            }
        )
    }
    deleteChart(key){
        this.afDatabase.object(`allCharts/${key}`).remove().then(
            res => {
                this.afDatabase.object(`users/${this.useruid}/usersCharts/${key}`).remove();
            }
        )
    }
    isVote(key){
        return this.afDatabase.object(`users/${this.useruid}/voted/${key}`);
    }
}