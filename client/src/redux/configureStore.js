import { createStore } from 'redux';
import modules from './modules';

//To-do 미들웨어, react-hot-loader 적용
const configureStore = initalState => {
  const store = createStore(
    modules,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
};

export default configureStore;
