import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    account_id : '68f741576373f1c628e79c42',
    flights : [],
    total_price : 0,
    type_trip : ""
};

// {
//    flight_id : '',
//    seat_number : [{seat_number : '', value : 0, class : ''}],
//    count_passenger : 0,
//    price_per_ticket : 0,
//    data : '',
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
        addAirport : (state, action) => {
            console.log(state);
            console.log(action);
        }
    }
});

export const { addAirport } = ordersSlice.actions
export default ordersSlice.reducer