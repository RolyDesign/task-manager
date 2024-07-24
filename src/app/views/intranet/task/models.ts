export type TaskStatus =
  | 'Pendiente'
  | 'En progreso'
  | 'Completada'
  | 'Aprobada';

export interface ITaskGetDTO {
  id: number;
  name: string;
  description: string;
  userId: number;
  status: TaskStatus;
  approvedUserId: number;
  approvedUserName: number;
  creatorName: string;
  initialsName: string;
}
export interface ITaskCreateDTO {
  name: string;
  description: string;
  userId: number;
  status: TaskStatus;
  approvedUserId: number;
  initialsName: string;
  creatorName: string;
}
export interface ITaskUpdateDTO {
  name: string;
  description: string;
  userId: number;
  status: TaskStatus;
  approvedUserId: number;
  initialsName: string;
  creatorName: string;
}
