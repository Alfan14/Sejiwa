import express from 'express';
import db_booking from '../../controllers/bookingController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/bookings',authenticate, authorize(['konselor','pelajar']) , db_booking.getBookings);
router.get('/bookings/:id',authenticate, authorize(['konselor','pelajar']), db_booking.getBookingById);
router.post('/bookings', authenticate, authorize(['konselor','pelajar']),db_booking.createBooking);
router.put('/bookings/:id', authenticate, authorize(['konselor','pelajar']),db_booking.updateBooking);
router.patch('/bookings/:id', authenticate, authorize(['konselor','pelajar']),db_booking.patchBooking);
router.delete('/bookings/:id',authenticate, authorize(['admin']), db_booking.deleteBooking);

export default router;