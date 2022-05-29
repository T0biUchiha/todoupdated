import React, { useState, useEffect } from "react";
import styles from "./todo.module.css";
import axios from "axios";

const Todos = () => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isCompleted, setIsCompleted] = useState(todos.isCompleted);

  const [TodoEditing, setTodoEditing] = useState(null);
  const [EditingText, setEditingText] = useState("");

  const saveInfo = () => {
    fetch("http://localhost:3004/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        value: newTodo,
        isCompleted: false,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setTodos([...todos, d]);
        setNewTodo("");
      });
  };

  useEffect(() => {
    const getTodo = async () => {
      let r = await axios.get(
        `http://localhost:3004/todos?_page=${page}&_limit=${limit}`
      );
      console.log(r.data);
      setTodos(r.data);
      setTotalCount(Number(r.headers["x-total-count"]));
    };
    getTodo();

    // fetch("http://localhost:3004/todos")
    //   .then((r) => r.json())
    //   .then((d) => {
    //     console.log("love",d);
    //     setTodos(d);
    //   });
  }, [page, limit]);

  const onDelete = (id) => {
    let newTodos = todos.filter((todo) => todo.id !== id);
    fetch("http://localhost:3004/todos", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        newTodos,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        // setTodos([...newTodos, d]);
        setNewTodo("");
        // getTodo();
        setTodos(newTodos);
      });
  };

  const editTodo = (id) => {
    let updatedTodo = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.value = EditingText;
      }
      return todo;
    });

    fetch("http://localhost:3004/todos", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        value: EditingText,
        isCompleted: false,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setTodos(updatedTodo);
        setTodoEditing(null);
        setEditingText("");
      });
  };

  return (
    <div>
      <h1>Todos</h1>
      <h3>What you want to do today?</h3>
      <div>
        <div className={styles.main1}>
          <input
            placeholder="Add a todo here"
            value={newTodo}
            onChange={({ target }) => setNewTodo(target.value)}
          />
          <button onClick={saveInfo}>+</button>
        </div>

        <div className={styles.selectDiv}>
          <h3>View List with</h3>
          <select
            className={styles.selectTAg}
            name=""
            id=""
            onChange={(e) => {
              setLimit(Number(e.target.value));
            }}
          >
            <option className={styles.options} value="5">5</option>
            <option className={styles.options} value="10">10</option>
            <option className={styles.options} value="20">20</option>
            <option className={styles.options} value="30">30</option>
          </select>
          <h3>List Items</h3>
        </div>

        <div className={styles.main2}>
          {todos.map((todo) => (
            <div key={todo.id} className={styles.Lists}>
              <div className={styles.Lists1}>
                <h3>{todo.id})</h3>
                <input
                  className={styles.TodoList}
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                  }}
                />

                {TodoEditing === todo.id ? (
                  <input
                    className={styles.editInput}
                    placeholder={todo.value}
                    type="text"
                    onChange={(e) => setEditingText(e.target.value)}
                    value={EditingText}
                  />
                ) : (
                  <div>{todo.value}</div>
                )}
              </div>

              <div className={styles.btnDIv}>
                <button
                  className={styles.btn1}
                  onClick={() => onDelete(todo.id)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3096/3096750.png"
                    alt=""
                  />
                </button>

                {TodoEditing !== todo.id ? (
                  <button
                    className={styles.btn2}
                    onClick={() => setTodoEditing(todo.id)}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1828/1828032.png"
                      alt=""
                    />
                  </button>
                ) : (
                  <button
                    className={styles.btn3}
                    onClick={() => editTodo(todo.id)}
                  >
                    <img
                      src="https://cdn-icons.flaticon.com/png/512/5290/premium/5290058.png?token=exp=1653403305~hmac=0416abc01ad73bfaa88c30f3ec7abf11"
                      alt=""
                    />
                  </button>
                )}

                {/* <img src="https://cdn-icons-png.flaticon.com/512/1828/1828970.png" /> */}
              </div>
            </div>
          ))}
        </div>
        <button
          className={styles.prevbtn}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <button
          className={styles.nextbtn}
          disabled={totalCount < page * limit}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Todos;
