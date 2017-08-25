import { AngularFireDatabase } from 'angularfire2/database';
import { UserInfo } from './../data/userInfo';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/take';

@Injectable()
export class UserInfoService {
    constructor(private afDatabase : AngularFireDatabase, private http : Http){}
    friendsfireUid = []
    saveFriendsInfo(user){
        this.afDatabase.object(`users/${user.uid}/userInfo/accessToken`).take(1).subscribe(
            accessToken => {
                this.http.get(`https://graph.facebook.com/v2.9/${user.providerData[0].uid}/friends?fields=name,id,picture&access_token=${accessToken.$value}`)
                .take(1).subscribe(
                    (res : any) => {
                        let freidsArray = JSON.parse(res._body).data;
                        for (let key in freidsArray) {
                          var userInfo: UserInfo ={
                            name : freidsArray[key].name,
                            pictureUrl : freidsArray[key].picture.data.url,
                            facebookUid : freidsArray[key].id,
                          }
                            this.afDatabase.object(`users/${user.uid}/friendsList/${userInfo.facebookUid}`).update(userInfo)
                        }
                    }
                )
            }
        )
    }
    saveUserInfo(user){
        var userInfo : UserInfo =  {
            firebaseUid : user.uid,
            name : user.displayName,
            pictureUrl : user.photoURL,
            facebookUid : user.providerData[0].uid,
            email : user.email,
        }
        this.afDatabase.object(`users/${user.uid}/userInfo`).update(userInfo);
        this.afDatabase.object(`facebookUidVsFirebaseUid/${user.providerData[0].uid}`).set(user.uid)
    }
}