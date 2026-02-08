export interface IScheduleResponse {
  id: string;
  membershipId: string;
  days: string[];
  times: string;
  note: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Interface for creating a new schedule
export interface ICreateSchedule {
  membershipId: string;
  schedule: string;
}

// Interface for updating an existing schedule
export interface IUpdateSchedule {
  schedule?: string;
}
