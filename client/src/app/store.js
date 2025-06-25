import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false, email: '' },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.email = action.payload.email;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.email = '';
    },
    signUp(state, action) {
      state.isLoggedIn = true;
      state.email = action.payload.email;
    },
  },
});

export const { login, logout, signUp } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
