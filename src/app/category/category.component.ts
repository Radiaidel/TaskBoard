import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() searchQuery: string = '';
  categories: string[] = [];
  tasks: { [categoryId: string]: Task[] } = {};
  showForm: boolean = false;
  selectedCategoryId: string = '';
  private taskSubscription!: Subscription;
  taskToEdit: Task | null = null;

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    const initialTasks = this.taskService.getTasks();
    this.categories.forEach(categoryId => {
      this.tasks[categoryId] = initialTasks.filter(task => task.categoryId === categoryId);
    });

    this.taskSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.categories.forEach(categoryId => {
        this.tasks[categoryId] = tasks.filter(task => task.categoryId === categoryId);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.searchTasks();
    }
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

  toggleTaskForm(categoryId: string, task: Task | null = null): void {
    this.selectedCategoryId = categoryId;
    this.showForm = !this.showForm;
    this.taskToEdit = task;
  }

  onTaskStatusChanged(event: { taskId: string, newStatus: Task['status'] }): void {
    this.taskService.updateTaskStatus(event.taskId, event.newStatus);
    this.loadTasks();
  }

  onTaskDeleted(taskId: string): void {
    this.loadTasks();
  }

  onTaskEdited(task: Task): void {
    this.selectedCategoryId = task.categoryId;
    this.showForm = true;
    this.taskToEdit = task;
  }

  searchTasks(): void {
    if (this.searchQuery) {
      this.taskService.searchTasks(this.searchQuery).subscribe(searchResults => {
        this.tasks = {};
        searchResults.forEach(task => {
          if (!this.tasks[task.categoryId]) {
            this.tasks[task.categoryId] = [];
          }
          this.tasks[task.categoryId].push(task);
        });
      });
    } else {
      this.loadTasks();
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

  addCategory(categoryName: string): void {
    const result = this.categoryService.addCategory(this.categories, categoryName);
    this.showMessage(result.message, result.color);
  }

  deleteCategory(index: number): void {
    const result = this.categoryService.deleteCategory(this.categories, index);
    this.showMessage(result.message, result.color);
  }

  updateCategoryName(event: any, index: number): void {
    const result = this.categoryService.updateCategory(this.categories, index, event.target.value);
    this.showMessage(result.message, result.color);
  }
}