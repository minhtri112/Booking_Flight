const Flight = require('../model/flights.model.js');
const Queue = require('collections/deque');
const dayjs = require('dayjs');



module.exports = async function findOneWayFight(from, to, dateFrom, dateTo) {
    let results = [];
    let check = new Map();
    try {

        const queue = new Queue();

        const startOfDay = new Date(`${dateFrom}T00:00:00Z`);
        const endOfDay   = new Date(`${dateFrom}T23:59:59Z`);
        const arrival_time_date = new Date(`${dateTo}T23:59:59Z`);

        const flights = await Flight.find({
            departure_airport_code: from,
            departure_time: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            arrival_time : {
                $lte : arrival_time_date
            }
        }).select("-seat_layout"); 



        flights.forEach(item => {
            if (item.arrival_airport_code === to && dayjs(item.arrival_time).isSame(dateTo, 'day')) {
                results.push({ currentFight: item, path: [item], totalStops: 0, totalPrice: item.ticket_price, totalTime: item.duration_minutes })
            }
            else queue.push({ currentFight: item, path: [item], totalStops: 0, totalPrice: item.ticket_price, totalTime: item.duration_minutes })
        });
        while (queue.length != 0) {
            const current = queue.shift();
            if (!check[current.currentFight.departure_airport_code]) {

                check[current.currentFight.departure_airport_code] = true; // danh dau da duyet truoc do

                if (current.totalStops >= 7) continue; // hon 5 diem dung thi dung


                const nextFlights = await Flight.find({
                    departure_airport_code : current.currentFight.arrival_airport_code,
                    departure_time : {
                        $gte : current.currentFight.arrival_time // tg khoi hanh <= tg den 
                    },
                    arrival_time : {
                        $lte : arrival_time_date // tg den <= dateTo
                    }
                }).select("-seat_layout")

                nextFlights.forEach(item => {
                    if (item.arrival_airport_code === to && dayjs(item.arrival_time).isSame(dateTo, 'day')) {
                        results.push({
                            currentFight: item,
                            path: [...current.path, item],
                            totalStops: current.totalStops + 1,
                            totalPrice: current.totalPrice + item.ticket_price,
                            totalTime: current.totalTime + item.duration_minutes
                        })
                    }
                    else {
                        if(!check[item.departure_airport_code])
                        queue.push({ currentFight: item, 
                            path: [...current.path, item], 
                            totalStops: current.totalStops + 1, 
                            totalPrice: current.totalPrice + item.ticket_price, 
                            totalTime: current.totalTime + item.duration_minutes });
                    }
                })
            }

        }
    }
    catch (err) {
        console.log(err);
    }

    return results;
}
