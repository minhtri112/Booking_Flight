
const findOneWayFight = require('../helper/findOneWayFight');
const bookingFlight = require("../helper/bookingFlight");
const getSeatLayouts = require('../helper/getSeatLayout');

// [POST] /flights/one-way
module.exports.oneWayFight = async (req, res) => {
    try {
        const { from, to, dateFrom, dateTo, filter } = req.body;
        let result = await findOneWayFight(from, to, dateFrom, dateTo);

        if (filter) {
            const { stops, time } = filter;
            if (stops != null)
                result = result.filter(item => item.totalStops <= parseInt(stops));
            if (time != null)
                result = result.filter(item => item.totalTime <= parseInt(time));
        }

        res.json({
            status: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
};

// [POST] /flights/booking
module.exports.booking = async (req, res) => {
    try {
        const result = await bookingFlight(req.body);
        res.json({
            status: true,
            message: "Đặt vé thành công!",
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
};

// [GET] /flights/seats?flight_id=ID1,ID2
module.exports.getSeatsByFlight = async (req, res) => {
    try {
        let { flight_id } = req.query;

        if (!flight_id) {
            return res.status(400).json({
                status: false,
                message: 'flight_id là bắt buộc'
            });
        }

        // Chia flight_id nếu nhiều ID
        const flightIds = typeof flight_id === 'string' ? flight_id.split(',') : flight_id;

        const data = await getSeatLayouts(flightIds);

        res.json({
            status: true,
            message: 'Lấy danh sách ghế thành công',
            data
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
};