import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [],
  templateUrl: './line-graph.component.html',
  styleUrl: './line-graph.component.scss'
})
export class LineGraphComponent implements OnInit {
  @Input() data: ILineGraphData[] = [];
  @Input() height:number = 75;
  @Input() width:number = 300;

  private el: HTMLElement;
  private svg;
  private barColor: string = '#007a00';
  private margin = {top: 10, right: 0, bottom: 0, left: 0};

  constructor(el: ElementRef){
    this.el = el.nativeElement;
  }
  
  ngOnInit() {
    if (!this.data){
      return;
    }

    this.setColor();
    this.setDimensions();
    this.createSvg();
    this.drawChart();
  }

  private setColor(){
    if(this.data[0].value > this.data[this.data.length-1].value){
      this.barColor = '#ff0000'; //red
    } else if (this.data[0].value === this.data[this.data.length-1].value) {
      this.barColor = '#ffff00'; //yellow
    } else {
      this.barColor = '#007a00'//green
    }
  }

  private setDimensions(){
    this.height = this.height - this.margin.top - this.margin.bottom;
    this.width = this.width - this.margin.left - this.margin.right;
  }

  private createSvg(){
    this.svg = d3
			.select(this.el.getElementsByClassName('line-chart')[0])
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
      .attr("transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private drawChart(){
    //Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0, 12])
      .range([ 0, this.width ]);

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([Math.min(...this.data.map(item => item.value)), Math.max(...this.data.map(item => item.value))])
      .range([ this.height, 0 ]);

    //Add the line
    this.svg
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", this.barColor)
      .attr("stroke-width", 3)
      .attr("d", d3.line<ILineGraphData>()
        .x((d) => x(d.index))
        .y((d) => y(d.value))
        )

  }

}

export interface ILineGraphData {index: number, value: number};
