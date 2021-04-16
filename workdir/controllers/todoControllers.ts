import Todo from '../model/todoModel';
import { v4 as uuid } from 'uuid';
import * as express from 'express';

export async function getAllData(data:Record<string, any>, user:Record<string, unknown>) {
  let prev, next;
  let { limit = 5, page = 1 } = data;
  limit = Number(limit);
  page = Number(page);
  const count = await Todo.countDocuments();
  const totalPages = Math.ceil(count / 5);
  if (page > 1) {
    prev = `/user-todos/api?page=${page - 1}`;
  };
  if (page * limit < count) {
    next = `/user-todos/api?page=${page + 1}`;
  }
  const allTodos = await Todo.find().limit(limit).skip((page - 1) * limit);
  return { allTodos, prev, next, page, totalPages };
}

export async function postData(data:Record<string, unknown>, email:Record<string, unknown>) {
  const id = uuid();
  const newData = { ...data, id, userEmail: email.email };
  try {
    const result = await Todo.create(newData);
    return result;
  } catch (error) {
    throw error
  }
}

export async function updateData(data: Record<string, any>, param: Record<string, any>) {
  const singleData = await Todo.find({ id: param.id });
  if (!singleData) {
    throw Error(`todo not found`);
  } else {
    const newData = { ...singleData[0]._doc, ...data };
    await Todo.updateOne(
      { id: param.id },
      { text: data.text, created: data.created },
    );
    return newData;
  }
}

export async function deleteData(param:Record<string, any>) {
  const singleData = await Todo.find({ id: param.id });
  console.log(singleData);

  if (!singleData) {
    throw Error(`todo not found`)
  } else {
    return await Todo.deleteOne({ id: param.id });

  }
}

