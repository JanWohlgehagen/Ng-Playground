export interface Task {
  id: string;
  title: string;
  category: 'paint' | 'plate' | 'electric';
  registrationNumber: string;
  workUnits: number; // 10 units = 1 hour
  assignedTo?: string;
  start?: Date;
  end?: Date;
}
