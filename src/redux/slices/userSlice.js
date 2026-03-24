import {createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";


const initialState = {
    isLoggedIn: false,
    user: null,
    token: "",
}

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
       setCurrentUser(state, action) {
           state.isLoggedIn = true;
           state.user = action.payload;
       },
       setLoggedInOut(state, action) {
           state.isLoggedIn = action.payload;
           state.user = null;
       },
       setToken(state, action){
           state.token = action.payload;
       }
   }
})


const userReducer = userSlice.reducer

export const {setCurrentUser, setLoggedInOut, setToken} = userSlice.actions;

export default userReducer;