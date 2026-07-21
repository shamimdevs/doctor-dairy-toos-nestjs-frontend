import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  primaryTree: 0,
  secondaryTree: "",
  sidebarStatus: false,
  sidebarMobileStatus: false,
};

const sidebarSlice = createSlice({
  name: "adminTree",
  initialState,
  reducers: {
    setPrimaryTree: (state, action) => {
      state.primaryTree = action.payload;
    },
    setSecondaryTree: (state, action) => {
      state.secondaryTree = action.payload;
    },
    // resetTree: (state) => {
    //   state.primaryTree = "";
    //   state.secondaryTree = "";
    // },
    sidebarToggle: (state) => {
      state.sidebarStatus = !state.sidebarStatus;
    },
    sidebarMobileToggle: (state) => {
      state.sidebarMobileStatus = !state.sidebarMobileStatus;
    },
  },
});

export const {
  setPrimaryTree,
  sidebarMobileToggle,
  sidebarToggle,
  setSecondaryTree,
  //   resetTree,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
