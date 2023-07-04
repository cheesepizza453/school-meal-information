import { createSlice } from "@reduxjs/toolkit";

const schoolSlice = createSlice({
  name: "school",
  initialState: {
    schoolName: "",
    schoolNameCode: "",
  },
  reducers: {
    setSchoolName: (state, action) => {
      state.schoolName = action.payload;
    },
    setSchoolNameCode: (state, action) => {
      state.schoolNameCode = action.payload;
    },
  },
});

export const { setSchoolName, setSchoolNameCode } = schoolSlice.actions;
export default schoolSlice.reducer;
