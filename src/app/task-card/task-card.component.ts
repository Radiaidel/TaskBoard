import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() statusChanged = new EventEmitter<{taskId: string, newStatus: Task['status']}>();
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskEdited = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {}

  onStatusChange(newStatus: Task['status']) {
    this.statusChanged.emit({ taskId: this.task.id, newStatus });
  }

  deleteTask() {
    const result = this.taskService.deleteTask(this.task.id);
    if (result.success) {
      this.taskDeleted.emit(this.task.id);
    }
  }

  editTask() {
    this.taskEdited.emit(this.task);
  }
}