// src/services/emailService.js

/**
 * Servicio de Notificaciones por Email Simulado
 * Simula el envío de correos electrónicos para confirmaciones y notificaciones
 */

class EmailService {
  constructor() {
    this.sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
  }

  /**
   * Guarda el registro de emails enviados
   */
  saveEmails() {
    localStorage.setItem('sent_emails', JSON.stringify(this.sentEmails));
  }

  /**
   * Simula el envío de un email
   */
  async sendEmail({ to, subject, template, data }) {
    // Simular delay de envío
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

    // Log para debugging
    console.log('========================================');
    console.log('📧 [EMAIL SIMULADO]');
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Plantilla: ${template}`);
    console.log('Datos:', data);
    console.log('========================================');

    return emailRecord;
  }

  /**
   * Envía confirmación de registro
   */
  async sendWelcomeEmail(userEmail, userName) {
    return this.sendEmail({
      to: userEmail,
      subject: '¡Bienvenido a TechStore! 🎉',
      template: 'welcome',
      data: {
        userName,
        loginUrl: `${window.location.origin}/login`,
        catalogUrl: `${window.location.origin}/catalogo`,
      },
    });
  }

  /**
   * Envía confirmación de pedido
   */
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
        trackingUrl: orderDetails.trackingUrl || null,
      },
    });
  }

  /**
   * Envía notificación de envío
   */
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

  /**
   * Envía notificación de pago confirmado
   */
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

  /**
   * Envía recordatorio de carrito abandonado
   */
  async sendAbandonedCartReminder(userEmail, cartItems) {
    return this.sendEmail({
      to: userEmail,
      subject: '¡Tienes productos en tu carrito! - TechStore',
      template: 'abandoned-cart',
      data: {
        items: cartItems,
        cartUrl: `${window.location.origin}/carrito`,
      },
    });
  }

  /**
   * Envía notificación de ofertas especiales
   */
  async sendPromotionalEmail(userEmail, promotion) {
    return this.sendEmail({
      to: userEmail,
      subject: `${promotion.title} - TechStore`,
      template: 'promotion',
      data: {
        title: promotion.title,
        description: promotion.description,
        discount: promotion.discount,
        validUntil: promotion.validUntil,
        catalogUrl: `${window.location.origin}/catalogo`,
      },
    });
  }

  /**
   * Obtiene el historial de emails enviados
   */
  getEmailHistory() {
    return this.sentEmails;
  }

  /**
   * Obtiene emails enviados a un usuario específico
   */
  getEmailsByRecipient(email) {
    return this.sentEmails.filter(e => e.to === email);
  }
}

const emailService = new EmailService();
export default emailService;