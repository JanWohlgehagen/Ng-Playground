import { NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';

export interface IBudgetOverview {
  selectedYear: Date;
  budgetCurrentYear: number[];
  revenue: number[];
  revenuePreviousYear: number[];
  differenceInRevnue?: number[];
}

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './budget-overview.html',
  styleUrl: './budget-overview.scss',
})
export class BudgetOverviewComponent implements OnInit, OnDestroy {
  @Input() data!: IBudgetOverview;
  @Input() showNet: boolean = false;
  @Output() showNetEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  resizeObserver: ResizeObserver | null = null;

  showCurrentRevenue = true;
  showPreviousRevenue = true;
  showBudget = true;
  budgetExist: boolean = false;
  showDifference = false;
  colorRevenue: string = '#082d4d';
  colorPreviousRevenue: string = '#82c1fa';
  colorBudget: string = '#f37070';
  colorDifferencePositive = '#52c465';
  colorDifferenceNegative = '#eb4034';
  svg: any;
  margin = { top: 30, right: 30, bottom: 40, left: 90 };
  width = 900 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  lastWidth: number = 0;
  lastHeight: number = 0;

  ngOnInit(): void {
    this.data = {
      selectedYear: new Date(),
      budgetCurrentYear: [
        800000, 850000, 900000, 950000, 1000000, 1050000, 1100000, 1150000,
        1200000, 1250000, 1300000, 1350000,
      ],
      revenue: [
        1400000, 1450000, 1500000, 1350000, 1300000, 1250000, 1200000, 1150000,
        1100000, 1050000, 1000000, 950000,
      ],
      revenuePreviousYear: [
        900000, 950000, 1000000, 1050000, 1100000, 1150000, 1200000, 1250000,
        1300000, 1350000, 1400000, 1450000,
      ],
    };

    this.data.differenceInRevnue = this.data.revenue.map(
      (element, i) => element - this.data.revenuePreviousYear[i] || 0
    );
  }

  ngAfterViewInit(): void {
    if (!this.data) {
      return;
    }

    this.budgetExist =
      this.data.budgetCurrentYear.reduce(
        (prev, next) => (next = next + prev),
        0
      ) > 0;

    this.setGraphDimensions();
    this.renderChart();
    this.startResizeObserver();
  }

  ngOnDestroy(): void {
    // Cleanup the ResizeObserver when the component is destroyed
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  setGraphDimensions(): void {
    const container = this.graphContainer.nativeElement;
    const newWidth =
      container.offsetWidth - this.margin.left - this.margin.right;
    const newHeight =
      container.offsetHeight - this.margin.top - this.margin.bottom;

    if (newWidth !== this.lastWidth || newHeight !== this.lastHeight) {
      this.width = newWidth;
      this.height = newHeight;
      this.lastWidth = newWidth;
      this.lastHeight = newHeight;
    }
  }

  startResizeObserver(): void {
    const container = this.graphContainer.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {
      this.setGraphDimensions();
      this.renderChart();
    });

    this.resizeObserver.observe(container);
  }

  get grossNetStatus() {
    return this.showNet ? 'Showing Net' : 'Showing Gross';
  }

  renderChart(): void {
    if (this.svg) {
      d3.select(this.graphContainer.nativeElement).selectAll('*').remove();
    }

    this.svg = d3
      .select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const x = d3
      .scaleBand()
      .domain(
        d3
          .range(12)
          .map((i) =>
            new Date(2023, i).toLocaleString('default', { month: 'short' })
          )
      )
      .range([0, this.width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          [
            ...this.data.revenue,
            ...this.data.revenuePreviousYear,
            ...this.data.budgetCurrentYear,
          ].filter((value) => value !== undefined)
        ) || 0, // In case d3.max returns undefined, default to 0
      ])
      .nice()
      .range([this.height, 0]);

    this.svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font', '15px "Neue Helvetica W01", helvetica, arial, sans-serif')
      .style('font-weight', '700')
      .style('color', 'grey');

    this.svg
      .selectAll('.y-axis line, .y-axis path')
      .style('stroke', 'transparent');

    // X Axis
    this.svg
      .append('g')
      .selectAll('.x-axis')
      .data(d3.range(12))
      .enter()
      .append('text')
      .attr('x', (d: number) => {
        const month = new Date(2023, d).toLocaleString('default', {
          month: 'short',
        });
        const xPosition = x(month);
        return xPosition !== undefined ? xPosition + x.bandwidth() / 2 : 0; // Fallback to 0 if xPosition is undefined
      })
      .attr('y', this.height)
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .style('font', '15px "Neue Helvetica W01", helvetica, arial, sans-serif')
      .style('font-weight', '700')
      .style('fill', 'grey')
      .text((d) =>
        new Date(2023, d).toLocaleString('default', { month: 'short' })
      );

