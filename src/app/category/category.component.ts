import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: string[] = [];
  ngOnInit() {

  }

  addCategory(category:string){
    this.categories.push(category);
  }
  updateCategoryName(event: any, index: number): void {
    this.categories[index] = event.target.value;
    console.log(this.categories);
  }

  deleteCategory(i:number){
    this.categories.splice(i , 1);
  }
}
