import { combineReducers } from "redux";
/* 
    다양한 Reducer 들이 있을 수 있는데 combineReducers 를 이용해서
    rootReducer 안에서 하나로 합쳐줌.
*/ 

// import user from './user_reducer';
// import comment from './comment_reducer';


const rootReducer = combineReducers({
    // user, comment, ...
})

export default rootReducer;