import Booking from "../models/Booking";

class RejectionController {
  async store(req, res) {
    const { booking_id } = req.params;

    const booking = await Booking.findById(booking_id).populate("spot");

    booking.approved = false;

    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit("booking_response", booking);
    }

    res.json(booking);
  }
}

export default new RejectionController();
