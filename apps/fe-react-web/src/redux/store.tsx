import userSlice from "@/redux/User/user-slice";
import modalSlice from "@/redux/modal/modal-slice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: userSlice,
    modal: modalSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
