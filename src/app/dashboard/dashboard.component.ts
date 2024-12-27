import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;
  overdueTasks: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter(task => task.status === 'completed').length;
      this.pendingTasks = tasks.filter(task => task.status !== 'completed').length;
      this.overdueTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
    });
  }

  get completedPercentage(): number {
    return this.totalTasks ? (this.completedTasks / this.totalTasks) * 100 : 0;
  }

  get pendingPercentage(): number {
    return this.totalTasks ? (this.pendingTasks / this.totalTasks) * 100 : 0;
  }
}