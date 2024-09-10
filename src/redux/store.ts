import { configureStore } from '@reduxjs/toolkit'
import login from './slices/auth'
import tables from './slices/tables'


export const store = configureStore({
  reducer: {
    login,
    tables
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch