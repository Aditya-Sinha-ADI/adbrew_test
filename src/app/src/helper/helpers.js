import { addTodoToServer, fetchTodosFromServer } from "../api/api";

export const handleFormSubmit = async (todoInput, setTodoInput, setTodos) => {
  if (!isValidInput(todoInput)) return;

  const newTodo = { title: todoInput.trim(), description: "" };

  if (await addTodoToServer(newTodo)) {
    setTodoInput("");
    fetchTodosFromServer(setTodos);
  }
};

export const isValidInput = (input) => {
  return input.trim() !== "";
};
