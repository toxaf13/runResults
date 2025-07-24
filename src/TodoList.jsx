import React, { useState } from "react";
import "./TodoList.css"; // Створимо цей файл для стилів

function TodoList() {
  const [todos, setTodos] = useState([]); // Стан для зберігання завдань
  const [newTodo, setNewTodo] = useState(""); // Стан для нового завдання, яке вводить користувач

  // Додаємо нове завдання
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return; // Не додаємо порожні завдання

    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo, completed: false }, // Генеруємо унікальний ID
    ]);
    setNewTodo(""); // Очищаємо поле вводу
  };

  // Перемикаємо статус "виконано"
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Видаляємо завдання
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-list-container">
      <h2>Твої Завдання</h2>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Додати нове завдання"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)} // Виправлено e.target.target.value на e.target.value
          className="todo-input"
        />
        <button type="submit" className="add-todo-button">
          Додати
        </button>
      </form>

      <ul className="todo-items">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-todo-button"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="no-todos-message">Поки що немає завдань! Додай щось.</p>
      )}
    </div>
  );
}

export default TodoList;
