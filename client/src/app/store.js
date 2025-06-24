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
  },
});

export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
