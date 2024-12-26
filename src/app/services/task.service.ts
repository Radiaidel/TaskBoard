import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem(this.storageKey);
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.tasksSubject.next(tasks);
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getTasksByCategory(categoryId: string): Task[] {
    return this.getTasks().filter(task => task.categoryId === categoryId);
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): { success: boolean; message: string; color: string } {
    const tasks = this.getTasks();

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'not_started'
    };

    tasks.push(newTask);
    this.saveTasks(tasks);

    return {
      success: true,
      message: 'Tâche ajoutée avec succès !',
      color: 'bg-green-500'
    };
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = newStatus;
      this.saveTasks(tasks);
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }
}
