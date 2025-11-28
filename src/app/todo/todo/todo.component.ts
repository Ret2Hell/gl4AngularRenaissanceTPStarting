import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-todo',
    imports: [CommonModule, FormsModule],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  todoService = inject(TodoService);
  newName = signal('');
  newContent = signal('');

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

  handleTodoAction(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.tagName !== 'BUTTON') {
      return;
    }

    const action = target.getAttribute('data-action');
    const id = Number(target.getAttribute('data-id'));

    if (action === 'changeStatus') {
      const status = target.getAttribute('data-status') as
        | 'waiting'
        | 'in progress'
        | 'done';
      this.changeStatus(id, status);
    } else if (action === 'delete') {
      this.deleteTodo(id);
    }
  }
}
