export type TodoStatus = 'waiting' | 'in progress' | 'done';

export class Todo {
  id: number;
  name: string;
  content: string;
  status: TodoStatus;

  constructor(id: number, name: string, content: string, status: TodoStatus = 'waiting') {
    this.id = id;
    this.name = name;
    this.content = content;
    this.status = status;
  }
}