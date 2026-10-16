import { PaymentAdapter, PaymentProvider, paymentAdapters } from "./index";

export const PaymobAdapter: PaymentAdapter = paymentAdapters.paymob;
export const FawryAdapter: PaymentAdapter = paymentAdapters.fawry;
export const StripeAdapter: PaymentAdapter = paymentAdapters.stripe;
export const PayPalAdapter: PaymentAdapter = paymentAdapters.paypal;

export const priorityProvider: PaymentProvider = "paymob";