    // Y Axis
    this.svg
      .append('g')
      .selectAll('.y-axis')
      .data(y.ticks(5))
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(0, ${y(d)})`)
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('stroke', '#ccc');

    const barWidth = x.bandwidth() / 2;

    // Add Tooltip (initially hidden)
    const tooltip = d3
      .select(this.graphContainer.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '3px')
      .style('font', '12px "Neue Helvetica W01", helvetica, arial, sans-serif')
      .style('font-weight', '700');

    // Draw Bars for Current Revenue
    if (this.showCurrentRevenue) {
      this.svg
        .selectAll('.current-revenue')
        .data(this.data.revenue)
        .enter()
        .append('rect')
        .attr('class', 'current-revenue')
        .attr('x', (d, i) => {
          const month = new Date(2023, i).toLocaleString('default', {
            month: 'short',
          });
          const xPosition = x(month);
          return xPosition !== undefined ? xPosition : 0; // Fallback to 0 if xPosition is undefined
        })
        .attr('y', (d) => y(d))
        .attr('width', barWidth)
        .attr('height', (d) => this.height - y(d))
        .attr('fill', this.colorRevenue)
        .on('mouseover', (event, d) => this.handleMouseOver(event, d))
        .on('mousemove', (event) => this.handleMouseMove(event))
        .on('mouseout', () => this.handleMouseOut());
    }

    // Draw Bars for Previous Revenue
    if (this.showPreviousRevenue) {
      this.svg
        .selectAll('.previous-revenue')
        .data(this.data.revenuePreviousYear)
        .enter()
        .append('rect')
        .attr('class', 'previous-revenue')
        .attr('x', (d, i) => {
          const month = new Date(2023, i).toLocaleString('default', {
            month: 'short',
          });
          const xPosition = x(month);
          return xPosition !== undefined ? xPosition + barWidth : 0; // Fallback to 0 if xPosition is undefined
        })
        .attr('y', (d) => y(d))
        .attr('width', barWidth)
        .attr('height', (d) => this.height - y(d))
        .attr('fill', this.colorPreviousRevenue)
        .on('mouseover', (event, d) => this.handleMouseOver(event, d))
        .on('mousemove', (event) => this.handleMouseMove(event))
        .on('mouseout', () => this.handleMouseOut());
    }

    // Draw Budget Line
    if (this.showBudget) {
      const budgetLine = d3
        .line<number>()
        .x((_, i) => {
          const month = new Date(2023, i).toLocaleString('default', {
            month: 'short',
          });
          const xPosition = x(month);
          return xPosition !== undefined ? xPosition + barWidth : 0; // Fallback to 0 if xPosition is undefined
        })
        .y((d) => y(d));

      this.svg
        .append('path')
        .data([this.data.budgetCurrentYear])
        .attr('class', 'budget-line')
        .attr('d', budgetLine)
        .attr('fill', 'none')
        .attr('stroke', this.colorBudget)
        .attr('stroke-width', 3);
    }

    // Draw Difference Bars
    if (this.showDifference) {
      this.svg
        .selectAll('.difference-bar')
        .data(this.data.differenceInRevnue || [])
        .enter()
        .append('rect')
        .attr('class', 'difference-bar')
        .attr(
          'x',
          (d, i) =>
            x(
              new Date(2023, i).toLocaleString('default', { month: 'short' })
            ) || 0
        )
        .attr('y', (d, i) => {
          const baseY = y(this.data.revenuePreviousYear[i] || 0);
          return d > 0 ? y(this.data.revenue[i]) : baseY;
        })
        .attr('width', barWidth)
        .attr('height', (d) => Math.abs(y(0) - y(d)))
        .attr('fill', (d) =>
          d > 0 ? this.colorDifferencePositive : this.colorDifferenceNegative
        )
        .on('mouseover', (event, d) => {
          const index = this.data.differenceInRevnue
            ? this.data.differenceInRevnue.indexOf(d)
            : 0;
          console.log(index);
          const currentRevenue = this.data.revenue[index];
          const previousRevenue = this.data.revenuePreviousYear[index];
          tooltip
            .html(
              `Difference: ${d.toLocaleString()}<br>
               Current: ${currentRevenue.toLocaleString()}<br>
               Previous: ${previousRevenue.toLocaleString()}`
            )
            .style('visibility', 'visible')
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 20 + 'px');
        })
        .on('mousemove', function (event) {
          tooltip
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 20 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('visibility', 'hidden');
        });
    }
  }

  private handleMouseOver(event: MouseEvent, d: number): void {
    const tooltip = d3
      .select(this.graphContainer.nativeElement)
      .select('.tooltip');
    tooltip
      .html(`${d.toLocaleString()}`)
      .style('visibility', 'visible')
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 20 + 'px');
  }

  private handleMouseMove(event: MouseEvent): void {
    const tooltip = d3
      .select(this.graphContainer.nativeElement)
      .select('.tooltip');
    tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 20 + 'px');
  }

  private handleMouseOut(): void {
    const tooltip = d3
      .select(this.graphContainer.nativeElement)
      .select('.tooltip');
    tooltip.style('visibility', 'hidden');
  }

  flipShowCurrentRevenue() {
    this.showCurrentRevenue = !this.showCurrentRevenue;
    this.renderChart();
  }

  flipShowPreviousRevenue() {
    this.showPreviousRevenue = !this.showPreviousRevenue;
    this.renderChart();
  }

  flipShowBudget() {
    this.showBudget = !this.showBudget;
    this.renderChart();
  }

  flipShowDifference() {
    this.showDifference = !this.showDifference;
    this.renderChart();
  }

  flipShowNet() {
    this.showNetEmitter.emit(this.showNet);
  }
}
