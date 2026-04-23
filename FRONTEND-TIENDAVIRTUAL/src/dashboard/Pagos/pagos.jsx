import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle, DollarSign, Calendar, Shield } from 'lucide-react';

const Pagos = ({ userRole }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/24', isDefault: false }
  ]);

  const [transactions] = useState([
    { id: 'TRX-001', date: '2024-01-15', amount: 1299.99, status: 'completed', orderId: 'ORD-001', method: 'Visa ****4242' },
    { id: 'TRX-002', date: '2024-01-10', amount: 299.99, status: 'completed', orderId: 'ORD-002', method: 'Mastercard ****8888' },
    { id: 'TRX-003', date: '2024-01-05', amount: 899.99, status: 'refunded', orderId: 'ORD-003', method: 'Visa ****4242' }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const handleAddCard = (e) => {
    e.preventDefault();
    const last4 = newCard.number.slice(-4);
    const cardType = newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';
    setPaymentMethods([...paymentMethods, {
      id: Date.now(),
      type: cardType,
      last4,
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0
    }]);
    setShowAddCard(false);
    setNewCard({ number: '', name: '', expiry: '', cvv: '' });
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const handleDeleteCard = (id) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'refunded':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="pagos-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <CreditCard size={28} />
            {userRole === 'ADMIN' ? 'Gestión de Pagos' : 'Métodos de Pago'}
          </h1>
          <p>
            {userRole === 'ADMIN' 
              ? 'Administra todas las transacciones y métodos de pago' 
              : 'Gestiona tus métodos de pago y revisa tus transacciones'}
          </p>
        </div>
        {userRole !== 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowAddCard(true)}>
            <Plus size={18} /> Agregar método
          </button>
        )}
      </div>

      {userRole === 'ADMIN' ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon success">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Ingresos Totales</span>
                <span className="stat-value">$45,678</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info">
                <CreditCard size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Transacciones</span>
                <span className="stat-value">234</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Hoy</span>
                <span className="stat-value">$1,234</span>
              </div>
            </div>
          </div>

          <div className="table-section">
            <h2>Transacciones Recientes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID Transacción</th>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Método</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(trx => (
                    <tr key={trx.id}>
                      <td className="mono">{trx.id}</td>
                      <td>{trx.orderId}</td>
                      <td>{trx.date}</td>
                      <td>{trx.method}</td>
                      <td className="amount">${trx.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${trx.status}`}>
                          {getStatusIcon(trx.status)}
                          {trx.status === 'completed' ? 'Completado' : 'Reembolsado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="payment-methods-grid">
            {paymentMethods.map(card => (
              <div key={card.id} className={`payment-card ${card.isDefault ? 'default' : ''}`}>
                <div className="payment-card-header">
                  <div className="card-type-icon">
                    <CreditCard size={32} />
                  </div>
                  {card.isDefault && (
                    <span className="default-badge">Predeterminada</span>
                  )}
                </div>
                <div className="payment-card-body">
                  <span className="card-type">{card.type}</span>
                  <span className="card-number">**** **** **** {card.last4}</span>
                  <span className="card-expiry">Expira {card.expiry}</span>
                </div>
                <div className="payment-card-actions">
                  {!card.isDefault && (
                    <button className="btn-text" onClick={() => handleSetDefault(card.id)}>
                      Establecer como predeterminada
                    </button>
                  )}
                  <button className="btn-text danger" onClick={() => handleDeleteCard(card.id)}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddCard && (
            <div className="modal-overlay" onClick={() => setShowAddCard(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Agregar Nueva Tarjeta</h2>
                  <button className="modal-close" onClick={() => setShowAddCard(false)}>✕</button>
                </div>
                <form onSubmit={handleAddCard}>
                  <div className="form-group">
                    <label>Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={newCard.number}
                      onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      placeholder="NOMBRE APELLIDO"
                      value={newCard.name}
                      onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Expiración</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength="3"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddCard(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Plus size={16} /> Agregar Tarjeta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="transactions-section">
            <h2>Transacciones Recientes</h2>
            <div className="transactions-list">
              {transactions.map(trx => (
                <div key={trx.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-id">{trx.orderId}</span>
                    <span className="transaction-date">{trx.date}</span>
                    <span className="transaction-method">{trx.method}</span>
                  </div>
                  <div className="transaction-status-info">
                    <span className="transaction-amount">${trx.amount.toLocaleString()}</span>
                    <span className={`status-badge ${trx.status}`}>
                      {getStatusIcon(trx.status)}
                      {trx.status === 'completed' ? 'Completado' : 'Reembolsado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagos;