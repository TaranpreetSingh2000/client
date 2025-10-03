import { configureStore } from "@reduxjs/toolkit";
import expertReducer from "@/redux/features/expertSlice";
import tokenReducer from "@/redux/features/tokenSlice";
import userTokenReducer from "@/redux/features/userTokenSlice";

export const store = configureStore({
  reducer: {
    expert: expertReducer,
    token: tokenReducer,
    userToken: userTokenReducer,
  },
});
