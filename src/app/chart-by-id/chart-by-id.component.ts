import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

declare var jQuery : any;

@Component({
  selector: 'app-chart-by-id',
  templateUrl: './chart-by-id.component.html',
  styleUrls: ['./chart-by-id.component.css']
})
export class ChartByIdComponent implements OnInit,OnDestroy {
  loading: boolean;
  chartSubscription: Subscription;
  isAuth = true;
  chartId;
  isPopModel=false;
  chartDetails=null;
  routeSubscription : Subscription;
  constructor(private route: ActivatedRoute,
              private af : AngularFireDatabase,
              private afAuth : AngularFireAuth) { }

  ngOnInit() {
    this.loading = true;
    this.afAuth.authState.subscribe(
      user => {
        if(user){
          this.isAuth=true
        this.routeSubscription = this.route.params.subscribe(res => {
        this.chartSubscription = this.af.object(`users/${user.uid}/friendsCharts/${res.id}`)
        .subscribe(
          chart => {
            if(chart.$value === undefined){
                this.chartDetails = chart;
                this.loading = false;
            }else{
              this.af.object(`publicCharts/${res.id}`).subscribe(publicChart => {
                if(publicChart.$value === undefined){
                  this.chartDetails = publicChart;
                  this.loading = false;
                }else{
                  this.af.object(`users/${user.uid}/userCharts/${res.id}`).subscribe(
                    userChart => {
                      if(userChart.$value === undefined){
                        this.chartDetails = userChart;
                        this.loading = false;
                      }else{
                          this.loading = false;
                          alert('you can not see this chart, this chart is not public')
                      }
                    },
                    err => {
                      this.loading = false;
                      alert('you can not see this chart, this chart is not public')
                    }
                  )
                }
              })
            }
          },
          err => {
            this.loading = false;
          }
        )
        });
        } 
      }
    )
  }
  onVoted(event){
    if(event){
      this.showModel();
    }
  }
  showModel(){
     jQuery('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
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
  jQuery('#modal2').modal('open');
}
    ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.chartSubscription.unsubscribe();
  }
}
