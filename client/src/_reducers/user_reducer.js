import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types';


export default function(state = {}, action) {  // prevState, action
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }
      break;

    case REGISTER_USER:
      return { ...state, register: action.payload }
      break;

    case AUTH_USER:
      return { ...state, userData: action.payload } // action.payload에 유저의 모든 데이터가 담겨서 옴
      break;  

    default:
      return state;
  }
}