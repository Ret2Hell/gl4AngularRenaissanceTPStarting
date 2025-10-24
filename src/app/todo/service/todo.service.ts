import { Injectable, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([]);
  private nextId = signal(1);

  waitingTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'waiting')
  );
  inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in progress')
  );
  doneTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'done')
  );

  //Ajouter un todo
  addTodo(name: string, content: string) {
    const newTodo = new Todo(this.nextId(), name, content);
    this.todos.update((current) => [...current, newTodo]);
    this.nextId.update((id) => id + 1);
  }

  //Changer le statut d'un todo
  changeStatus(id: number, newStatus: TodoStatus) {
    this.todos.update((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  }

  // Supprimer un todo
  deleteTodo(id: number) {
    this.todos.update((current) => current.filter((todo) => todo.id !== id));
  }
}
