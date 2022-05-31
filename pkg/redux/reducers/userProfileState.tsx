import { createSlice } from "@reduxjs/toolkit";
export const userProfileMode = createSlice({
  name: "userProfileMode",
  initialState: {
    value: null,
  },
  reducers: {
    changeUserProfileState: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { changeUserProfileState } = userProfileMode.actions;

export default userProfileMode.reducer;
