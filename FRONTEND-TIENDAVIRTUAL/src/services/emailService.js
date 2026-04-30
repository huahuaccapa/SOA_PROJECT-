// src/services/emailService.js

class EmailService {
  constructor() {
    this.sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
  }

  saveEmails() {
    localStorage.setItem('sent_emails', JSON.stringify(this.sentEmails));
  }

  async sendEmail({ to, subject, template, data }) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const emailRecord = {
      id: Date.now(),
      to,
      subject,
      template,
      data,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    this.sentEmails.push(emailRecord);
    this.saveEmails();

    console.log('========================================');
    console.log('📧 [EMAIL SIMULADO]');
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Plantilla: ${template}`);
    console.log('Datos:', JSON.stringify(data, null, 2));
    console.log('========================================');

    return emailRecord;
  }

  async sendWelcomeEmail(userEmail, userName) {
    return this.sendEmail({
      to: userEmail,
      subject: '¡Bienvenido a TechStore! 🎉',
      template: 'welcome',
      data: { userName },
    });
  }

  async sendOrderConfirmation(userEmail, orderDetails) {
    return this.sendEmail({
      to: userEmail,
      subject: `Confirmación de Pedido #${orderDetails.orderId} - TechStore`,
      template: 'order-confirmation',
      data: {
        orderId: orderDetails.orderId,
        total: orderDetails.total,
        items: orderDetails.items,
        date: new Date().toLocaleDateString('es-PE'),
      },
    });
  }

  async sendShippingNotification(userEmail, orderId, trackingNumber) {
    return this.sendEmail({
      to: userEmail,
      subject: `Tu pedido #${orderId} ha sido enviado - TechStore`,
      template: 'shipping',
      data: {
        orderId,
        trackingNumber,
        estimatedDelivery: new Date(Date.now() + 3 * 86400000).toLocaleDateString('es-PE'),
      },
    });
  }

  async sendPaymentConfirmation(userEmail, paymentDetails) {
    return this.sendEmail({
      to: userEmail,
      subject: 'Pago Confirmado - TechStore',
      template: 'payment-confirmation',
      data: {
        amount: paymentDetails.amount,
        method: paymentDetails.method,
        transactionId: paymentDetails.transactionId,
        date: new Date().toLocaleDateString('es-PE'),
      },
    });
  }
}

const emailService = new EmailService();
export default emailService;