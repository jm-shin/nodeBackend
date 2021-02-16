import Joi from 'joi';
import User from '../../models/user';

//username, password
export const register = async ctx => {
  //회원가입
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = schema.validateAsync(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;

  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    const user = new User({
      username,
    });

    await user.setPassword(password);
    await user.save();
    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = data;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const login = async ctx => {
  //로그인
};

export const check = async ctx => {
  //로그인 상태확인
};

export const logout = async ctx => {
  //로그아웃
};
