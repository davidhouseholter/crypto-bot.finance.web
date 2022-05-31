import { createSlice } from "@reduxjs/toolkit";

export const signalrRMode = createSlice({
  name: "signalrRMode",
  initialState: {
    value: null,
  },
  reducers: {
    onUpdateSignarState: (state, action) => {
      state.value = action.payload;
    },
    onUpdateOrderSignarState: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onUpdateSignarState, onUpdateOrderSignarState } = signalrRMode.actions;

export default signalrRMode.reducer;
