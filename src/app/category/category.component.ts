import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit , OnDestroy  {
  categories: string[] = [];
  tasks: { [categoryId: string]: Task[] } = {};
  showForm: boolean = false;
  selectedCategoryId: string = '';
  private taskSubscription: Subscription;


  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {
    this.taskSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.categories.forEach(categoryId => {
        this.tasks[categoryId] = tasks.filter(task => task.categoryId === categoryId);
      });
    });
  }

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  loadTasks(): void {
    this.categories.forEach(categoryId => {
      this.tasks[categoryId] = this.taskService.getTasksByCategory(categoryId);
    });
  }

  toggleTaskForm(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.showForm = !this.showForm;
  }

  onTaskStatusChanged(event: {taskId: string, newStatus: Task['status']}): void {
    this.taskService.updateTaskStatus(event.taskId, event.newStatus);
    this.loadTasks();
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

  addCategory(categoryName: string): void {
    const result = this.categoryService.addCategory(this.categories, categoryName);
    this.showMessage(result.message, result.color);
  }

  deleteCategory(index: number): void {
   const  result = this.categoryService.deleteCategory(this.categories, index);
    this.showMessage(result.message, result.color);
  }

  updateCategoryName(event: any, index: number): void {
    const result = this.categoryService.updateCategory(this.categories, index, event.target.value);
    this.showMessage(result.message, result.color);
  }


}
