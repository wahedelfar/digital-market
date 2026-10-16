export type PaymentProvider = "paymob" | "fawry" | "stripe" | "paypal";

export type PaymentRequest = {
  productId: string;
  amount: number;
  currency: "EGP" | "USD";
  buyerEmail: string;
  returnUrl: string;
};

export type PaymentSession = {
  provider: PaymentProvider;
  sessionId: string;
  checkoutUrl: string;
  status: "pending" | "paid";
};

export interface PaymentAdapter {
  createCheckout(request: PaymentRequest): Promise<PaymentSession>;
  verifyPayment(sessionId: string): Promise<boolean>;
}

class MockAdapter implements PaymentAdapter {
  constructor(private provider: PaymentProvider) {}
  async createCheckout(request: PaymentRequest) {
    return {
      provider: this.provider,
      sessionId: `${this.provider}_${request.productId}_${Date.now()}`,
      checkoutUrl: `/checkout/success?provider=${this.provider}`,
      status: "pending" as const
    };
  }
  async verifyPayment() {
    return true;
  }
}

export const paymentAdapters: Record<PaymentProvider, PaymentAdapter> = {
  paymob: new MockAdapter("paymob"),
  fawry: new MockAdapter("fawry"),
  stripe: new MockAdapter("stripe"),
  paypal: new MockAdapter("paypal")
};

export function getPaymentAdapter(provider: PaymentProvider = "paymob") {
  return paymentAdapters[provider];
}
