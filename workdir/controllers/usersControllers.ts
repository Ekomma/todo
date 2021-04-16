import User from '../model/usersModel';
import Joi from 'joi';
import bcrypt from 'bcrypt';

/* validate user */
const registerSchema = Joi.object({
  firstname: Joi.string().alphanum().max(16).min(3).required(),
  lastname: Joi.string().alphanum().max(16).min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(16).required(),
});

export async function login(data: Record<string, unknown>) {
  const errors: string[] = [];
  const user = await User.findOne({ email: data.email });
  if (!user) {
    errors.push('Invalid Username or Password');
    throw errors;
  }
  /* comparing passwords for login */
  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    errors.push('Invalid Username or Password');
    throw errors;
  } else {
    return user;
  }
}

export async function register(data: Record<string, unknown>) {
  const { error, value } = registerSchema.validate(data, {
    stripUnknown: true,
  });
  const errors = [];
  if (error?.details) errors.push(error.details[0].message);
  if (errors.length) {
    throw errors;
  }
  const emailExist = await User.findOne({ email: value.email });
  if (emailExist) {
    errors.push('Email already exist');
    throw errors;
  }

  const user = new User(value);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        throw err;
      } else {
        user.password = hash;
        user.save().then().catch(console.error);
      }
    });
  });

  return user;
}
