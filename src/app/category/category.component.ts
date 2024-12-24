import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  categories: string[] = ['Category name'];
  ngOnInit() {

  }

  addCategory(category:string){
    this.categories.push(category);
  }
  updateCategoryName(event: Event, index: number) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.categories[index] = inputValue;
    console.log(this.categories);
  }
}
