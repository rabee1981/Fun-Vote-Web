import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html',
  styleUrls: ['chart-component.css']
})
export class ChartComponent implements OnInit, OnDestroy{
  isvoteSubscribtion: Subscription;
  alert;
  @Input() chartDetails;
  @Input() owner;
  colors;
  chartData:number[]=[];
  votesCount;
  isvote=true;
  constructor(private chartService : ChartService ){};
  ngOnInit(){
    this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key)
    .subscribe(res => {
      this.isvote = res.$value
    },
    err => {})
  this.colors = [
              {
                backgroundColor : this.chartDetails.chartColor
              }
           ]
  }
  public vote(index){
    if(!this.isvote){
      this.chartData = this.chartDetails.chartData.slice();
      this.chartData[index]++;
      this.chartDetails.chartData = this.chartData; 
      this.chartService.voteFor(this.chartDetails.$key,this.chartDetails.chartData);
    }
  }
    ngOnDestroy(): void {
    this.isvoteSubscribtion.unsubscribe();
  }
}