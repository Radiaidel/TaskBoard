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

    if (!taskData.title || taskData.title.length > 100) {
      return {
        success: false,
        message: 'Le titre doit contenir entre 1 et 100 caractères.',
        color: 'bg-red-500'
      };
    }

    if (taskData.description && taskData.description.length > 500) {
      return {
        success: false,
        message: 'La description ne doit pas dépasser 500 caractères.',
        color: 'bg-red-500'
      };
    }

    if (taskData.dueDate && new Date(taskData.dueDate) < new Date()) {
      return {
        success: false,
        message: 'La date d\'échéance ne peut pas être dans le passé.',
        color: 'bg-red-500'
      };
    }

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

  updateTask(taskId: string, updatedData: Partial<Task>): { success: boolean; message: string; color: string } {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
      this.saveTasks(tasks);
      return {
        success: true,
        message: 'Tâche mise à jour avec succès !',
        color: 'bg-green-500'
      };
    }
    return {
      success: false,
      message: 'Tâche non trouvée.',
      color: 'bg-red-500'
    };
  }

  deleteTask(taskId: string): { success: boolean; message: string; color: string } {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      this.saveTasks(tasks);
      return {
        success: true,
        message: 'Tâche supprimée avec succès !',
        color: 'bg-green-500'
      };
    }
    return {
      success: false,
      message: 'Tâche non trouvée.',
      color: 'bg-red-500'
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