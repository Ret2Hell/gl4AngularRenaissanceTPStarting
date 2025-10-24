import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  newName = signal('');
  newContent = signal('');

  constructor(public todoService: TodoService) {}

  addTodo() {
    const name = this.newName().trim();
    const content = this.newContent().trim();

    if (name && content) {
      this.todoService.addTodo(name, content);
      this.newName.set('');
      this.newContent.set('');
    }
  }

  changeStatus(id: number, newStatus: TodoStatus) {
    this.todoService.changeStatus(id, newStatus);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }

  isFormValid(): boolean {
    return (
      this.newName().trim().length > 0 && this.newContent().trim().length > 0
    );
  }
}
