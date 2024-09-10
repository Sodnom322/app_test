import { createSlice, createAsyncThunk,PayloadAction } from "@reduxjs/toolkit";
import axios from "../../axios";
import { IPost, tableData, } from "../../types";
import { ErrorResponse } from "react-router-dom";



export const fetchTables = createAsyncThunk(
  "table/get",
  async (token:string | null,thunkAPI) => {
    try {
      const response = await axios.get<IPost>(
        "/ru/data/v3/testmethods/docs/userdocs/get",
        {headers:{
            'x-auth':token      
        }}
      );
      return response.data;  
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse); 
    }
  }
);


export const addTableRow = createAsyncThunk(
  "table/addRow",
  async (newRow: tableData, thunkAPI) => {
    try {
      const token = localStorage.getItem("x-auth");
      const response = await axios.post("/ru/data/v3/testmethods/docs/userdocs/create", newRow, {
        headers: { 'x-auth': token },
      });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteTableRow = createAsyncThunk(
  "table/deleteRow",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("x-auth");
      await axios.delete(`/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, {
        headers: { 'x-auth': token },
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const updateTableRow = createAsyncThunk(
  "table/updateRow",
  async (updatedRow: tableData, thunkAPI) => {
    try {
      const token = localStorage.getItem("x-auth");
      const response = await axios.post(`/ru/data/v3/testmethods/docs/userdocs/set/${updatedRow.id}`, updatedRow, {
        headers: { 'x-auth': token },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);





enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  EMPTY = ''
  
}


interface ITable {
  tables: IPost | null;    
  isFetching: Status;    
  error: string | null;  
}


const initialState: ITable = {
    tables: null,
  isFetching: Status.EMPTY,
  error: null,
};


export const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
     updateTablesWithNewRow: (state, action: PayloadAction<tableData>) => {
      if (state.tables?.data) {
        state.tables.data.push(action.payload);  
      }
  }},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.isFetching = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action: PayloadAction<IPost>) => {
        state.isFetching = Status.SUCCESS;
        state.tables = action.payload; 
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.isFetching = Status.ERROR;
        state.error = action.payload as string; 
      })
    
   
      .addCase(addTableRow.fulfilled, (state, action: PayloadAction<tableData>) => {
        state.tables?.data.push(action.payload);
      })


      .addCase(deleteTableRow.fulfilled, (state, action: PayloadAction<string>) => {
        state.tables!.data = state.tables!.data.filter((row) => row.id !== action.payload);
      })

 
      .addCase(updateTableRow.fulfilled, (state, action: PayloadAction<tableData>) => {
        const index = state.tables!.data.findIndex((row) => row.id === action.payload.id);
        if (index !== -1) {
          state.tables!.data[index] = action.payload;
        }
      });
  },
});


export const {updateTablesWithNewRow} = tableSlice.actions
export default tableSlice.reducer;
