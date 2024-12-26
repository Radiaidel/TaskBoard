// task-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { TaskPriority } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent {
  @Input() categoryId: string = '';
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

  toggleTaskForm(): void {
    this.taskFormToggled.emit();
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const result = this.taskService.addTask({
        ...this.taskForm.value,
        categoryId: this.categoryId
      });

      if (result.success) {
        this.taskForm.reset();
        this.toggleTaskForm();
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
}
