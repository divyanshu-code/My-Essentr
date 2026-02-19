// redux means a state management library for javascript applications which store the global state or data of the application in a central place called store. instead of passing the data from one component to another using props we can access the data directly from the store using useSelector hook provided by react-redux library.

// earlier we used a context API for state management but it has some limitations like performance issues and boilerplate code. so to overcome these limitations we use redux toolkit which is an official, opinionated, batteries-included toolset for efficient Redux development.

// before using the redux toolkit we need to install it first using npm i @reduxjs/toolkit , react-redux
// then we have to create a store.js file in the redux folder
// store means a central place to store the global state or data of the application

// In redux toolkit we have to create a slice for each feature of the application. slice means a part of the global state or data of the application. each slice contains the initial state, reducers and actions.

// In redux mainly 2 state used 
// usedispatch : used to dispatch or trigger the actions to update the state in the store
// useselector : used to access the state from the store

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";

export const store =  configureStore({
    reducer: {
        user : userSlice,
        cart : cartSlice
    },
})