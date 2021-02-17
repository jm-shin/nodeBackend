import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});
UserSchema.methods.generataToken = function () {
  const token = jwt.sign(
    {
      //payload : 토큰안에 집어 넣고 싶은 데이터
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      //option: 7일간 유효
      expiresIn: '7d',
    },
  );
  return token;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

//인스턴스 메서드 작성시 화살표함수 X, function 키워드 사용 O.
//.methods는 this가 데이터 인스턴스를 가르킴
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; //true or false
};

//.statics는 this가 모델 자체를 가르킴.
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);
export default User;
