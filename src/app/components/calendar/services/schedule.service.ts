// services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private schedule = new BehaviorSubject<{ date: Date; open: boolean }[]>(
    this.generateSchedule()
  );

  getSchedule(): Observable<{ date: Date; open: boolean }[]> {
    return this.schedule.asObservable();
  }

  private generateSchedule(): { date: Date; open: boolean }[] {
    const intervals: { date: Date; open: boolean }[] = [];
    const now = new Date();
    const start = new Date(now.setHours(7, 0, 0, 0)); // 07:00 today
    const end = new Date(now.setHours(17, 0, 0, 0)); // 17:00 today

    for (let t = new Date(start); t < end; t.setMinutes(t.getMinutes() + 15)) {
      const hour = t.getHours();
      const open = hour >= 8 && hour < 16; // open only between 08:00 and 16:00
      intervals.push({ date: new Date(t), open });
    }

    return intervals;
  }
}
