import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { type CartItem } from './CartPage';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderSuccess: (orderInfo: {
    orderId: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    billingName: string;
    address: string;
    city: string;
    zipCode: string;
  }) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onBack,
  onOrderSuccess,
}) => {
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 250;
  const tax = subtotal * 0.12; // 12% VAT in the Philippines
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, address, city, zipCode, cardNumber, cardExpiry, cardCvv } = shippingData;
    if (!firstName || !lastName || !address || !city || !zipCode || !cardNumber || !cardExpiry || !cardCvv) return;

    // Generate random Order ID
    const randomOrderId = 'RUN-ORD-' + Math.floor(100000 + Math.random() * 900000).toString();
    onOrderSuccess({
      orderId: randomOrderId,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      billingName: `${firstName} ${lastName}`,
      address,
      city,
      zipCode,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-505 hover:text-orange-505 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Cart
      </button>

      {/* Heading */}
      <div className="border-b border-zinc-200 pb-5 mb-8">
        <h1 className="font-display text-4xl font-black text-zinc-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-zinc-600 font-medium">
          Enter your delivery details and mock card information to complete the purchase transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left column form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-black text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">1. Delivery Address</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={shippingData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={shippingData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={shippingData.address}
                onChange={handleChange}
                placeholder="123 Athletic Boulevard"
                className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingData.city}
                  onChange={handleChange}
                  placeholder="Bacolod City"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">Zip/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={shippingData.zipCode}
                  onChange={handleChange}
                  placeholder="6100"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Simulation */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <h3 className="font-display text-base font-black text-zinc-900 uppercase tracking-wider">2. Credit Card Details</h3>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
                Simulation Only
              </span>
            </div>
            
            <div>
              <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                required
                value={shippingData.cardNumber}
                onChange={handleChange}
                placeholder="4111 2222 3333 4444"
                className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-750 uppercase tracking-wider mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  required
                  value={shippingData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-750 uppercase tracking-wider mb-2">Security Code (CVV)</label>
                <input
                  type="text"
                  name="cardCvv"
                  required
                  value={shippingData.cardCvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 py-4 text-sm font-black text-white hover:bg-orange-600 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer mt-4 shadow-md shadow-orange-500/10"
          >
            Authorize Payment & Complete Order
          </button>
        </form>

        {/* Right column order summary */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
          <h3 className="font-display text-base font-black text-zinc-900 tracking-tight uppercase border-b border-zinc-200 pb-4">
            Items in Order
          </h3>

          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-zinc-900 font-bold block truncate max-w-[150px]">{item.product.name}</span>
                  <span className="text-[10px] text-zinc-500 font-semibold block mt-0.5">Qty {item.quantity} • Size {item.size}</span>
                </div>
                <span className="text-zinc-900 font-bold font-display">₱{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-6 space-y-3 text-xs font-semibold text-zinc-500">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-zinc-900">₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-zinc-900">{shipping === 0 ? 'Free' : `₱${shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated VAT (12%)</span>
              <span className="text-zinc-900">₱{tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-zinc-200 pt-4 flex justify-between text-sm font-bold">
              <span className="text-zinc-900">Total Charge</span>
              <span className="text-orange-650 font-display">₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default CheckoutPage;
