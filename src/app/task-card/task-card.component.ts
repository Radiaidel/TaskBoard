  import { Component, Input, Output, EventEmitter } from '@angular/core';
  import { Task } from '../models/task.model';
  @Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.scss'
  })
  export class TaskCardComponent {
    @Input() task!: Task;
    @Output() statusChanged = new EventEmitter<{taskId: string, newStatus: Task['status']}>();


    onStatusChange(newStatus: Task['status']) {
      this.statusChanged.emit({ taskId: this.task.id, newStatus });
    }
  }
