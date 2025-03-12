import axios, { AxiosInstance } from 'axios';

/**
 * GUPay SDK configuration options.
 */
export interface GUPayConfig {
  apiKey: string; // Your secret API key
  serviceId: string; // Your service identifier provided by GUPay
  baseUrl?: string; // Optional base URL; defaults to "https://api.gupay.co"
}

/**
 * Base interface for a charge request.
 */
export interface ChargeRequestBase {
  amount: number; // Amount of transaction (must be a positive number)
  currency: string; // Currency code (3-letter ISO 4217)
  description: string; // Description of the item/credit
  reference_id: string; // Unique identifier for the request (from your system)
  customer_id: string; // Customer/user identifier (could be email, ID, etc.)
  flow: string; // Payment flow type; for these examples use "redirect"
  return_url?: string; // URL to redirect after payment completion
}

/**
 * Request parameters for TrueMoney Wallet charges.
 */
export interface TrueMoneyWalletChargeRequest extends ChargeRequestBase {}

/**
 * Request parameters for TrueMoney Cashcard charges.
 */
export interface TrueMoneyCashcardChargeRequest extends ChargeRequestBase {
  // Optionally, if your integration requires a PIN, you can add:
  // pin_no?: string | number;
}

/**
 * Request parameters for Internet Banking charges.
 * The type (bank code) is provided separately.
 */
export interface InternetBankingChargeRequest extends ChargeRequestBase {
  // You can add extra fields if needed.
}

/**
 * Request parameters for Promptpay charges.
 */
export interface PromptpayChargeRequest extends ChargeRequestBase {}

/**
 * Available bank types for Internet Banking.
 */
export type InternetBankingType = 'scb' | 'ktb' | 'kbank' | 'bbl';

/**
 * Charge response interface based on GUPay documentation.
 */
export interface ChargeResponse {
  id: string;
  object: string;
  merchant_id: string;
  service_id: string;
  status: string; // e.g., "pending", "successful", "failed"
  created_at: string; // ISO 8601 formatted date string
  updated_at: string; // ISO 8601 formatted date string
  paid: boolean;
  amount: number;
  currency: string;
  description: string;
  failure_code: string | null;
  failure_message: string | null;
  livemode: boolean;
  merchant_reference_id: string;
  merchant_customer_id: string;
  redirect_url: string;
  return_url: string;
  paid_at: string | null;
  flow: string;
  type: string;
  payment_transaction_id?: string;
  payment_reference_id?: string;
  mobile_number?: string;
  serial_no?: string;
  pin_no?: string | number;
}

/**
 * GUPay API error response interface.
 */
export interface GUPayError {
  error: {
    code: string;
    message: string;
    type: string;
  };
}

/**
 * Custom error class for GUPay API errors.
 */
export class GUPayAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public type: string,
  ) {
    super(message);
    this.name = 'GUPayAPIError';
  }
}

/**
 * Base type for charge payloads.
 */
export type ChargePayload = {
  type:
    | 'truemoneywallet'
    | 'truemoneycashcard'
    | 'scb'
    | 'ktb'
    | 'kbank'
    | 'bbl'
    | 'promptpay';
  service_id: string;
  amount: number;
  currency: string;
  description: string;
  reference_id: string;
  customer_id: string;
  flow: string;
  return_url?: string;
};

/**
 * GUPaySDK provides methods to create charges for different payment methods.
 */
class GUPaySDK {
  private apiKey: string;
  private serviceId: string;
  private client: AxiosInstance;

  constructor(config: GUPayConfig) {
    this.apiKey = config.apiKey;
    this.serviceId = config.serviceId;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.gupay.co',
      headers: {
        // GUPay uses HTTP Basic Authentication where the API key is sent as the username.
        Authorization: `Basic ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Private helper method to create a charge.
   */
  private async createCharge(payload: ChargePayload): Promise<ChargeResponse> {
    try {
      const response = await this.client.post<ChargeResponse>(
        '/v1/charges',
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const gupayError = error.response?.data as GUPayError;
        if (gupayError?.error) {
          throw new GUPayAPIError(
            gupayError.error.code,
            gupayError.error.message,
            gupayError.error.type,
          );
        }
      }
      throw new Error('An unexpected error occurred while creating the charge');
    }
  }

  /**
   * Create a charge using TrueMoney Wallet.
   */
  public async createTrueMoneyWalletCharge(
    data: TrueMoneyWalletChargeRequest,
  ): Promise<ChargeResponse> {
    const payload: ChargePayload = {
      type: 'truemoneywallet',
      service_id: this.serviceId,
      ...data,
    };
    return this.createCharge(payload);
  }

  /**
   * Create a charge using TrueMoney Cashcard.
   */
  public async createTrueMoneyCashcardCharge(
    data: TrueMoneyCashcardChargeRequest,
  ): Promise<ChargeResponse> {
    const payload: ChargePayload = {
      type: 'truemoneycashcard',
      service_id: this.serviceId,
      ...data,
    };
    return this.createCharge(payload);
  }

  /**
   * Create a charge using Internet Banking.
   * @param bankType - The bank code (scb, ktb, kbank, or bbl)
   */
  public async createInternetBankingCharge(
    bankType: InternetBankingType,
    data: InternetBankingChargeRequest,
  ): Promise<ChargeResponse> {
    const payload: ChargePayload = {
      type: bankType,
      service_id: this.serviceId,
      ...data,
    };
    return this.createCharge(payload);
  }

  /**
   * Create a charge using Promptpay.
   */
  public async createPromptpayCharge(
    data: PromptpayChargeRequest,
  ): Promise<ChargeResponse> {
    const payload: ChargePayload = {
      type: 'promptpay',
      service_id: this.serviceId,
      ...data,
    };
    return this.createCharge(payload);
  }
}

export default GUPaySDK;
