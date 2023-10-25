"use client";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

//Aniadir a la firestore
async function addListToFirebase(title) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      createdAt: serverTimestamp(),
    });
    console.log("Todo added with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding todo: ", error);
    return false;
  }
}

//Buscar en la firestore
async function fetchTodosFromFirestore() {
  const todosCollection = collection(db, "todos");
  const querySnapshot = await getDocs(
    query(todosCollection, orderBy("createdAt", "desc"))
  );
  const todos = [];
  querySnapshot.forEach((doc) => {
    const todoData = doc.data();
    todos.push({ id: doc.id, ...todoData });
  });
  return todos;
}

//Borrar en la firestore
async function deleteTodoFromFirestore(todoId) {
  try {
    console.log("Attempting to delete todo with ID: ", todoId);
    await deleteDoc(doc(db, "todos", todoId));
    return todoId;
  } catch (error) {
    console.error("Error deleting todo: ", error);
    return null;
  }
}

export default function Home() {
  const [title, setTitle] = useState("");

  const [todos, setTodos] = useState([]);

  const [selectedTodo, setSelectedTodo] = useState(null);

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      if (selectedTodo) {
        try {
          const updatedTodo = {
            title,
          };

          const todoRef = doc(db, "todos", selectedTodo.id);
          await updateDoc(todoRef, updatedTodo);

          setTitle("");
          setSelectedTodo(null);
          setIsUpdateMode(false);

          await fetchTodosAndUpdateState();
          alert("Todo updated succesfully");
        } catch (error) {
          console.error("Hay un error", error);
        }
      }
    } else {
      const added = await addListToFirebase(title);
      if (added) {
        setTitle("");
        await fetchTodosAndUpdateState();
        alert("Todo ha sido aniadido a la firestore");
      }
    }
  };

  useEffect(() => {
    async function fetchTodos() {
      const todos = await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  const handleUpdateClick = (todo) => {
    setTitle(todo.title || "");

    setSelectedTodo(todo);
    setIsUpdateMode(true);
  };

  useEffect(() => {
    async function fetchTodos() {
      const todos = await fetchTodosFromFirestore();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  //Funcion para actualizar los States
  async function fetchTodosAndUpdateState() {
    const todos = await fetchTodosFromFirestore();
    setTodos(todos);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* Seccion de la izquierda */}
      <section className="flex w-3/4 mb-4 justify-center">
        {/* Todo Form */}
        <div className=" items-center p-6 md:p-12 mt-10 rounded-lg shadow-lg w-3/5 bg-white">
          <h2 className="text-center text-2x1 font-bold leading-9 text-gray-900">
            {isUpdateMode ? "Update Your Todo" : "Todo List"}
          </h2>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {/* Para la parte de Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-center"
              ></label>
              <div className="flex mt-2 ">
                <input
                  id="title"
                  name="title"
                  type="text"
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-5/6 rounded border py-2 pl-2 text-gray-900 dhadow ring mr-4"
                ></input>

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  className="w-1/6 bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700"
                >
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Seccion de abajo */}

      <section className="flex w-3/4 mb-4 justify-center">
        {/* Todo List */}
        <div className="items-center p-6 md:p-12 mt-10 rounded-lg shadow-xl w-3/5 bg-white">
          {/* Todo Items */}
          <div className="mt-1 space-y-6">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="border p-4 rounded-sm shadow-md flex"
              >
                  <h3 className="text-lg font-semibold text-gray-900 break-words capitalize w-9/12">
                    {todo.title}
                  </h3>
                  <Button
                    variant="contained"
                    startIcon={<UpdateIcon/>}
                    className=" bg-blue-500 hover:bg-blue-600 rounded"
                    onClick={() => handleUpdateClick(todo)}
                  />
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={async () => {
                      const deletedTodoId = await deleteTodoFromFirestore(
                        todo.id
                      );
                      if (deletedTodoId) {
                        const updatedTodos = todos.filter(
                          (t) => t.id !== deletedTodoId
                        );
                        setTodos(updatedTodos);
                      }
                    }}
                    className=" bg-red-500 hover:bg-red-600 rounded ml-4"
                  />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
