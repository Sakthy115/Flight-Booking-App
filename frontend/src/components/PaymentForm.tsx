import React, { useState } from 'react';
import { PaymentInfo } from '../types';
import './PaymentForm.css';

interface PaymentFormProps {
    totalAmount: number;
    currency: string;
    onSubmit: (payment: PaymentInfo) => void;
    onBack: () => void;
    isProcessing?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    totalAmount,
    currency,
    onSubmit,
    onBack,
    isProcessing
}) => {
    const [payment, setPayment] = useState<PaymentInfo>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
    });

    const handleChange = (field: keyof PaymentInfo, value: string) => {
        setPayment(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field: keyof PaymentInfo['billingAddress'], value: string) => {
        setPayment(prev => ({
            ...prev,
            billingAddress: { ...prev.billingAddress, [field]: value },
        }));
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g) || [];
        return chunks.join(' ').substring(0, 19);
    };

    const handleCardNumberChange = (value: string) => {
        const formatted = formatCardNumber(value);
        handleChange('cardNumber', formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(payment);
    };

    const formatPrice = (price: number, curr: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr,
        }).format(price);
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="payment-header">
                <h2>Payment Details</h2>
                <div className="total-amount">
                    <span className="total-label">Total Amount:</span>
                    <span className="total-value">{formatPrice(totalAmount, currency)}</span>
                </div>
            </div>

            <div className="payment-section card">
                <h3>Card Information</h3>

                <div className="form-grid">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Card Number *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Cardholder Name *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.cardHolder}
                            onChange={(e) => handleChange('cardHolder', e.target.value)}
                            placeholder="JOHN DOE"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Expiry Date *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.expiryDate}
                            onChange={(e) => handleChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">CVV *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.cvv}
                            onChange={(e) => handleChange('cvv', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="payment-section card">
                <h3>Billing Address</h3>

                <div className="form-grid">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Street Address *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.billingAddress.street}
                            onChange={(e) => handleAddressChange('street', e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">City *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.billingAddress.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">State/Province *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.billingAddress.state}
                            onChange={(e) => handleAddressChange('state', e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">ZIP/Postal Code *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.billingAddress.zipCode}
                            onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Country *</label>
                        <input
                            type="text"
                            className="input"
                            value={payment.billingAddress.country}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="payment-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>This is a demo payment form. No actual charges will be made.</p>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isProcessing}>
                    Back to Passengers
                </button>
                <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                    {isProcessing ? (
                        <>
                            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            Processing...
                        </>
                    ) : (
                        'Complete Booking'
                    )}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;
