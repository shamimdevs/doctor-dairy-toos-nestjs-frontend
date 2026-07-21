import { OtpData } from "@/src/types/authType";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define a type for OTP data
interface OtpDataState {
  otpData: OtpData | null;
}

const initialState: OtpDataState = {
  otpData: null,
};
const otpSlice = createSlice({
  name: "otpData",
  initialState,
  reducers: {
    storeOTPData: (state, action: PayloadAction<OtpData>) => {
      state.otpData = action.payload;
    },
    removeOtpData: (state) => {
      state.otpData = null;
    },
  },
});

export const { storeOTPData, removeOtpData } = otpSlice.actions;
export default otpSlice.reducer;
