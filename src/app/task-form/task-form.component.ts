import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnChanges {
  @Input() categoryId: string = '';
  @Input() task: Task | null = null;
  @Output() taskFormToggled = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue(this.task);
    }
  }

  toggleTaskForm(): void {
    this.taskFormToggled.emit();
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        categoryId: this.categoryId
      };

      if (this.task) {
        const result = this.taskService.updateTask(this.task.id, taskData);
        this.showMessage(result.message, result.color);

        if (result.success) {
          this.taskForm.reset();
          this.toggleTaskForm();
        }
      } else {
        const result = this.taskService.addTask(taskData);
        this.showMessage(result.message, result.color);
        if (result.success) {
          this.taskForm.reset();
          this.toggleTaskForm();
        }
      }
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  showMessage(message: string, color: string): void {
    const container = document.getElementById('message-container');
    if (container) {
      container.innerHTML = `<div class="p-4 mb-4 text-white ${color} rounded-xl">
                               ${message}
                             </div>`;
      setTimeout(() => (container.innerHTML = ''), 3000);
    }
  }
}