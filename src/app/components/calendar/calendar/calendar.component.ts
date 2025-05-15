import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDragMove,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { ScheduleService } from '../services/schedule.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduledItem, ScheduleItem } from '../models/scheduleItem.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatTooltipModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendarDropZone', { static: true })
  calendarDropZone!: ElementRef;
  tasks: Task[] = [];
  employees: Employee[] = [];
  schedule: { date: Date; open: boolean }[] = [];

  columnWidth = 170; // Employees
  timeslotHeight = 50; // 30 minutes = 50px
  pixelsPerMinute = this.timeslotHeight / 30; // = 1.6667...

  drawerItems: ScheduleItem[] = [
    { id: 1, label: 'Task A', duration: 60 },
    { id: 2, label: 'Task B', duration: 30 },
    { id: 3, label: 'Task C', duration: 90 },
  ];
  droppedItems: ScheduleItem[] = [];

  previewState: {
    employeeId: string | null;
    startMinutes: number | null;
    duration: number | null;
  } | null = null;

  constructor(
    private taskService: TaskService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
    this.taskService
      .getEmployees()
      .subscribe((employees) => (this.employees = employees));
    this.scheduleService.getSchedule().subscribe((schedule) => {
      this.schedule = schedule;
      console.log(schedule);
    });
  }

  onItemDropped(event: CdkDragDrop<any>) {
    const item = event.item.data;
    if (!item || event.previousContainer.id === event.container.id) return;

    const dropPoint = event.dropPoint;
    const containerRect = (
      event.container.element.nativeElement as HTMLElement
    ).getBoundingClientRect();

    const relativeX = dropPoint.x - containerRect.left;
    const relativeY = dropPoint.y - containerRect.top;

    // Target employee based on column width
    const employeeIndex = Math.floor(relativeX / this.columnWidth);
    const employee = this.employees[employeeIndex];
    if (!employee) return;

    // Convert Y offset to minutes (with 1.6667 px per min)
    const startMinutes = Math.round(relativeY / this.pixelsPerMinute);

    const newItem: ScheduledItem = {
      ...item,
      employeeId: employee.id,
      startMinutes,
    };

    const index = this.drawerItems.findIndex((i) => i.id === item.id);
    if (index > -1) this.drawerItems.splice(index, 1);

    this.droppedItems.push(newItem);
  }

  onDragMoved(event: CdkDragMove) {
    const container =
      this.calendarDropZone.nativeElement.getBoundingClientRect();
    const relativeX = event.pointerPosition.x - container.left;
    const relativeY = event.pointerPosition.y - container.top;

    const employeeIndex = Math.floor(relativeX / this.columnWidth);
    const employee = this.employees[employeeIndex];
    if (!employee) {
      this.previewState = null;
      return;
    }

    const startMinutes = Math.round(relativeY / this.pixelsPerMinute);
    const duration = event.source.data?.duration || 30;

    this.previewState = {
      employeeId: employee.id,
      startMinutes,
      duration,
    };
  }

  resetPreview() {
    this.previewState = null;
  }

  getTooltip(startMinutes: number, duration: number): string {
    const start = new Date(0, 0, 0, 0, startMinutes);
    const end = new Date(0, 0, 0, 0, startMinutes + duration);

    const format = (d: Date) =>
      d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

    return `${format(start)} – ${format(end)}`;
  }

  getTop(startMinutes: number): number {
    return startMinutes * this.pixelsPerMinute;
  }

  getItemHeight(duration: number): number {
    return duration * this.pixelsPerMinute;
  }

  getLeft(employeeId: string): number {
    const index = this.employees.findIndex((e) => e.id === employeeId);
    return index * this.columnWidth;
  }
}
