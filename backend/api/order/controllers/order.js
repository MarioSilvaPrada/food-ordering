'use strict';

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const stripe = require('stripe')(
  'pk_test_51HNmBVBN2dNVD9qw5keM8ZxfmL23cWoLQJ6E7ZQR7w5VIWE4D29PBCuoQmUgloNyI4ZMFOGFTDA9xYYybaKc9DuV00HEhR4iwJ'
);

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(ctx.request.body);
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: 'usd',
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state
    });

    return order;
  }
};
