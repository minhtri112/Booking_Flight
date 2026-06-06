import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    account_id: '68f741576373f1c628e79c42',
    flights: [{} as any],
    passenger_details: {},
    cabin_class: "Economy",
    total_price: 0,
    type_trip: "",
    phone: "",
    contact_name: "",
    payment_method: "",
    baggage_option: {
        type: "",
        price: 0,
    },

};

// {"account_id": "68f741576373f1c628e79c42", "cabin_class": "Economy", 
// {"arrival_airport_code": "HAN", "date": "2025-11-27T15:36:00.000Z", 
// "departure_airport_code": "DAD"}], 
// "passenger_details": {"Adults": 1, "Children": 1, "Infants": 1}, 
// "total_price": 630, "type_trip": "Round-trip"}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addAirportRoundTrip: (state, action) => {
            state.flights = [];
            state.flights.push(
                {
                    departure_airport_code: action.payload.from,
                    arrival_airport_code: action.payload.to,
                    date: action.payload.dateFrom,
                },
                {
                    departure_airport_code: action.payload.to,
                    arrival_airport_code: action.payload.from,
                    date: action.payload.dateTo,
                }
            );
            state.type_trip = "Round-trip";
        },

        addAirportOneTrip: (state, action) => {
            state.flights = [];
            state.flights.push(
                {
                    departure_airport_code: action.payload.from,
                    arrival_airport_code: action.payload.to,
                    date: action.payload.date,
                }
            );

            state.type_trip = "One-way";
        },

        addAirportMultiCity: (state, action) => {
            console.log("Action payload in slice:", action.payload);
            state.flights = [];
            action.payload.forEach((flight: any) => {
                state.flights.push({
                    departure_airport_code: flight.from.split('-')[0],
                    arrival_airport_code: flight.to.split('-')[0],
                    date: flight.date,
                });
            });
            state.type_trip = "Multi-city";
        },

        addFlights: (state, action) => {
            const { index, path } = action.payload;
            state.flights[index] = { ...state.flights[index], path: path };

            // cap nhat tien total_price
            state.total_price = state.flights[index].path.reduce((total: number, item: any) => total + item.ticket_price, 0) * action.payload.totalPassengers;
        },

        editOptions: (state, action) => {
            state.passenger_details = action.payload.passenger_details;
            state.cabin_class = action.payload.cabin_class;
        },

        addTraveller: (state, action) => {
            state.contact_name = action.payload.contact_name;
            state.phone = action.payload.phone;
        },
        addBaggage: (state, action) => {
            state.baggage_option = action.payload;
        },
        addSeat: (state, action) => {
            const { flightId, seats, seatPrice } = action.payload;

            state.flights = state.flights.map((flight: any) => ({
                ...flight,
                path: flight.path.map((p: any) =>
                    p._id === flightId
                        ? { ...p, seats } 
                        : p
                ),
            }));
            state.total_price += seatPrice;
        }

    }
});

export const { addAirportRoundTrip, editOptions, addFlights, addAirportOneTrip, addAirportMultiCity, addTraveller, addBaggage, addSeat } = ordersSlice.actions
export default ordersSlice.reducer