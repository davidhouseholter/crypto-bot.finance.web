import { createSlice } from "@reduxjs/toolkit";
export const userTradeBotsMode = createSlice({
  name: "userTradeBotsMode",
  initialState: {
    value: null,
  },
  reducers: {
    changeUserTradeBotsState: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { changeUserTradeBotsState } = userTradeBotsMode.actions;

export default userTradeBotsMode.reducer;
