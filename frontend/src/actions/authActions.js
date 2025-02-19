import axios from 'axios';

export const login = (username, password) => async dispatch => {
  try {
    const response = await axios.post('/api/login', { username, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', error: error.message });
  }
};

export const logout = () => {
  return { type: 'LOGOUT' };
};
