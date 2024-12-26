import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: string[] = [];
  showForm: boolean = false;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
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

  toggleTaskForm() {
    this.showForm = !this.showForm;
  }
}
