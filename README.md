# @wtree/payload-ecommerce-cod

[![npm version](https://badge.fury.io/js/@wtree%2Fpayload-ecommerce-cod.svg)](https://www.npmjs.com/package/@wtree/payload-ecommerce-cod)
[![CI](https://github.com/technewwings/payload-ecommerce-cod/actions/workflows/ci.yml/badge.svg)](https://github.com/technewwings/payload-ecommerce-cod/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/technewwings/payload-ecommerce-cod/branch/main/graph/badge.svg)](https://codecov.io/gh/technewwings/payload-ecommerce-cod)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cash on Delivery (COD) payment adapter for Payload CMS Ecommerce Plugin. This adapter follows the same structure as the official Stripe adapter and integrates seamlessly with Payload's ecommerce plugin.

## Features

- ✅ Full Payload CMS Ecommerce Plugin compatibility
- ✅ Configurable order limits (minimum/maximum)
- ✅ Regional availability controls
- ✅ Currency restrictions
- ✅ Optional service charges (percentage or fixed)
- ✅ Delivery status tracking
- ✅ Payment collection tracking
- ✅ Admin UI integration
- ✅ TypeScript support
- ✅ 80%+ test coverage

## Installation

```bash
npm install @wtree/payload-ecommerce-cod
```

## Usage

### Server-side Configuration

Add the COD adapter to your Payload config:

```typescript
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { codAdapter } from '@wtree/payload-ecommerce-cod'

export default buildConfig({
  // ... other config
  plugins: [
    ecommercePlugin({
      payments: {
        paymentMethods: [
          codAdapter({
            label: 'Cash on Delivery',
            minimumOrder: 100, // $1.00 in cents
            maximumOrder: 50000, // $500.00 in cents
            allowedRegions: ['US', 'CA', 'IN'],
            supportedCurrencies: ['USD', 'INR'],
            serviceChargePercentage: 2, // 2% service charge
            fixedServiceCharge: 50, // $0.50 in cents
          }),
        ],
      },
    }),
  ],
})
```

### Client-side Configuration

Add the COD adapter client to your React app:

```typescript
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client'
import { codAdapterClient } from '@wtree/payload-ecommerce-cod'

function App() {
  return (
    <EcommerceProvider
      paymentMethods={[
        codAdapterClient({
          label: 'Cash on Delivery',
        }),
      ]}
    >
      {/* Your app */}
    </EcommerceProvider>
  )
}
```

## Configuration Options

### Server-side Options

| Option | Type | Description |
|--------|------|-------------|
| `label` | `string` | Display label for the payment method (default: "Cash on Delivery") |
| `minimumOrder` | `number` | Minimum order amount in smallest currency unit (e.g., cents) |
| `maximumOrder` | `number` | Maximum order amount in smallest currency unit |
| `allowedRegions` | `string[]` | Array of ISO 3166-1 alpha-2 country codes where COD is available |
| `supportedCurrencies` | `string[]` | Array of ISO 4217 currency codes supported for COD |
| `serviceChargePercentage` | `number` | Percentage service charge to add to orders |
| `fixedServiceCharge` | `number` | Fixed service charge in smallest currency unit |
| `groupOverrides` | `object` | Override default transaction fields |

### Client-side Options

| Option | Type | Description |
|--------|------|-------------|
| `label` | `string` | Display label for the payment method (default: "Cash on Delivery") |

## Transaction Fields

The COD adapter adds the following fields to transactions:

- **orderID**: Unique COD order identifier
- **validationStatus**: Order validation status (pending, validated, rejected)
- **deliveryStatus**: Delivery tracking (preparing, dispatched, out_for_delivery, delivered, returned)
- **paymentCollected**: Boolean flag for payment collection
- **collectionDate**: Date when payment was collected

## API Endpoints

The adapter uses Payload's built-in ecommerce endpoints:

- `POST /api/payments/cod/initiate` - Initiate a COD order
- `POST /api/payments/cod/confirm-order` - Confirm and create order

## Example: Complete Checkout Flow

```typescript
import { useEcommerce } from '@payloadcms/plugin-ecommerce/client'

function Checkout() {
  const { initiatePayment, confirmOrder } = useEcommerce()

  const handleCheckout = async () => {
    try {
      // Step 1: Initiate payment
      const initResult = await initiatePayment('cod', {
        additionalData: {
          // Any additional data needed
        },
      })

      console.log('COD Order ID:', initResult.orderID)

      // Step 2: Confirm order
      const confirmResult = await confirmOrder('cod', {
        additionalData: {
          orderID: initResult.orderID,
        },
      })

      console.log('Order confirmed:', confirmResult.orderID)
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  return (
    <button onClick={handleCheckout}>
      Complete Order (COD)
    </button>
  )
}
```

## Admin Interface

The adapter integrates with Payload's admin UI, showing COD-specific fields in the transactions collection:

- View and update delivery status
- Track payment collection
- Manage order validation

## Validation

The adapter performs automatic validation:

- ✅ Currency support check
- ✅ Order amount limits (min/max)
- ✅ Regional availability
- ✅ Service charge calculation
- ✅ Cart and customer data validation

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build the package
npm run build

# Watch mode for development
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Publishing

### Automated Publishing (Recommended)

This package uses GitHub Actions for automated publishing:

1. **Create a release using the workflow**:
   - Go to Actions → Release workflow
   - Click "Run workflow"
   - Select version type (patch/minor/major) or specify version
   - The workflow will automatically:
     - Run tests
     - Build the package
     - Bump version
     - Create git tag
     - Trigger npm publish

2. **Or manually tag a version**:
   ```bash
   npm version patch  # or minor, major
   git push origin main --follow-tags
   ```

### Manual Publishing

```bash
# Prepare release
./scripts/prepare-release.sh patch  # or minor, major

# Review changes
git log

# Push to trigger automated publish
git push origin main --follow-tags
```

### Setup Requirements

To enable automated publishing, add the following secrets to your GitHub repository:

1. **NPM_TOKEN**: Your npm access token
   - Generate at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Add to: Repository Settings → Secrets → Actions

2. **CODECOV_TOKEN** (optional): For coverage reporting
   - Generate at: https://codecov.io/gh/technewwings/payload-ecommerce-cod
   - Add to: Repository Settings → Secrets → Actions

## Comparison with Stripe Adapter

This adapter follows the exact same structure as Payload's official Stripe adapter:

- ✅ Implements `PaymentAdapter` interface
- ✅ Provides `initiatePayment` and `confirmOrder` methods
- ✅ Uses GroupField for admin UI integration
- ✅ Supports transaction tracking
- ✅ Compatible with Payload's ecommerce hooks

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.

## Support

For issues and questions:
- 🐛 [Report a bug](https://github.com/technewwings/payload-ecommerce-cod/issues)
- 💬 [Start a discussion](https://github.com/technewwings/payload-ecommerce-cod/discussions)
- 📖 [Read the docs](https://github.com/technewwings/payload-ecommerce-cod#readme)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
