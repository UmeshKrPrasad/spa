// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (user) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", user);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = async (id, updatedUser) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${id}`, updatedUser);
      setUsers(users.map((user) => (user._id === id ? response.data : user)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return <UserContext.Provider value={{ users, addUser, editUser, deleteUser }}>{children}</UserContext.Provider>;
};
