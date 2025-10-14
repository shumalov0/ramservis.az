"use client";

import { BookingFormData, EmailTemplateData } from "./types";

// Enhanced email sender using EmailJS REST API with improved error handling and retry logic
// Configure these env vars in .env.local:
// NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
// NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER=...
// NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS=...

type BookingEmailPayload = {
  customerEmail: string;
  customerName: string;
  businessEmail?: string;
  car: string;
  dates: string;
  locations: string;
  services: string;
  total: string;
};

// Enhanced email payload with detailed booking information
export interface EnhancedEmailPayload {
  customerEmail: string;
  customerName: string;
  businessEmail?: string;
  bookingData: BookingFormData;
  carDetails: {
    brand: string;
    model: string;
    year: number;
    image: string;
    dailyPrice: number;
  };
  confirmationNumber: string;
  paymentLink?: string; // For Click2Pay integration
  language: string;
}

// Email sending result interface
export interface EmailResult {
  success: boolean;
  error?: string;
  retryCount?: number;
  skipped?: boolean;
}

// Email service configuration
export interface EmailConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Default email configuration
const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
};

function getEnv(name: string): string | undefined {
  try {
    return (
      (process as any)?.env?.[name] || (globalThis as any)?.process?.env?.[name]
    );
  } catch {
    return undefined;
  }
}

// Generate unique confirmation number
export function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `RS-${timestamp}-${random}`.toUpperCase();
}

// Format booking details for email templates
function formatBookingDetails(
  payload: EnhancedEmailPayload
): EmailTemplateData {
  const { bookingData, carDetails, confirmationNumber, paymentLink } = payload;

  return {
    customerName: payload.customerName,
    carDetails,
    bookingDetails: bookingData,
    totalAmount: bookingData.totalPrice,
    paymentLink,
    confirmationNumber,
  };
}

// Create timeout promise for fetch requests
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), timeout);
  });
}

// Delay function for retry logic
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Enhanced email sending function with retry logic and better error handling
async function sendEmailWithRetry(
  templateId: string,
  toEmail: string,
  payload: EnhancedEmailPayload,
  config: EmailConfig = DEFAULT_EMAIL_CONFIG,
  isBusinessEmail: boolean = false
): Promise<EmailResult> {
  const serviceId = getEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID");
  const publicKey = getEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY");

  if (!serviceId || !publicKey || !templateId) {
    console.warn("EmailJS configuration missing. Skipping email send.");
    return {
      success: false,
      skipped: true,
      error: "EmailJS configuration missing",
    };
  }

  const templateData = formatBookingDetails(payload);
  const { bookingData, carDetails } = payload;

  // Enhanced template parameters with detailed booking information
  const templateParams = {
    // Recipient information
    to_email: toEmail,
    to_name: payload.customerName,

    // Customer information
    customer_email: payload.customerEmail,
    customer_name: payload.customerName,
    customer_phone: bookingData.phone,

    // Car information
    car_brand: carDetails.brand,
    car_model: carDetails.model,
    car_year: carDetails.year,
    car_image: carDetails.image,
    car_daily_price: carDetails.dailyPrice,
    car_full_name: `${carDetails.brand} ${carDetails.model} ${carDetails.year}`,

    // Booking details
    pickup_date: bookingData.pickupDate,
    dropoff_date: bookingData.dropoffDate,
    pickup_location: bookingData.pickupLocation,
    dropoff_location: bookingData.dropoffLocation,
    total_days: bookingData.totalDays,

    // Services and pricing
    additional_services: bookingData.additionalServices.join(", ") || "None",
    payment_method: bookingData.paymentMethod,
    total_price: bookingData.totalPrice,
    deposit: bookingData.deposit,
    service_charges: bookingData.serviceCharges,

    // Special information
    special_requests: bookingData.specialRequests || "None",
    confirmation_number: payload.confirmationNumber,
    payment_link: payload.paymentLink || "",

    // Business information
    business_email: payload.businessEmail || "info@ramservis.az",

    // Formatting helpers
    formatted_dates: `${bookingData.pickupDate} - ${bookingData.dropoffDate}`,
    formatted_locations: `${bookingData.pickupLocation} → ${bookingData.dropoffLocation}`,
    formatted_total: `${bookingData.totalPrice} AZN`,

    // Language
    language: payload.language || "en",
  };

  const requestBody = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(
        `Sending email attempt ${attempt + 1}/${
          config.maxRetries + 1
        } to ${toEmail}`
      );

      const fetchPromise = fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const timeoutPromise = createTimeoutPromise(config.timeout);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (response.ok) {
        console.log(`Email sent successfully to ${toEmail}`);
        return { success: true, retryCount: attempt };
      } else {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `Email send attempt ${attempt + 1} failed:`,
        lastError.message
      );

      // Don't retry on the last attempt
      if (attempt < config.maxRetries) {
        await delay(config.retryDelay * (attempt + 1)); // Exponential backoff
      }
    }
  }

  console.error(
    `Failed to send email to ${toEmail} after ${
      config.maxRetries + 1
    } attempts:`,
    lastError?.message
  );
  return {
    success: false,
    error: lastError?.message || "Unknown error",
    retryCount: config.maxRetries + 1,
  };
}

