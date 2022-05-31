import { createSlice } from "@reduxjs/toolkit";
export const userIdentityMode = createSlice({
  name: "userIdentityMode",
  initialState: {
    value: null,
  },
  reducers: {
    changeUserIdentityState: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { changeUserIdentityState } = userIdentityMode.actions;

export default userIdentityMode.reducer;
