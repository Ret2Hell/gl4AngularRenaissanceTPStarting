import { Component } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  newName: string = '';
  newContent: string = '';

  constructor(public todoService: TodoService) {}

  addTodo() {
    if (this.newName.trim() && this.newContent.trim()) {
      this.todoService.addTodo(this.newName, this.newContent);
      this.newName = '';
      this.newContent = '';
    }
  }

  changeStatus(id: number, newStatus: TodoStatus) {
    this.todoService.changeStatus(id, newStatus);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}