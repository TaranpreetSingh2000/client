"use client";
import { createSlice } from "@reduxjs/toolkit";

export const expertSlice = createSlice({
  name: "expert",
  initialState: "",
  reducers: {
    setExpert: (state, action) => {
      return action.payload;
    },
  },
});

export const { setExpert } = expertSlice.actions;

export default expertSlice.reducer;
