import type { Field, GroupField, PayloadRequest } from 'payload'
import type {
  PaymentAdapter,
  PaymentAdapterArgs,
  PaymentAdapterClient,
  PaymentAdapterClientArgs,
} from '@payloadcms/plugin-ecommerce/types'

import { confirmOrder } from './confirmOrder.js'
import { initiatePayment } from './initiatePayment.js'

export type CODAdapterArgs = {
  /**
   * Minimum order amount required for COD payment method.
   * Orders below this amount will not be eligible for COD.
   * Amount should be in the smallest currency unit (e.g., cents for USD).
   */
  minimumOrder?: number
  /**
   * Maximum order amount allowed for COD payment method.
   * Orders above this amount will not be eligible for COD.
   * Amount should be in the smallest currency unit (e.g., cents for USD).
   */
  maximumOrder?: number
  /**
   * Array of ISO 3166-1 alpha-2 country codes where COD is available.
   * If not provided, COD will be available for all countries.
   * @example ['US', 'CA', 'IN']
   */
  allowedRegions?: string[]
  /**
   * Array of ISO 4217 currency codes supported for COD.
   * If not provided, COD will be available for all currencies.
   * @example ['USD', 'INR', 'EUR']
   */
  supportedCurrencies?: string[]
  /**
   * Additional service charge or fee for COD in percentage.
   * This will be added to the order total.
   * @example 2 for 2% service charge
   */
  serviceChargePercentage?: number
  /**
   * Fixed service charge for COD in the smallest currency unit.
   * This will be added to the order total.
   * @example 100 for $1.00 in USD
   */
  fixedServiceCharge?: number
} & PaymentAdapterArgs

export const codAdapter: (props: CODAdapterArgs) => PaymentAdapter = (props) => {
  const {
    allowedRegions,
    fixedServiceCharge,
    groupOverrides,
    maximumOrder,
    minimumOrder,
    serviceChargePercentage,
    supportedCurrencies,
  } = props
  const label = props?.label || 'Cash on Delivery'

  const baseFields: Field[] = [
    {
      name: 'orderID',
      type: 'text',
      label: 'COD Order ID',
    },
    {
      name: 'validationStatus',
      type: 'select',
      label: 'Validation Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Validated', value: 'validated' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      label: 'Delivery Status',
      options: [
        { label: 'Preparing', value: 'preparing' },
        { label: 'Dispatched', value: 'dispatched' },
        { label: 'Out for Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Returned', value: 'returned' },
      ],
      defaultValue: 'preparing',
    },
    {
      name: 'paymentCollected',
      type: 'checkbox',
      label: 'Payment Collected',
      defaultValue: false,
    },
    {
      name: 'collectionDate',
      type: 'date',
      label: 'Payment Collection Date',
      admin: {
        condition: (data) => data?.cod?.paymentCollected === true,
      },
    },
  ]

  const groupField: GroupField = {
    name: 'cod',
    type: 'group',
    ...groupOverrides,
    admin: {
      condition: (data) => {
        const path = 'paymentMethod'
        return data?.[path] === 'cod'
      },
      ...groupOverrides?.admin,
    },
    fields:
      groupOverrides?.fields && typeof groupOverrides?.fields === 'function'
        ? groupOverrides.fields({ defaultFields: baseFields })
        : baseFields,
  }

  return {
    name: 'cod',
    confirmOrder: confirmOrder({
      allowedRegions,
      fixedServiceCharge,
      maximumOrder,
      minimumOrder,
      serviceChargePercentage,
      supportedCurrencies,
    }),
    endpoints: [],
    group: groupField,
    initiatePayment: initiatePayment({
      allowedRegions,
      fixedServiceCharge,
      maximumOrder,
      minimumOrder,
      serviceChargePercentage,
      supportedCurrencies,
    }),
    label,
  }
}

export type CODAdapterClientArgs = PaymentAdapterClientArgs

export const codAdapterClient: (props: CODAdapterClientArgs) => PaymentAdapterClient = (
  props,
) => {
  return {
    name: 'cod',
    confirmOrder: true,
    initiatePayment: true,
    label: props?.label || 'Cash on Delivery',
  }
}

export type InitiatePaymentReturnType = {
  message: string
  orderID: string
  serviceCharge?: number
}

export type ConfirmOrderReturnType = {
  message: string
  orderID: string
  transactionID: string
}
