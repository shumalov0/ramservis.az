// Email template utilities and multilingual support
import { EnhancedEmailPayload } from './email';

// Multilingual email content
export interface EmailContent {
  subject: string;
  greeting: string;
  bookingConfirmed: string;
  carDetails: string;
  bookingDetails: string;
  paymentInfo: string;
  nextSteps: string;
  contactInfo: string;
  footer: string;
  thankYou: string;
}

// Email translations
const emailTranslations: Record<string, EmailContent> = {
  en: {
    subject: 'Booking Confirmation - Ram Servis Car Rental',
    greeting: 'Dear {{customerName}},',
    bookingConfirmed: 'Your car rental booking has been confirmed! Here are your booking details:',
    carDetails: 'Vehicle Information',
    bookingDetails: 'Booking Details',
    paymentInfo: 'Payment Information',
    nextSteps: 'Next Steps',
    contactInfo: 'Contact Information',
    footer: 'Thank you for choosing Ram Servis Car Rental!',
    thankYou: 'We look forward to serving you.',
  },
  az: {
    subject: 'Rezervasiya Təsdiqi - Ram Servis Avtomobil İcarəsi',
    greeting: 'Hörmətli {{customerName}},',
    bookingConfirmed: 'Avtomobil icarəsi rezervasiyanız təsdiqləndi! Rezervasiya təfərrüatlarınız:',
    carDetails: 'Avtomobil Məlumatları',
    bookingDetails: 'Rezervasiya Təfərrüatları',
    paymentInfo: 'Ödəniş Məlumatları',
    nextSteps: 'Növbəti Addımlar',
    contactInfo: 'Əlaqə Məlumatları',
    footer: 'Ram Servis Avtomobil İcarəsini seçdiyiniz üçün təşəkkür edirik!',
    thankYou: 'Sizə xidmət etməyi səbirsizliklə gözləyirik.',
  },
  ru: {
    subject: 'Подтверждение бронирования - Ram Servis Аренда автомобилей',
    greeting: 'Уважаемый {{customerName}},',
    bookingConfirmed: 'Ваше бронирование автомобиля подтверждено! Вот детали вашего бронирования:',
    carDetails: 'Информация об автомобиле',
    bookingDetails: 'Детали бронирования',
    paymentInfo: 'Информация об оплате',
    nextSteps: 'Следующие шаги',
    contactInfo: 'Контактная информация',
    footer: 'Спасибо за выбор Ram Servis Аренда автомобилей!',
    thankYou: 'Мы с нетерпением ждем возможности служить вам.',
  },
};

// Get email content for specific language
export function getEmailContent(language: string = 'en'): EmailContent {
  return emailTranslations[language] || emailTranslations.en;
}

