# node-gupay-sdk

Unofficial [GUPay](https://gupay.co/) SDK for Node.js - A TypeScript SDK for integrating GUPay payment services into your Node.js applications.

## Features

- TypeScript support with full type definitions
- Support for multiple payment methods:
  - TrueMoney Wallet
  - TrueMoney Cashcard
  - Internet Banking (SCB, KTB, KBANK, BBL)
  - PromptPay (QR Code)
  - LINE Pay *(Comingsoon)*
  - Shopee Pay *(Comingsoon)*
  - 12Call Cashcard *(Comingsoon)*
  - AIS DCB *(Comingsoon)*
- Axios-based HTTP client
- Modern ES modules support
- TypeScript-friendly

## Requirements

- Node.js >= 22.11 < 23
- Axios >= 1.7.7

## Installation

```bash
npm install node-gupay-sdk
```

## Quick Start

```typescript
import GUPaySDK from 'node-gupay-sdk';

const gupay = new GUPaySDK({
  apiKey: 'your_api_key',
  serviceId: 'your_service_id',
  // Optional: baseUrl - defaults to 'https://api.gupay.co'
});

// Create a TrueMoney Wallet charge
const charge = await gupay.createTrueMoneyWalletCharge({
  amount: 100,
  currency: 'THB',
  description: 'Test charge',
  reference_id: 'unique_reference_id',
  customer_id: 'customer_123',
  flow: 'redirect',
  return_url: 'https://your-domain.com/return'
});
```

## API Reference

### Configuration

```typescript
interface GUPayConfig {
  apiKey: string;      // Your secret API key
  serviceId: string;   // Your service identifier
  baseUrl?: string;    // Optional base URL
}
```

### Available Methods

#### TrueMoney Wallet
```typescript
createTrueMoneyWalletCharge(data: TrueMoneyWalletChargeRequest): Promise<ChargeResponse>
```

#### TrueMoney Cashcard
```typescript
createTrueMoneyCashcardCharge(data: TrueMoneyCashcardChargeRequest): Promise<ChargeResponse>
```

#### Internet Banking
```typescript
createInternetBankingCharge(bankType: InternetBankingType, data: InternetBankingChargeRequest): Promise<ChargeResponse>
```

Supported bank types: 'scb' | 'ktb' | 'kbank' | 'bbl'

#### PromptPay
```typescript
createPromptpayCharge(data: PromptpayChargeRequest): Promise<ChargeResponse>
```

### Common Request Parameters

All charge requests require the following base parameters:

```typescript
interface ChargeRequestBase {
  amount: number;           // Amount of transaction
  currency: string;         // Currency code (ISO 4217)
  description: string;      // Description of the charge
  reference_id: string;     // Unique identifier
  customer_id: string;      // Customer identifier
  flow: string;            // Payment flow type
  return_url?: string;     // Optional return URL
}
```

### Response

All charge methods return a `ChargeResponse` object containing:

```typescript
interface ChargeResponse {
  id: string;
  object: string;
  merchant_id: string;
  service_id: string;
  status: string;
  created_at: string;
  updated_at: string;
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
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linter
npm run lint

# Format code
npm run prettier
```

## License

MIT

## Author

Night <kidsanaphon.ka@proton.me>
