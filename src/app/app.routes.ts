import { Routes } from '@angular/router';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { BudgetOverviewComponent } from './components/budget-overview/budget-overview.component';
import { ClickGridComponent } from './components/click-grid/click-grid.component';
import { DNDComponent } from './components/d-n-d/d-n-d.component';
import { CalendarComponent } from './components/calendar/calendar/calendar.component';

export const routes: Routes = [
  { path: 'world-map', component: WorldMapComponent },
  { path: 'dnd', component: DNDComponent },
  { path: 'click-grid', component: ClickGridComponent },
  { path: 'budget-overview', component: BudgetOverviewComponent },
  { path: 'calendar', component: CalendarComponent },
];