// Customer confirmation email template
export function generateCustomerEmailTemplate(payload: EnhancedEmailPayload): string {
  const content = getEmailContent(payload.language);
  const { bookingData, carDetails, confirmationNumber, paymentLink } = payload;

  const template = `
<!DOCTYPE html>
<html lang="${payload.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .confirmation-number {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin: 20px 0;
        }
        .section {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .section h3 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .car-info {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 15px 0;
        }
        .car-image {
            width: 120px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-label {
            font-weight: bold;
            color: #555;
        }
        .detail-value {
            color: #333;
        }
        .payment-link {
            background-color: #28a745;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .payment-link:hover {
            background-color: #218838;
        }
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #e3f2fd;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
        .contact-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            .car-info { flex-direction: column; text-align: center; }
            .detail-row { flex-direction: column; gap: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚗 Ram Servis</div>
            <h2>${content.subject}</h2>
            <div class="confirmation-number">
                Confirmation #: ${confirmationNumber}
            </div>
        </div>

        <p>${content.greeting.replace('{{customerName}}', payload.customerName)}</p>
        <p>${content.bookingConfirmed}</p>

        <div class="section">
            <h3>🚙 ${content.carDetails}</h3>
            <div class="car-info">
                ${carDetails.image ? `<img src="${carDetails.image}" alt="Car" class="car-image">` : ''}
                <div>
                    <h4>${carDetails.brand} ${carDetails.model} ${carDetails.year}</h4>
                    <p>Daily Rate: ${carDetails.dailyPrice} AZN</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>📅 ${content.bookingDetails}</h3>
            <div class="detail-row">
                <span class="detail-label">Pickup Date:</span>
                <span class="detail-value">${bookingData.pickupDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Return Date:</span>
                <span class="detail-value">${bookingData.dropoffDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Pickup Location:</span>
                <span class="detail-value">${bookingData.pickupLocation}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Return Location:</span>
                <span class="detail-value">${bookingData.dropoffLocation}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Days:</span>
                <span class="detail-value">${bookingData.totalDays}</span>
            </div>
            ${bookingData.additionalServices.length > 0 ? `
            <div class="detail-row">
                <span class="detail-label">Additional Services:</span>
                <span class="detail-value">${bookingData.additionalServices.join(', ')}</span>
            </div>
            ` : ''}
            ${bookingData.specialRequests ? `
            <div class="detail-row">
                <span class="detail-label">Special Requests:</span>
                <span class="detail-value">${bookingData.specialRequests}</span>
            </div>
            ` : ''}
        </div>

        <div class="section">
            <h3>💳 ${content.paymentInfo}</h3>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${bookingData.paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rental Cost:</span>
                <span class="detail-value">${bookingData.totalPrice - bookingData.serviceCharges} AZN</span>
            </div>
            ${bookingData.serviceCharges > 0 ? `
            <div class="detail-row">
                <span class="detail-label">Service Charges:</span>
                <span class="detail-value">${bookingData.serviceCharges} AZN</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Deposit:</span>
                <span class="detail-value">${bookingData.deposit} AZN</span>
            </div>
            <div class="total-amount">
                Total Amount: ${bookingData.totalPrice} AZN
            </div>
            
            ${paymentLink && bookingData.paymentMethod === 'online' ? `
            <div style="text-align: center;">
                <a href="${paymentLink}" class="payment-link">
                    💳 Complete Online Payment
                </a>
                <p><small>This payment link expires in 24 hours</small></p>
            </div>
            ` : ''}
        </div>

        <div class="contact-info">
            <h3>📞 ${content.contactInfo}</h3>
            <p><strong>Phone:</strong> +994 XX XXX XX XX</p>
            <p><strong>Email:</strong> info@ramservis.az</p>
            <p><strong>WhatsApp:</strong> +994 XX XXX XX XX</p>
            <p><strong>Address:</strong> Baku, Azerbaijan</p>
        </div>

        <div class="section">
            <h3>📋 ${content.nextSteps}</h3>
            <ul>
                <li>Please bring a valid driver's license and passport</li>
                <li>Arrive 15 minutes before your pickup time</li>
                <li>Contact us if you need to make any changes</li>
                ${bookingData.paymentMethod === 'online' && paymentLink ? 
                  '<li>Complete your online payment using the link above</li>' : 
                  '<li>Payment will be collected at pickup</li>'
                }
            </ul>
        </div>

        <div class="footer">
            <p>${content.footer}</p>
            <p>${content.thankYou}</p>
            <p><small>This is an automated email. Please do not reply directly to this message.</small></p>
        </div>
    </div>
</body>
</html>
  `;

  return template.trim();
}

// Business notification email template
export function generateBusinessEmailTemplate(payload: EnhancedEmailPayload): string {
  const { bookingData, carDetails, confirmationNumber, paymentLink } = payload;

  const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification - Ram Servis</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .alert {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .section {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
        }
        .section h3 {
            color: #dc3545;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
        }
        .detail-item {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .detail-value {
            color: #212529;
            font-size: 16px;
        }
        .customer-info {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
        }
        .car-info {
            background-color: #f3e5f5;
            border-left: 4px solid #9c27b0;
        }
        .payment-info {
            background-color: #e8f5e8;
            border-left: 4px solid #4caf50;
        }
        .urgent {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
        }
        .payment-link {
            background-color: #28a745;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 15px 0;
            font-weight: bold;
        }
        .total-revenue {
            font-size: 28px;
            font-weight: bold;
            color: #28a745;
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background-color: #d4edda;
            border-radius: 8px;
            border: 2px solid #28a745;
        }
        .actions {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .action-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 5px 10px 5px 0;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .detail-grid { grid-template-columns: 1fr; }
            body { padding: 10px; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 NEW BOOKING ALERT</h1>
            <h2>Confirmation #: ${confirmationNumber}</h2>
        </div>

        <div class="alert">
            ⚡ New car rental booking received! Immediate action required.
        </div>

        <div class="total-revenue">
            💰 Revenue: ${bookingData.totalPrice} AZN
        </div>

        <div class="section customer-info">
            <h3>👤 Customer Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">${bookingData.firstName} ${bookingData.lastName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${bookingData.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${bookingData.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Payment Method</div>
                    <div class="detail-value">${bookingData.paymentMethod === 'online' ? '💳 Online Payment' : '💵 Cash Payment'}</div>
                </div>
            </div>
        </div>

        <div class="section car-info">
            <h3>🚗 Vehicle Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Vehicle</div>
                    <div class="detail-value">${carDetails.brand} ${carDetails.model} ${carDetails.year}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Daily Rate</div>
                    <div class="detail-value">${carDetails.dailyPrice} AZN</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Days</div>
                    <div class="detail-value">${bookingData.totalDays} days</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Car ID</div>
                    <div class="detail-value">${bookingData.carId}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>📅 Rental Details</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Pickup Date</div>
                    <div class="detail-value">${bookingData.pickupDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Return Date</div>
                    <div class="detail-value">${bookingData.dropoffDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Pickup Location</div>
                    <div class="detail-value">${bookingData.pickupLocation}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Return Location</div>
                    <div class="detail-value">${bookingData.dropoffLocation}</div>
                </div>
            </div>
            
            ${bookingData.additionalServices.length > 0 ? `
            <div class="detail-item" style="margin-top: 15px;">
                <div class="detail-label">Additional Services</div>
                <div class="detail-value">${bookingData.additionalServices.join(', ')}</div>
            </div>
            ` : ''}
            
            ${bookingData.specialRequests ? `
            <div class="detail-item" style="margin-top: 15px;">
                <div class="detail-label">Special Requests</div>
                <div class="detail-value">${bookingData.specialRequests}</div>
            </div>
            ` : ''}
        </div>

        <div class="section payment-info">
            <h3>💰 Financial Summary</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Rental Cost</div>
                    <div class="detail-value">${bookingData.totalPrice - bookingData.serviceCharges} AZN</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Service Charges</div>
                    <div class="detail-value">${bookingData.serviceCharges} AZN</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Deposit Required</div>
                    <div class="detail-value">${bookingData.deposit} AZN</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Amount</div>
                    <div class="detail-value"><strong>${bookingData.totalPrice} AZN</strong></div>
                </div>
            </div>
            
            ${paymentLink && bookingData.paymentMethod === 'online' ? `
            <div style="margin-top: 20px; text-align: center;">
                <p><strong>Customer Payment Link:</strong></p>
                <a href="${paymentLink}" class="payment-link">
                    View Payment Link
                </a>
                <p><small>Link expires in 24 hours</small></p>
            </div>
            ` : ''}
        </div>

        <div class="actions">
            <h3>⚡ Required Actions</h3>
            <ul>
                <li><strong>Verify vehicle availability</strong> for ${bookingData.pickupDate} - ${bookingData.dropoffDate}</li>
                <li><strong>Prepare vehicle</strong> - ${carDetails.brand} ${carDetails.model} ${carDetails.year}</li>
                <li><strong>Contact customer</strong> to confirm pickup details</li>
                ${bookingData.paymentMethod === 'online' ? 
                  '<li><strong>Monitor payment status</strong> - Online payment selected</li>' : 
                  '<li><strong>Prepare for cash payment</strong> at pickup</li>'
                }
                <li><strong>Update booking system</strong> with confirmation #${confirmationNumber}</li>
            </ul>
            
            <div style="margin-top: 20px;">
                <a href="tel:${bookingData.phone}" class="action-button">📞 Call Customer</a>
                <a href="mailto:${bookingData.email}" class="action-button">✉️ Email Customer</a>
                <a href="https://wa.me/${bookingData.phone.replace(/[^\d]/g, '')}" class="action-button">💬 WhatsApp</a>
            </div>
        </div>

        <div class="section urgent">
            <h3>🚨 Urgent Reminders</h3>
            <ul>
                <li>Respond to customer within 2 hours</li>
                <li>Confirm vehicle availability immediately</li>
                <li>Check vehicle condition and prepare for rental</li>
                <li>Verify customer documents will be available</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; color: #666;">
            <p><strong>Ram Servis Car Rental - Business Notification</strong></p>
            <p>Booking received at: ${new Date().toLocaleString()}</p>
            <p><small>This is an automated notification from your booking system.</small></p>
        </div>
    </div>
</body>
</html>
  `;

  return template.trim();
}