// Enhanced booking email sender with improved error handling
export async function sendBookingEmails(
  payload: EnhancedEmailPayload,
  config?: EmailConfig
): Promise<{ toCustomer: EmailResult; toBusiness: EmailResult }> {
  const customerTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER");
  const businessTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS");
  const businessEmail = payload.businessEmail || "info@ramservis.az";

  console.log("Sending booking confirmation emails...", {
    customer: payload.customerEmail,
    business: businessEmail,
    confirmation: payload.confirmationNumber,
  });

  // Send emails in parallel for better performance
  const [toCustomer, toBusiness] = await Promise.all([
    customerTemplate
      ? sendEmailWithRetry(
          customerTemplate,
          payload.customerEmail,
          payload,
          config
        )
      : Promise.resolve({
          success: false,
          skipped: true,
          error: "Customer template not configured",
        }),
    businessTemplate
      ? sendEmailWithRetry(businessTemplate, businessEmail, payload, config)
      : Promise.resolve({
          success: false,
          skipped: true,
          error: "Business template not configured",
        }),
  ]);

  // Log results
  if (toCustomer.success) {
    console.log("Customer confirmation email sent successfully");
  } else {
    console.error(
      "Failed to send customer confirmation email:",
      toCustomer.error
    );
  }

  if (toBusiness.success) {
    console.log("Business notification email sent successfully");
  } else {
    console.error(
      "Failed to send business notification email:",
      toBusiness.error
    );
  }

  return { toCustomer, toBusiness };
}

// Legacy function for backward compatibility
export async function sendBookingEmailsLegacy(payload: BookingEmailPayload) {
  const customerTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER");
  const businessTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS");

  const businessEmail = payload.businessEmail || "info@ramservis.az";

  // Convert legacy payload to enhanced format
  const enhancedPayload: EnhancedEmailPayload = {
    customerEmail: payload.customerEmail,
    customerName: payload.customerName,
    businessEmail: payload.businessEmail,
    bookingData: {
      firstName: payload.customerName.split(" ")[0] || "",
      lastName: payload.customerName.split(" ").slice(1).join(" ") || "",
      email: payload.customerEmail,
      phone: "",
      carId: "",
      pickupDate: payload.dates.split(" - ")[0] || "",
      dropoffDate: payload.dates.split(" - ")[1] || "",
      pickupLocation: payload.locations.split(" → ")[0] || "",
      dropoffLocation: payload.locations.split(" → ")[1] || "",
      additionalServices: payload.services ? payload.services.split(", ") : [],
      paymentMethod: "cash",
      totalDays: 1,
      totalPrice: parseFloat(payload.total.replace(/[^\d.]/g, "")) || 0,
      deposit: 0,
      serviceCharges: 0,
    },
    carDetails: {
      brand: payload.car.split(" ")[0] || "",
      model: payload.car.split(" ").slice(1).join(" ") || "",
      year: new Date().getFullYear(),
      image: "",
      dailyPrice: 0,
    },
    confirmationNumber: generateConfirmationNumber(),
    language: "en",
  };

  return sendBookingEmails(enhancedPayload);
}

