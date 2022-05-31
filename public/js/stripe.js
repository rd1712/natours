/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51L59JmSCjExsLuOgDzmENBK0crWioBCdc4jqmW2bl0L9ZpXeVVRGQMt8xUaXILLE6Z84jl8kQPa6xAMwuJx002WD00MJfqqBDx'
);

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
