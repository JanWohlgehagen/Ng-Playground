import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-click-grid',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './click-grid.component.html',
  styleUrl: './click-grid.component.scss'
})
export class ClickGridComponent implements OnInit {
  grid!: string[][];
  history!: string[][][];
  isPlayerOne = true;

  ngOnInit(): void {
    // Initialize a 3x3 grid with null or empty strings
    this.grid = Array(3).fill(null).map(() => Array(3).fill(''));
    this.history = [];
  }

  throwElement(row: number, col: number) {
    if(this.isPlayerOne)
      this.grid[row][col] = 'X';
    else
      this.grid[row][col] = 'O';
    
    this.isPlayerOne = !this.isPlayerOne;
    this.saveHistory();
  }

  saveHistory() {
    // Push a copy of the current grid state to history
    this.history.push(this.grid.map(row => [...row]));
  }
}
