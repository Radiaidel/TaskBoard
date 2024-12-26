import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());

  constructor() {}

  private loadTasks(): Task[] {
    const tasks = localStorage.getItem(this.STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTasksByCategory(categoryId: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.categoryId === categoryId))
    );
  }

  createTask(taskDto: CreateTaskDTO): void {
    const tasks = this.loadTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskDto,
      status: TaskStatus.NOT_STARTED,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.saveTasks([...tasks, newTask]);
  }

  updateTask(taskId: string, updateDto: UpdateTaskDTO): void {
    const tasks = this.loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updateDto,
        updatedAt: new Date()
      };
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.loadTasks();
    this.saveTasks(tasks.filter(task => task.id !== taskId));
  }

  getTaskStatistics(categoryId?: string): Observable<{
    completedPercentage: number;
    pendingPercentage: number;
    overdueTasks: number;
  }> {
    return this.getTasks().pipe(
      map(tasks => {
        const filteredTasks = categoryId
          ? tasks.filter(task => task.categoryId === categoryId)
          : tasks;

        const totalTasks = filteredTasks.length;
        const completedTasks = filteredTasks.filter(
          task => task.status === TaskStatus.COMPLETED
        ).length;
        const overdueTasks = filteredTasks.filter(
          task => new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
        ).length;

        return {
          completedPercentage: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
          pendingPercentage: totalTasks ? ((totalTasks - completedTasks) / totalTasks) * 100 : 0,
          overdueTasks
        };
      })
    );
  }
}
