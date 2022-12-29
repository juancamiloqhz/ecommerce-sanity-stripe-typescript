// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'fake', {
    apiVersion: '2022-11-15',
})

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST') {
    // console.log(req.body);
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        submit_type: 'pay',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1MJ4b1FZE31pDLocmZxra4I2' },
          { shipping_rate: 'shr_1MJ4cdFZE31pDLocxFCZFoEn' },
        ],
        line_items: req.body.map((cartItem: any) => {
          const { product } = cartItem;
          const image = product.image[0].asset._ref;
          const newImage = image.replace('image-', 'https://cdn.sanity.io/images/0c2ea6eu/production/').replace('-webp', '.webp');
          // console.log({newImage});
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                images: [newImage],
              },
              unit_amount: product.price, // in cents
            },
            quantity: cartItem.quantity,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
          }
        }),
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      });
      res.status(200).json(session);
    } catch (error: any) {
      res.status(error.statusCode || 500).json(error.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  } 
}
