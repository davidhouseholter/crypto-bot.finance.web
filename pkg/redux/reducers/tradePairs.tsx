import { createSlice } from "@reduxjs/toolkit";
export const tradePairsMode = createSlice({
  name: "tradePairsMode",
  initialState: {
    value: null,
  },
  reducers: {
    changeTradePairState: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { changeTradePairState } = tradePairsMode.actions;

export default tradePairsMode.reducer;
