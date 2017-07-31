import { ImageProccessService } from './../../services/imageProccess.service';
import { ChartDetails } from './../../data/chartDetails';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChartService } from "../../services/chart.service";
import { Subscription } from "rxjs/Subscription";
import { Color } from "ng2-charts";

@Component({
  selector: 'chart-component',
  templateUrl: 'chart-component.html',
  styleUrls: ['chart-component.css']
})
export class ChartComponent implements OnInit, OnDestroy{
  votesCount: number;
  votesCountSub: Subscription;
  imageSub: Subscription;
  isvoteSubscribtion: Subscription;
  @Input() chartDetails;
  @Input() owner;
  @Output() onVoted = new EventEmitter<boolean>()
  colors : Color[];
  chartData:number[]=[];
  isvote=true;
  titlePadding = 2;
  startFromZero= {xAxes:[],yAxes:[]};
  options={}
  currentData=[];
  backgroundImage : any="data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  constructor(private chartService : ChartService ,private imgService : ImageProccessService){};

  ngOnInit(){
      this.isvoteSubscribtion = this.chartService.isVote(this.chartDetails.$key,this.chartDetails.owner)
      .subscribe(res => {
        this.isvote = res.$value
      })
      this.imageSub = this.chartService.getImageUrl(this.chartDetails.owner,this.chartDetails.$key).subscribe(
      res => {
        if(res.$value){
          this.imgService.convertToDataURLviaCanvas(res.$value, "image/jpeg")
              .then( base64Img => {
                this.backgroundImage = base64Img
              }).catch()
        }else{
              this.backgroundImage = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
        }
      }
    )
    this.votesCountSub = this.chartService.getVoteCount(this.chartDetails.$key,this.chartDetails.owner).subscribe(
      count => {
        this.votesCount = count.$value
      }
    )
    this.chartDetails.titleColor = '#000000'
    if(this.chartDetails.chartType==='bar'){
      this.titlePadding = 10
      this.startFromZero = {
        xAxes:[{
            ticks: {
                fontStyle : 'bold',
                fontColor: "#000000",
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontStyle : 'bold',
                fontColor: "#000000",
            }
        }]
    }
  }
    //options
    this.options = {
                        legend : {
                          reverse: true,
                          labels:{
                            padding:5,
                            boxWidth:20,
                            fontStyle : 'bold',
                            fontColor: "#000000"
                          }
                        },
                        layout : {
                          padding : {
                              left: 10,
                              right: 5,
                              top: 0,
                              bottom: 0
                          }
                        },
                        animateRotate: false,
                        tooltips: {
                            callbacks: {
                              label: function(tooltipItem, data) {
                                var allData = data.datasets[tooltipItem.datasetIndex].data;
                                var tooltipLabel = data.labels[tooltipItem.index];
                                var tooltipData = allData[tooltipItem.index];
                                var total = 0;
                                for (var i in allData) {
                                  total += allData[i];
                                }
                                var tooltipPercentage = Math.round((tooltipData / total) * 100);
                                return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                              }
                            }
                          },
                        animation: false,
                        title: {
                          text : this.chartDetails.chartTitle,
                          display: true,
                          fontSize: 18,
                          fontFamily: 'Pacifico',
                          padding : this.titlePadding,
                          fontColor : this.chartDetails.titleColor
                        },
                        scales: this.startFromZero,
                      }
  this.colors= [
                  {
                    backgroundColor : this.chartDetails.chartColor,
                    borderWidth : 0.5
                  }
                  ]
  }
  public vote(index){
    this.onVoted.emit(true);
    this.chartService.isVote(this.chartDetails.$key,this.chartDetails.owner)
    .take(1).subscribe(res => {
     if(!res.$value){
        this.votesCount--;
        this.isvote = true;
        this.currentData = this.chartDetails.chartData.slice();
        this.currentData[index]++;
        this.chartDetails.chartData = this.currentData;
        this.chartService.voteFor(this.chartDetails.$key,index,this.chartDetails.owner);
   }
 })
  }
  arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true; 
  }
  // getColorsWithOpacity(colors : string[],opacity : string){
  //   var colorsWithOpacity : string[]=[];
  //   for(var color of colors){
  //     var index = color.indexOf(')');
  //     colorsWithOpacity.push(color.substring(0,index-3)+`,${opacity})`)
  //   }
  //   return colorsWithOpacity;
  // }
  ngOnDestroy(){
      this.isvoteSubscribtion.unsubscribe();
      this.imageSub.unsubscribe();
      this.votesCountSub.unsubscribe();
  }
}
