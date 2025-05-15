// services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'Prep paint surface',
      category: 'paint',
      registrationNumber: 'DX879',
      workUnits: 15,
    },
    {
      id: '2',
      title: 'Install plates',
      category: 'plate',
      registrationNumber: 'DX880',
      workUnits: 20,
    },
    {
      id: '3',
      title: 'Wiring check',
      category: 'electric',
      registrationNumber: 'DX881',
      workUnits: 25,
    },
  ]);

  private employeesSubject = new BehaviorSubject<Employee[]>([
    { name: 'John Doe', department: 'paint' },
    { name: 'Jane Smith', department: 'plate' },
    { name: 'Alice Johnson', department: 'electric' },
    { name: 'Bob Brown', department: 'paint' },
    { name: 'Charlie Davis', department: 'plate' },
    { name: 'Diana Evans', department: 'electric' },
    { name: 'Ethan Foster', department: 'paint' },
    { name: 'Fiona Green', department: 'plate' },
    { name: 'George Harris', department: 'electric' },
    { name: 'Hannah Ives', department: 'paint' },
    { name: 'Ian Jones', department: 'plate' },
    { name: 'Jack King', department: 'electric' },
    { name: 'Kathy Lee', department: 'paint' },
    { name: 'Liam Miller', department: 'plate' },
    { name: 'Mia Nelson', department: 'electric' },
    { name: 'Olivia Parker', department: 'plate' },
    { name: 'Paul Quinn', department: 'electric' },
    { name: 'Quinn Roberts', department: 'paint' },
    { name: 'Rachel Smith', department: 'plate' },
    { name: 'Sam Taylor', department: 'electric' },
  ]);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.getValue();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...updatedTask };
      this.tasksSubject.next([...tasks]);
    }
  }
}
