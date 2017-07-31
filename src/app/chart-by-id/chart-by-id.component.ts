import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'app-chart-by-id',
  templateUrl: './chart-by-id.component.html',
  styleUrls: ['./chart-by-id.component.css']
})
export class ChartByIdComponent implements OnInit,OnDestroy {
  chartSubscription: Subscription;
  isAuth = true;
  chartId;
  chartDetails=null;
  routeSubscription : Subscription;
  constructor(private route: ActivatedRoute,
              private af : AngularFireDatabase,
              private afAuth : AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(
      user => {
        this.isAuth=true
        this.routeSubscription = this.route.params.subscribe(res => {
        this.chartSubscription = this.af.object(`allCharts/${res.id}`)
        .map(
          chart => {
            chart.votesCount = chart.chartData.reduce(
              (a,b) => {
                return a+b
              }
            )
            return chart
          }
        ).subscribe(
          chart => {
            this.chartDetails = chart;
          },
          err => {}
        )
        });
      }
    )
  }
    ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.chartSubscription.unsubscribe();
  }
}
