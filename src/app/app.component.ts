import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DrawerComponent } from './components/drawer/drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Components & pages';
  paths: string[] = [
    'world-map',
    'dnd',
    'click-grid',
    'budget-overview',
    'calendar',
  ];
}
