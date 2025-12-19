const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const instance = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) 
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

if (!instance) {
    console.warn("⚠️ Razorpay keys missing. Payment features will not work.");
}

// Create Order
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        if (!instance) {
            return res.status(500).json({ message: 'Razorpay not configured on server' });
        }

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify Payment Signature (Helper for internal use or simple verification endpoint)
const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest('hex');

    return generated_signature === signature;
};

// Verify Payment Endpoint (Optional, if verifying separately before booking)
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (isValid) {
            res.status(200).json({ success: true, message: 'Payment verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Razorpay Key ID
const getRazorpayKey = async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
    createOrder,
    verifyPayment,
    verifyPaymentSignature,
    getRazorpayKey
};
