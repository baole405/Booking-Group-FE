import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  createdId?: string;
  rejectDialogOpen: boolean;
  brandConfirmDialogOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  createdId: undefined,
  rejectDialogOpen: false,
  brandConfirmDialogOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    handleChangeModalState(state, action: PayloadAction<boolean>) {
      state.isOpen = action?.payload;
    },
    handleSetCreatedId(state, action: PayloadAction<string | undefined>) {
      state.createdId = action?.payload;
    },
    handleSetRejectDialogState: (state, action: PayloadAction<boolean>) => {
      state.rejectDialogOpen = action.payload;
    },
    handleSetBrandConfirmDialogState: (state, action: PayloadAction<boolean>) => {
      state.brandConfirmDialogOpen = action.payload;
    },
  },
});

export const { handleChangeModalState, handleSetCreatedId, handleSetBrandConfirmDialogState, handleSetRejectDialogState } = modalSlice.actions;

export default modalSlice.reducer;
