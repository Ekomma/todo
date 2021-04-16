import * as express from 'express';
import Todo from '../model/todoModel';
import {getAllData, postData, updateData, deleteData} from '../controllers/todoControllers'

const router = express.Router();

/* get all data */
router.get('/api', async (req, res, next) => {
  try {
    const response = await getAllData(req.query, req.session.user)
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});
/* login or todos page */
router.get('/',  async function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  res.render('user-todos');
});

/* get single data */
router.get('/api/:id', async function (req, res) {
  const singleData = await Todo.find({ id: req.params.id });
  if (!singleData) {
    res.status(404).send(`data not found`);
  } else {
    res.send(singleData);
  }
});

/* post data */
router.post('/api', async function (req, res) {
  try {
    const response = await postData(req.body, req.session.user);
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error)
  }
});

/* update data */
router.put('/api/:id', async function (req, res) {
  try {
    const response = await updateData(req.body, req.params)
    res.send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* delete data */
router.delete('/api/:id', async function (req, res) {
  try {
    const response = await deleteData(req.params);
    res.send({ message: `Data with id: ${req.params.id} has been removed` });
  } catch (error) {
    res.send(error);
  }
});

export default router;
