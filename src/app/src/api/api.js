export const fetchTodosFromServer = async (setTodos) => {
  try {
    const response = await fetch("http://localhost:8000/todos/");
    const data = await response.json();
    setTodos(data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

export const addTodoToServer = async (todo) => {
  try {
    const response = await fetch("http://localhost:8000/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    return response.ok;
  } catch (error) {
    console.error("Error adding todo:", error);
    return false;
  }
};
