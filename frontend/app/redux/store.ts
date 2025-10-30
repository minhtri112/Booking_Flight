import { configureStore } from "@reduxjs/toolkit";
import ordersSlice from "./ordersSlice";

export const store = configureStore({
    reducer : {
        orders : ordersSlice
    }
})