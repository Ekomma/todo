import * as express from 'express';
import { login, register } from '../controllers/usersControllers';
const router = express.Router();

/* Get login page */
router.get('/', (req, res) => {
  res.render('login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async function loginRoute(req, res) {
  const data = req.body;
  try {
    const record = await login(data);
    req.session.user = { email: record.email };

    res.redirect('/user-todos');
  } catch (e) {
    res.status(400).render('login', { error: e });
  }
});

/* Get register page */
router.get('/register', function resterPage(req, res) {
  res.render('register');
});

router.post('/register', async function registerRoute(req, res, next) {
  const data = req.body;
  try {
    const record = await register(data);
    req.session.user = {
      Username: record.email,
    };
    res.status(201).redirect('/user-todos');
  } catch (e) {
    res.status(400).render('register', { error: e });
  }
});
/* Logging out */
router.get('/logout', function logout(req, res) {
  req.session.destroy(console.log);
  res.redirect("/");
})
export default router;
