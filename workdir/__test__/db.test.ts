import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
import User from '../model/usersModel';
import Todo from '../model/todoModel';
import { v4 as uuid } from 'uuid';


beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  });

afterAll(async () => {
  await Todo.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('Test for Todo DB', () => {
  it('connect and create todo successfully', async () => {
    const mockdata = {
      id: uuid(), created: "2021-03-05T17:17:39.264Z", text: "Motivatation", userEmail: "test.user@gmail.com"
    };
    const testTodo = new Todo(mockdata);
    const persistTodo = await testTodo.save();

    expect(persistTodo.id).toBeDefined();
    expect(persistTodo.created).toBe(mockdata.created);
    expect(persistTodo.text).toBe(mockdata.text);
    expect(persistTodo.userEmail).toBe(mockdata.userEmail);

  });

});

describe('Test for User DB', () => {
  it('connect and create User successfully', async () => {
    const mockUserData = {
  firstname: "Ogheneovo", lastname: "Eko", email: "ovoeko@gmail.com", password: "myp455w0rd"};
    const testUser = new User(mockUserData);
    const persistTodo = await testUser.save();

    expect(persistTodo._id).toBeDefined();
    expect(persistTodo.firstname).toBe(mockUserData.firstname);
    expect(persistTodo.lastname).toBe(mockUserData.lastname);
    expect(persistTodo.email).toBe(mockUserData.email);
    expect(persistTodo.password).toBe(mockUserData.password);
  });

});