// Generate plain text version for email clients that don't support HTML
export function generatePlainTextTemplate(payload: EnhancedEmailPayload, isBusinessEmail: boolean = false): string {
  const { bookingData, carDetails, confirmationNumber, paymentLink } = payload;
  const content = getEmailContent(payload.language);

  if (isBusinessEmail) {
    return `
NEW BOOKING ALERT - Ram Servis Car Rental
==========================================

Confirmation Number: ${confirmationNumber}
Booking Date: ${new Date().toLocaleString()}

CUSTOMER INFORMATION:
- Name: ${bookingData.firstName} ${bookingData.lastName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

VEHICLE INFORMATION:
- Car: ${carDetails.brand} ${carDetails.model} ${carDetails.year}
- Daily Rate: ${carDetails.dailyPrice} AZN

RENTAL DETAILS:
- Pickup Date: ${bookingData.pickupDate}
- Return Date: ${bookingData.dropoffDate}
- Pickup Location: ${bookingData.pickupLocation}
- Return Location: ${bookingData.dropoffLocation}
- Total Days: ${bookingData.totalDays}
- Additional Services: ${bookingData.additionalServices.join(', ') || 'None'}
- Special Requests: ${bookingData.specialRequests || 'None'}

PAYMENT INFORMATION:
- Payment Method: ${bookingData.paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}
- Total Amount: ${bookingData.totalPrice} AZN
- Deposit: ${bookingData.deposit} AZN
${paymentLink ? `- Payment Link: ${paymentLink}` : ''}

REQUIRED ACTIONS:
- Verify vehicle availability
- Contact customer to confirm details
- Prepare vehicle for rental
- Update booking system

Contact Customer:
- Phone: ${bookingData.phone}
- Email: ${bookingData.email}

This is an automated notification from Ram Servis booking system.
    `.trim();
  } else {
    return `
${content.subject}
==========================================

${content.greeting.replace('{{customerName}}', payload.customerName)}

${content.bookingConfirmed}

Confirmation Number: ${confirmationNumber}

VEHICLE INFORMATION:
${carDetails.brand} ${carDetails.model} ${carDetails.year}
Daily Rate: ${carDetails.dailyPrice} AZN

BOOKING DETAILS:
- Pickup Date: ${bookingData.pickupDate}
- Return Date: ${bookingData.dropoffDate}
- Pickup Location: ${bookingData.pickupLocation}
- Return Location: ${bookingData.dropoffLocation}
- Total Days: ${bookingData.totalDays}
- Additional Services: ${bookingData.additionalServices.join(', ') || 'None'}
${bookingData.specialRequests ? `- Special Requests: ${bookingData.specialRequests}` : ''}

PAYMENT INFORMATION:
- Payment Method: ${bookingData.paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}
- Total Amount: ${bookingData.totalPrice} AZN
- Deposit: ${bookingData.deposit} AZN
${paymentLink ? `- Payment Link: ${paymentLink}` : ''}

CONTACT INFORMATION:
Phone: +994 XX XXX XX XX
Email: info@ramservis.az
WhatsApp: +994 XX XXX XX XX

NEXT STEPS:
- Bring valid driver's license and passport
- Arrive 15 minutes before pickup time
- Contact us for any changes
${bookingData.paymentMethod === 'online' && paymentLink ? '- Complete online payment using the provided link' : '- Payment will be collected at pickup'}

${content.footer}
${content.thankYou}

This is an automated email. Please do not reply directly to this message.
    `.trim();
  }
}