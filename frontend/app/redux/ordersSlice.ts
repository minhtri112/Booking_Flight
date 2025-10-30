import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    account_id : '',
    flights : [],
    total_price : 0,
};

// {
//    flight_id : '',
//    seat_number : [{seat_number : '', value : 0, class : ''}],
//    count_passenger : 0,
//    price_per_ticket : 0,
//    dataFrom : '',
//    dataTo : '',
//    departure_airport_code : '',
//    arrival_airport_code : '',
//    passenger_details : [
//        {
//            passenger_type : String,
//            quantity : Number
//        }
//    ],
//    baggage_option : {
//         type : String,
//         price : Number
//     }
// }

const ordersSlice = createSlice({
    name : 'orders',
    initialState,
    reducers : {

    }
});

// export const {  } = ordersSlice.actions
export default ordersSlice.reducer