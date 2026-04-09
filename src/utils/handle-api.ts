import axios from 'axios';
import React from 'react';

const baseURL = 'https://todo-app-express-backend-rtbt.onrender.com';

export interface FetchedTaskItem {
  _id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

export const getAllTasks = (setTasks: React.Dispatch<React.SetStateAction<FetchedTaskItem[]>>) => {
  axios.get<FetchedTaskItem[]>(`${baseURL}`).then(({ data }) => {
    setTasks(data);
  }).catch((err) => console.log(err));
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: Date | null,
  setText: React.Dispatch<React.SetStateAction<string>>,
  setTasks: React.Dispatch<React.SetStateAction<FetchedTaskItem[]>>
) => {
  axios
    .post(`${baseURL}/save`, {
      text,
      completed,
      dueDate: dueDate ? dueDate.toISOString() : null,
    })
    .then(() => {
      setText('');
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: Date | null,
  setTasks: React.Dispatch<React.SetStateAction<FetchedTaskItem[]>>,
  setText: React.Dispatch<React.SetStateAction<string>>,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  axios
    .post(`${baseURL}/update`, {
      _id: taskId,
      text,
      completed,
      dueDate: dueDate ? dueDate.toISOString() : null,
    })
    .then(() => {
      setText('');
      setIsUpdating(false);
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<FetchedTaskItem[]>>
) => {
  axios
    .post(`${baseURL}/delete`, { _id })
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteAllTasks = (
  setTasks: React.Dispatch<React.SetStateAction<FetchedTaskItem[]>>
) => {
  axios
    .post(`${baseURL}/deleteAll`)
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};
