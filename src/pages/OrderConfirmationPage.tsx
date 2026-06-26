import React from 'react';
import { CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { type CartItem } from './CartPage';

interface OrderConfirmationPageProps {
  orderInfo: {
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
  };
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderInfo,
  onContinueShopping,
}) => {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8 animate-fade-in">
      
      {/* Success Badge */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500 text-emerald-400">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      {/* Headings */}
      <div>
        <h1 className="font-display text-4xl font-black text-white tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="mt-3 text-zinc-400 text-sm max-w-md mx-auto leading-relaxed font-semibold">
          Your payment has been simulated successfully. We are preparing your packages for transit.
        </p>
      </div>

      {/* Print receipt card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0d] p-6 md:p-8 text-left shadow-2xl space-y-6">
        
        {/* Header receipt info */}
        <div className="flex justify-between items-start border-b border-zinc-900 pb-5">
          <div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Order Identification</span>
            <span className="text-sm font-bold text-white mt-1 block">{orderInfo.orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Transaction Date</span>
            <span className="text-xs font-bold text-zinc-300 mt-1 block">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Address and Billing name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-zinc-900 pb-5 text-xs font-semibold text-zinc-400">
          <div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Customer Delivery</span>
            <span className="text-white font-bold block">{orderInfo.billingName}</span>
            <span className="block mt-0.5">{orderInfo.address}</span>
            <span className="block">{orderInfo.city}, {orderInfo.zipCode}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Shipping Logistics</span>
            <span className="text-zinc-300">Standard Delivery Service</span>
            <span className="block mt-0.5 text-zinc-500 font-medium">Estimated Transit: 3-5 business days</span>
          </div>
        </div>

        {/* Items bought list */}
        <div className="space-y-4 border-b border-zinc-900 pb-5">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Purchased Products</span>
          
          <div className="space-y-3">
            {orderInfo.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                <div>
                  <span className="text-white font-bold">{item.product.name}</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Size {item.size} • Color {item.color} • Qty {item.quantity}</span>
                </div>
                <span className="text-white font-display font-bold">₱{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pt-2">
          <div className="text-left text-[10px] text-zinc-600 font-semibold max-w-sm">
            Please print this order confirmation page for packet claims. An official receipt has been dispatched to your email address.
          </div>
          <div className="space-y-2.5 text-xs font-semibold text-zinc-400 sm:w-60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">₱{orderInfo.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-white">{orderInfo.shipping === 0 ? 'Free' : `₱${orderInfo.shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (12%)</span>
              <span className="text-white">₱{orderInfo.tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-zinc-900 pt-3 flex justify-between font-bold text-sm">
              <span className="text-white">Total Charge</span>
              <span className="text-white font-display">₱{orderInfo.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-3 text-xs font-bold text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
        
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-3 text-xs font-bold text-black hover:bg-zinc-200 transition-colors uppercase tracking-wider cursor-pointer"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
export default OrderConfirmationPage;
