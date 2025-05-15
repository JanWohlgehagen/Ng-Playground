import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DrawerComponent {
  @Input() paths: string[] = [];
  isOpen = false;

  constructor(private router: Router) {}

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  navigate(path: string) {
    this.isOpen = false;
    this.router.navigate([path]);
  }
}
