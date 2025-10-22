import { Injectable, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = signal<Todo[]>([]);

  waitingTodos = computed(() => this.todos().filter(todo => todo.status === 'waiting'));
  inProgressTodos = computed(() => this.todos().filter(todo => todo.status === 'in progress'));
  doneTodos = computed(() => this.todos().filter(todo => todo.status === 'done'));

  //Ajouter un todo
  addTodo(name: string, content: string) {
    const newId = this.todos().length + 1;
    const newTodo = new Todo(newId, name, content);
    this.todos.update(current => [...current, newTodo]);
  }

  //Changer le statut d'un todo
  changeStatus(id: number, newStatus: TodoStatus) {
    this.todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  }

  // Supprimer un todo
  deleteTodo(id: number) {
    this.todos.update(current => current.filter(todo => todo.id !== id));
  }
}