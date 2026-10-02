import { createSlice } from "@reduxjs/toolkit";

const readStoredUser = () => {
  try {
    const value = localStorage.getItem("userInfo");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readStoredUser(),
    hydrated: false,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    setHydrated(state) {
      state.hydrated = true;
    },
  }
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;

export { authActions, authReducer };
