import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  selected: "dashboard",
  active: false,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, (state) => {
        customEntityAdapter.removeAll(state);
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelected, setActive } = homeSlice.actions;

export default homeSlice.reducer;
