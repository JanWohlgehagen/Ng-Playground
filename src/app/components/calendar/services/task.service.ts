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
    { id: '1', name: 'John Doe', department: 'paint' },
    { id: '2', name: 'Jane Smith', department: 'plate' },
    { id: '3', name: 'Alice Johnson', department: 'electric' },
    { id: '4', name: 'Bob Brown', department: 'paint' },
    { id: '5', name: 'Charlie Davis', department: 'plate' },
    { id: '6', name: 'Diana Evans', department: 'electric' },
    { id: '7', name: 'Ethan Foster', department: 'paint' },
    { id: '8', name: 'Fiona Green', department: 'plate' },
    { id: '9', name: 'George Harris', department: 'electric' },
    { id: '10', name: 'Hannah Ives', department: 'paint' },
    { id: '11', name: 'Ian Jones', department: 'plate' },
    { id: '12', name: 'Jack King', department: 'electric' },
    { id: '13', name: 'Kathy Lee', department: 'paint' },
    { id: '14', name: 'Liam Miller', department: 'plate' },
    { id: '15', name: 'Mia Nelson', department: 'electric' },
    { id: '16', name: 'Olivia Parker', department: 'plate' },
    { id: '17', name: 'Paul Quinn', department: 'electric' },
    { id: '18', name: 'Quinn Roberts', department: 'paint' },
    { id: '19', name: 'Rachel Smith', department: 'plate' },
    { id: '20', name: 'Sam Taylor', department: 'electric' },
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
