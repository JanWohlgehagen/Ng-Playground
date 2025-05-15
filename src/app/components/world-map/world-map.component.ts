import { Component, ElementRef, HostBinding, Injectable, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { LineGraphComponent } from '../line-graph/line-graph.component';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
	selector: 'app-world-map',
	  standalone: true,
  	imports: [LineGraphComponent, CommonModule, CdkDrag, CdkDropList],
	templateUrl: './world-map.html',
	styleUrls: ['./world-map.scss'],
})
export class WorldMapComponent implements OnInit {
	private el: HTMLElement;
	private width = 1380;
	private height = 920;
	private svg: any;
	private path: any;

	private graphData = [
		{ index: 0, value: 42 },
		{ index: 1, value: 23 },
		{ index: 2, value: 18 },
		{ index: 3, value: 90 },
		{ index: 4, value: 33 },
		{ index: 5, value: 68 },
		{ index: 6, value: 12 },
		{ index: 7, value: 57 },
		{ index: 8, value: 24 },
		{ index: 9, value: 81 },
		{ index: 10, value: 39 },
		{ index: 11, value: 63 },
	]

	private graphDataRegression = [
		{ index: 0, value: 63 },
		{ index: 1, value: 23 },
		{ index: 2, value: 18 },
		{ index: 3, value: 90 },
		{ index: 4, value: 33 },
		{ index: 5, value: 68 },
		{ index: 6, value: 12 },
		{ index: 7, value: 57 },
		{ index: 8, value: 24 },
		{ index: 9, value: 81 },
		{ index: 10, value: 39 },
		{ index: 11, value: 13 },
	]

	private graphDataNoChange = [
		{ index: 0, value: 13 },
		{ index: 1, value: 23 },
		{ index: 2, value: 18 },
		{ index: 3, value: 90 },
		{ index: 4, value: 33 },
		{ index: 5, value: 68 },
		{ index: 6, value: 12 },
		{ index: 7, value: 57 },
		{ index: 8, value: 24 },
		{ index: 9, value: 81 },
		{ index: 10, value: 39 },
		{ index: 11, value: 13 },
	]
	

	markers = [
		{ lat: 55.5, long: 9.4, name: 'Denmark', graphData: this.graphData},
		{ lat: 52.8, long: 11, name: 'Germany', graphData: this.graphDataRegression },
		{ lat: 62.5, long: 26.5, name: 'Finland', graphData: this.graphData },
		{ lat: 59.4, long: 16.1, name: 'Sweden', graphData: this.graphDataRegression },
		{ lat: 61, long: 9.1, name: 'Norway', graphData: this.graphDataNoChange },
	];

	constructor(el: ElementRef) {
		this.el = el.nativeElement;
	}

	ngOnInit(): void {
		this.createSvg();
		this.drawChart();
	}

	private createSvg() {
		this.svg = d3
			.select(this.el.getElementsByClassName('map-container')[0])
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height);
	}

	private drawChart() {
		const projection = d3
			.geoMercator()
			.scale(1050)
			.center([15, 61.5])
			.translate([this.width / 2, this.height / 2]);
		this.path = d3.geoPath().projection(projection);

		d3.json(
			'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
		).then((data: any) => {
			const filteredFeatures = data.features;

			this.svg
				.selectAll('path')
				.data(filteredFeatures)
				.join('path')
				.attr('fill', '#b8b8b8')
				.attr('d', d3.geoPath().projection(projection))
				.style('stroke', 'black')
				.style('opacity', 1)


			 // Filter features based on whether the name is in the markers array
			 const filteredMarkers = filteredFeatures.filter((feature) =>
			 this.markers.some((marker) => marker.name === feature.properties.name));



			 filteredMarkers.forEach(country => {
				var bounds = this.path.bounds(country);
				if (bounds[0][0] < 0) bounds[0][0] = 0;
				if (bounds[1][0] > this.width) bounds[1][0] = this.width;
				if (bounds[0][1] < 0) bounds[0][1] = 0;
				if (bounds[1][1] < 0) bounds[1][1] = this.height;
		
				this.svg.append("clipPath")
				  .attr("class","mask")
				  .attr("id",function(d){return country.id;})
				  .append("path")
				  .attr("d",this.path(country));
		
				this.svg.append("image")
				  .attr("xlink:href", `assets/svg/flag-${country.properties.name.toLowerCase()}.svg`)
				  .attr("x", bounds[0][0])
				  .attr("y", bounds[0][1])
				  .attr("width", bounds[1][0] - bounds[0][0])
				  .attr("height", bounds[1][1] - bounds[0][1])
				  .attr("preserveAspectRatio","none")
				  .attr("clip-path", function(d){return "url(#"+country.id+")";});
			 }); 
		});
	}

	public getFlag(countryName: string){
		const flagPath = `assets/svg/flag-${countryName.toLowerCase()}.svg`;

		return flagPath;
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.markers, event.previousIndex, event.currentIndex);
	  }
}