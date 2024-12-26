import { Component , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Output() taskFormToggled = new EventEmitter<void>(); // Émet l'événement vers le parent

  toggleTaskForm(): void {
    this.taskFormToggled.emit();
  }
}
