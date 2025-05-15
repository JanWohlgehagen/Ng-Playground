import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  tasks: Task[] = [];
  employees: Employee[] = [];
  drawerItems = [
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
    'hi',
  ];
  schedule: { date: Date; open: boolean }[] = [];

  constructor(
    private taskService: TaskService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
    this.taskService
      .getEmployees()
      .subscribe((employees) => (this.employees = employees));
    this.scheduleService
      .getSchedule()
      .subscribe((schedule) => (this.schedule = schedule));

    // const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    // this.daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }

  getCalenderHeight(): number {
    return this.schedule.length * 50 + 50; // Time slot height + top left corner padding
  }

  getCalenderWidth(): number {
    // Your logic here, e.g. based on time slots
    return this.employees.length * 170 + 100; // Employee width + top left corner padding
  }
}
