import { createSlice, createAsyncThunk,PayloadAction } from "@reduxjs/toolkit";
import axios from "../../axios";
import { IUser, USER, } from "../../types";
import { ErrorResponse } from "react-router-dom";


export const fetchLogin = createAsyncThunk<IUser, USER>(
  "login",
  async (userCredentials: USER, thunkAPI) => {
    try {
      const response = await axios.post<IUser>(
        "/ru/data/v3/testmethods/docs/login",
        userCredentials,
      );
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse); 
    }
  }
);




enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  EMPTY = ''
  
}


interface IAuth {
  user: IUser | null;    
  isFetching: Status;    
  error: string | null;  
}


const initialState: IAuth = {
  user: null,
  isFetching: Status.EMPTY,
  error: null,
};


export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.isFetching = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isFetching = Status.SUCCESS;
        state.user = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isFetching = Status.ERROR;
        state.error = action.payload as string; 
      });
  },
});

export default authSlice.reducer;
