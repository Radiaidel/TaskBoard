import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  searchQuery: string = '';
  @ViewChild(CategoryComponent) categoryComponent!: CategoryComponent;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.categoryComponent) {
        this.categoryComponent.searchQuery = this.searchQuery;
      }
    });
  }

  searchTasks(): void {
    if (this.categoryComponent) {
      this.categoryComponent.searchQuery = this.searchQuery;
      this.categoryComponent.searchTasks();
    } else {
      console.error('CategoryComponent not found');
    }
  }
}