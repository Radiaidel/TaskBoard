import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchQuery: string = '';

  constructor(public router: Router) {}

  searchTasks(): void {
    this.router.navigate(['/Tasks'], {
      queryParams: { search: this.searchQuery }
    });
  }
}