// Click2Pay integration for secure payment links
export interface Click2PayConfig {
  merchantId: string;
  secretKey: string;
  baseUrl: string;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentLinkData {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
  expiryMinutes?: number;
}

// Generate secure Click2Pay payment link
export function generateClick2PayLink(
  paymentData: PaymentLinkData,
  config?: Click2PayConfig
): string {
  // Default configuration (should be moved to environment variables)
  const defaultConfig: Click2PayConfig = {
    merchantId: getEnv("NEXT_PUBLIC_CLICK2PAY_MERCHANT_ID") || "demo_merchant",
    secretKey: getEnv("CLICK2PAY_SECRET_KEY") || "demo_secret",
    baseUrl:
      getEnv("NEXT_PUBLIC_CLICK2PAY_BASE_URL") ||
      "https://payment.click2pay.az",
    currency: "AZN",
    returnUrl:
      getEnv("NEXT_PUBLIC_SITE_URL") + "/booking/success" ||
      "https://ramservis.az/booking/success",
    cancelUrl:
      getEnv("NEXT_PUBLIC_SITE_URL") + "/booking/cancel" ||
      "https://ramservis.az/booking/cancel",
  };

  const paymentConfig = config || defaultConfig;

  // Create payment parameters
  const params = new URLSearchParams({
    merchant_id: paymentConfig.merchantId,
    amount: (paymentData.amount * 100).toString(), // Convert to cents
    currency: paymentData.currency || paymentConfig.currency,
    order_id: paymentData.orderId,
    description: paymentData.description,
    customer_email: paymentData.customerEmail,
    customer_name: paymentData.customerName,
    return_url: paymentData.returnUrl || paymentConfig.returnUrl,
    cancel_url: paymentData.cancelUrl || paymentConfig.cancelUrl,
    language: "az", // Default to Azerbaijani
    expires_at: paymentData.expiryMinutes
      ? new Date(Date.now() + paymentData.expiryMinutes * 60000).toISOString()
      : new Date(Date.now() + 24 * 60 * 60000).toISOString(), // 24 hours default
  });

  // In a real implementation, you would generate a secure signature here
  // For now, we'll create a basic payment link structure
  return `${paymentConfig.baseUrl}/pay?${params.toString()}`;
}

// Generate payment link for booking
export function generateBookingPaymentLink(
  bookingData: BookingFormData,
  confirmationNumber: string,
  carDetails: { brand: string; model: string; year: number }
): string {
  const paymentData: PaymentLinkData = {
    amount: bookingData.totalPrice,
    currency: "AZN",
    orderId: confirmationNumber,
    description: `Car Rental: ${carDetails.brand} ${carDetails.model} ${carDetails.year}`,
    customerEmail: bookingData.email,
    customerName: `${bookingData.firstName} ${bookingData.lastName}`,
    returnUrl: `${getEnv(
      "NEXT_PUBLIC_SITE_URL"
    )}/booking/success?ref=${confirmationNumber}`,
    cancelUrl: `${getEnv(
      "NEXT_PUBLIC_SITE_URL"
    )}/booking/cancel?ref=${confirmationNumber}`,
    expiryMinutes: 1440, // 24 hours
  };

  return generateClick2PayLink(paymentData);
}

// Validate payment link security (basic implementation)
export function validatePaymentLink(link: string): boolean {
  try {
    const url = new URL(link);
    const requiredParams = [
      "merchant_id",
      "amount",
      "order_id",
      "customer_email",
    ];

    for (const param of requiredParams) {
      if (!url.searchParams.has(param)) {
        return false;
      }
    }

    // Check if link is not expired
    const expiresAt = url.searchParams.get("expires_at");
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Enhanced booking email sender with Click2Pay integration
export async function sendBookingEmailsWithPayment(
  payload: EnhancedEmailPayload,
  includePaymentLink: boolean = false,
  config?: EmailConfig
): Promise<{
  toCustomer: EmailResult;
  toBusiness: EmailResult;
  paymentLink?: string;
}> {
  let paymentLink: string | undefined;

  // Generate payment link if online payment is selected
  if (includePaymentLink && payload.bookingData.paymentMethod === "online") {
    paymentLink = generateBookingPaymentLink(
      payload.bookingData,
      payload.confirmationNumber,
      payload.carDetails
    );

    // Add payment link to payload
    payload.paymentLink = paymentLink;

    console.log("Generated payment link:", paymentLink);
  }

  const emailResults = await sendBookingEmails(payload, config);

  return {
    ...emailResults,
    paymentLink,
  };
}

// Import email templates
import {
  generateCustomerEmailTemplate,
  generateBusinessEmailTemplate,
  generatePlainTextTemplate,
} from "./email-templates";

// Enhanced email sending with template generation
export async function sendEnhancedBookingEmails(
  payload: EnhancedEmailPayload,
  config?: EmailConfig
): Promise<{
  toCustomer: EmailResult;
  toBusiness: EmailResult;
  paymentLink?: string;
}> {
  const customerTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER");
  const businessTemplate = getEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS");
  const businessEmail = payload.businessEmail || "info@ramservis.az";

  // Generate payment link if needed
  let paymentLink: string | undefined;
  if (payload.bookingData.paymentMethod === "online") {
    paymentLink = generateBookingPaymentLink(
      payload.bookingData,
      payload.confirmationNumber,
      payload.carDetails
    );
    payload.paymentLink = paymentLink;
  }

  console.log("Sending enhanced booking emails...", {
    customer: payload.customerEmail,
    business: businessEmail,
    confirmation: payload.confirmationNumber,
    hasPaymentLink: !!paymentLink,
  });

  // Generate HTML templates
  const customerHtmlTemplate = generateCustomerEmailTemplate(payload);
  const businessHtmlTemplate = generateBusinessEmailTemplate(payload);

  // Generate plain text templates
  const customerTextTemplate = generatePlainTextTemplate(payload, false);
  const businessTextTemplate = generatePlainTextTemplate(payload, true);

  // Enhanced payload with generated templates
  const enhancedPayload = {
    ...payload,
    customerHtmlTemplate,
    businessHtmlTemplate,
    customerTextTemplate,
    businessTextTemplate,
  };

  // Send emails in parallel
  const [toCustomer, toBusiness] = await Promise.all([
    customerTemplate
      ? sendEmailWithRetry(
          customerTemplate,
          payload.customerEmail,
          enhancedPayload,
          config,
          false
        )
      : Promise.resolve({
          success: false,
          skipped: true,
          error: "Customer template not configured",
        }),
    businessTemplate
      ? sendEmailWithRetry(
          businessTemplate,
          businessEmail,
          enhancedPayload,
          config,
          true
        )
      : Promise.resolve({
          success: false,
          skipped: true,
          error: "Business template not configured",
        }),
  ]);

  // Log results
  if (toCustomer.success) {
    console.log("✅ Customer confirmation email sent successfully");
  } else {
    console.error(
      "❌ Failed to send customer confirmation email:",
      toCustomer.error
    );
  }

  if (toBusiness.success) {
    console.log("✅ Business notification email sent successfully");
  } else {
    console.error(
      "❌ Failed to send business notification email:",
      toBusiness.error
    );
  }

  return { toCustomer, toBusiness, paymentLink };
}

// Utility function to test email templates
export function previewEmailTemplates(payload: EnhancedEmailPayload): {
  customerHtml: string;
  businessHtml: string;
  customerText: string;
  businessText: string;
} {
  return {
    customerHtml: generateCustomerEmailTemplate(payload),
    businessHtml: generateBusinessEmailTemplate(payload),
    customerText: generatePlainTextTemplate(payload, false),
    businessText: generatePlainTextTemplate(payload, true),
  };
}
