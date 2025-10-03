"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
  isUserAuthenticated: false,
};

export const userTokenSlice = createSlice({
  name: "userToken",
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload.userToken;
      state.isUserAuthenticated = action.payload.isUserAuthenticated;
    },
    clearUserTokens: (state) => {
      state.userToken = null;
      state.isUserAuthenticated = false;
    },
  },
});

export const { setUserToken, clearUserTokens } = userTokenSlice.actions;

export default userTokenSlice.reducer;
