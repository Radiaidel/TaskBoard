export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum TaskStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  NOT_STARTED = 'not_started'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  categoryId: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: TaskStatus;
}
