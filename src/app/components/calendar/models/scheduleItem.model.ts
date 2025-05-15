export interface ScheduleItem {
  id: number;
  label: string;
  duration: number;
}

export interface ScheduledItem {
  id: number;
  label: string;
  duration: number; // in minutes
  startMinutes: number; // start time in minutes from 00:00
  employeeId: number;
}
