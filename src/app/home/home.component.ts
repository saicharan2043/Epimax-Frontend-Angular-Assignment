import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { NavbarComponent } from '../navbar/navbar.component';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  TodoList: Todo[] = [];

  title = '';
  description = '';
  category = 'Work';

  ngOnInit(): void {
    this.getData();
  }

  getData = async () => {
    const response = await fetch(
      'https://localhost:7010/api/TodoList/GetAllData'
    );
    const data = await response.json();

    this.TodoList = data;
  };

  deleteTodo = async (id: string) => {
    console.log(id);
    const response = await fetch(
      `https://localhost:7010/api/TodoList/DeleteTodoItem/${id}`,
      {
        method: 'DELETE',
      }
    );
    console.log(response.ok);
    if (response.ok) {
      this.TodoList = this.TodoList.filter(
        (eachValue: any) => eachValue.id !== id
      );
    }
  };

  addTodo = async () => {
    console.log(this.title);
    if (this.title !== '' && this.description !== '') {
      const url = 'https://localhost:7010/api/TodoList/PostNewItem';
      const userDetails = {
        id: uuidv4(),
        title: this.title,
        description: this.description,
        category: this.category,
        status: false,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      };
      const response = await fetch(url, options);
      if (response.ok) {
        this.TodoList.unshift(userDetails);
        this.title = '';
        this.description = '';
        this.category = 'Work';
      }
    }
  };

  updateStatus = async (item: any) => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isChecked: !item.status }),
    };
    const response = await fetch(
      `https://localhost:7010/api/TodoList/UpdateIsChecked/${item.id}`,
      options
    );
    console.log(response);
    if (response.ok) {
      this.TodoList.map((eachValue: any) => {
        if (eachValue.id === item.id) {
          return { ...eachValue, status: !eachValue.status };
        }
        return eachValue;
      });
    }
  };
}
