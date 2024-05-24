import "./App.css";
import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import { handleFormSubmit } from "./helper/helpers";
import { fetchTodosFromServer } from "./api/api";

export function App() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  const onChangeHandler = (event) => {
    setTodoInput(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    handleFormSubmit(todoInput, setTodoInput, setTodos);
  };

  useEffect(() => {
    fetchTodosFromServer(setTodos);
  }, []);

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>{todo.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input type="text" value={todoInput} onChange={onChangeHandler} />
          </div>
          <div style={{ marginTop: "5px" }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
