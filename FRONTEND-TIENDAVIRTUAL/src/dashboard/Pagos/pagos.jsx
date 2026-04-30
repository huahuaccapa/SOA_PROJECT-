// src/dashboard/pagos/pagos.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Plus, Trash2, CheckCircle, AlertCircle, 
  DollarSign, Calendar, Shield, Lock
} from 'lucide-react';

const Pagos = ({ userRole }) => {
  const navigate = useNavigate();
  
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/24', isDefault: false }
  ]);

  const [transactions] = useState([
    { id: 'TRX-001', date: '2024-01-15', amount: 4999, status: 'completed', orderId: 'ORD-001', method: 'Visa ****4242' },
    { id: 'TRX-002', date: '2024-01-10', amount: 1299, status: 'completed', orderId: 'ORD-002', method: 'Mastercard ****8888' },
    { id: 'TRX-003', date: '2024-01-05', amount: 3499, status: 'refunded', orderId: 'ORD-003', method: 'Visa ****4242' }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

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

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txnId = `TXN-${Date.now()}`;
      setTransactionId(txnId);
      setPaymentSuccess(true);
    } catch (error) {
      alert('Error en el pago: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'completed' ? 'badge-success' : 'badge-danger';
  };

  const getStatusText = (status) => {
    return status === 'completed' ? 'Completado' : 'Reembolsado';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? <CheckCircle size={14} /> : <AlertCircle size={14} />;
  };

  if (paymentSuccess && userRole !== 'ADMIN') {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="card text-center">
          <div className="text-success mb-6">
            <CheckCircle size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-text-base mb-2">¡Pago Exitoso!</h2>
          <p className="text-text-muted mb-2">Tu transacción ha sido completada exitosamente.</p>
          <p className="text-sm text-text-muted mb-6">
            ID de transacción: <span className="font-mono text-primary">{transactionId}</span>
          </p>
          <p className="text-text-muted text-sm mb-6">
            Recibirás un correo de confirmación con los detalles de tu compra.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary" onClick={() => navigate('/pedidos')}>
              Ver Mis Pedidos
            </button>
            <button className="btn-secondary" onClick={() => navigate('/catalogo')}>
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-base flex items-center gap-3">
            <CreditCard size={28} className="text-primary" />
            {userRole === 'ADMIN' ? 'Gestión de Pagos' : 'Métodos de Pago'}
          </h1>
          <p className="text-text-muted mt-1">
            {userRole === 'ADMIN' 
              ? 'Administra todas las transacciones y métodos de pago' 
              : 'Gestiona tus métodos de pago y revisa tus transacciones'}
          </p>
        </div>
        {userRole !== 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowAddCard(true)}>
            <Plus size={18} /> Agregar método
          </button>
        )}
      </div>

      {userRole === 'ADMIN' ? (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="text-text-muted text-sm block">Ingresos Totales</span>
                <span className="text-2xl font-bold text-text-base">S/ 45,678</span>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10 text-info">
                <CreditCard size={24} />
              </div>
              <div>
                <span className="text-text-muted text-sm block">Transacciones</span>
                <span className="text-2xl font-bold text-text-base">234</span>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10 text-warning">
                <Calendar size={24} />
              </div>
              <div>
                <span className="text-text-muted text-sm block">Hoy</span>
                <span className="text-2xl font-bold text-text-base">S/ 1,234</span>
              </div>
            </div>
          </div>

          {/* Admin Transactions Table */}
          <div className="card overflow-hidden">
            <h2 className="text-xl font-semibold text-text-base p-6 pb-4">Transacciones Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">ID Transacción</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Pedido</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Fecha</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Método</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Monto</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(trx => (
                    <tr key={trx.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                      <td className="p-4 font-mono text-text-base">{trx.id}</td>
                      <td className="p-4 text-text-secondary">{trx.orderId}</td>
                      <td className="p-4 text-text-secondary">{trx.date}</td>
                      <td className="p-4 text-text-secondary">{trx.method}</td>
                      <td className="p-4 font-semibold text-primary">
                        S/ {trx.amount.toLocaleString('es-PE')}
                      </td>
                      <td className="p-4">
                        <span className={getStatusBadge(trx.status)}>
                          {getStatusIcon(trx.status)}
                          {getStatusText(trx.status)}
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
          {/* User Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map(card => (
              <div key={card.id} className={`card ${card.isDefault ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <CreditCard size={32} className="text-primary" />
                  {card.isDefault && (
                    <span className="badge-success text-xs">Predeterminada</span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <span className="font-semibold text-text-base block">{card.type}</span>
                  <span className="font-mono text-text-muted block">**** **** **** {card.last4}</span>
                  <span className="text-text-muted text-sm block">Expira {card.expiry}</span>
                </div>
                <div className="flex gap-3">
                  {!card.isDefault && (
                    <button 
                      className="text-primary text-sm font-medium hover:text-primary-light transition-colors"
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Establecer como predeterminada
                    </button>
                  )}
                  <button 
                    className="text-danger text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-1"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Modal */}
          {showAddCard && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddCard(false)}>
              <div className="bg-base-secondary border border-border-color rounded-2xl p-6 max-w-md w-full animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-base">Agregar Nueva Tarjeta</h2>
                  <button className="text-text-muted hover:text-text-base" onClick={() => setShowAddCard(false)}>✕</button>
                </div>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={newCard.number}
                      onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      placeholder="NOMBRE APELLIDO"
                      value={newCard.name}
                      onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Expiración</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength="3"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary flex-1" onClick={() => setShowAddCard(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      <Plus size={16} /> Agregar Tarjeta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User Transactions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-text-base mb-6">Transacciones Recientes</h2>
            <div className="space-y-4">
              {transactions.map(trx => (
                <div key={trx.id} className="flex items-center justify-between p-4 bg-base-primary rounded-lg">
                  <div>
                    <span className="font-medium text-text-base block">{trx.orderId}</span>
                    <div className="flex gap-3 text-sm text-text-muted mt-1">
                      <span>{trx.date}</span>
                      <span>{trx.method}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary">
                      S/ {trx.amount.toLocaleString('es-PE')}
                    </span>
                    <span className={getStatusBadge(trx.status)}>
                      {getStatusIcon(trx.status)}
                      {getStatusText(trx.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulación de Pasarela de Pago */}
          <div className="card">
            <div className="flex items-center gap-2 text-text-muted mb-6">
              <Shield size={18} className="text-success" />
              <span className="text-sm">Simulación de pasarela de pago segura</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Titular de la tarjeta</label>
                <input type="text" className="input-field" placeholder="NOMBRE APELLIDO" defaultValue="Usuario Demo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Número de tarjeta</label>
                <input type="text" className="input-field" placeholder="1234 5678 9012 3456" defaultValue="4532 1234 5678 9012" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Expiración</label>
                  <input type="text" className="input-field" placeholder="MM/AA" defaultValue="12/25" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">CVV</label>
                  <input type="text" className="input-field" placeholder="123" defaultValue="123" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Monto a pagar</label>
                <div className="input-field font-bold text-xl text-primary">
                  S/ 1,299.00
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="btn-primary w-full py-3 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Lock size={18} /> Pagar S/ 1,299.00
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagos;