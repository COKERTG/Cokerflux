import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

// Helper to format a WhatsApp message with the cart contents
const formatWhatsAppMessage = (items, formatPrice) => {
  if (!items.length) return 'My cart is empty.';
  const lines = items.map(i => {
    const name = i.product.name;
    const size = i.product.selectedSize ? ` (${i.product.selectedSize})` : '';
    const qty = i.quantity;
    const price = formatPrice(i.product.price * i.quantity);
    return `*${name}${size}* – Qty: ${qty} – ${price}`;
  });
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalStr = formatPrice(total);
  return `Hello! I would like to place an order:\n\n${lines.join('\n')}\n\n*Total:* ${totalStr}`;
};

/**
 * Slide-over cart panel from the right side.
 *
 * Props:
 * - isOpen: boolean – controls visibility.
 * - onClose: () => void – called when the panel should be dismissed.
 */
export default function CartModal({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [visible, setVisible] = useState(false);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      // Small delay so the transition plays
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappNumber = '+2347045036178';
  const message = encodeURIComponent(formatWhatsAppMessage(items, formatPrice));
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[+\s]/g, '')}?text=${message}`;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`relative w-full max-w-[420px] bg-background border-l border-primary/10 h-full flex flex-col transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} strokeWidth={1.6} className="text-primary" />
            <h2 className="text-[13px] font-bold tracking-[0.2em] uppercase">
              Your Cart
              {itemCount > 0 && (
                <span className="ml-2 text-muted font-normal tracking-normal text-[12px]">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors duration-200"
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <ShoppingBag size={48} strokeWidth={1} className="text-primary/20" />
              <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-muted">
                Your cart is empty
              </p>
              <button
                onClick={onClose}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary border border-primary/30 px-5 py-2 hover:bg-primary hover:text-text-dark transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-primary/8">
              {items.map(i => (
                <div key={i.product.id} className="px-6 py-5 flex gap-4 group">
                  {/* Product image */}
                  {i.product.image && (
                    <div className="w-[72px] h-[90px] bg-surface flex-shrink-0 overflow-hidden">
                      <img
                        src={i.product.image}
                        alt={i.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[12px] font-bold tracking-[0.08em] uppercase truncate">
                        {i.product.name}
                      </p>
                      {i.product.selectedSize && (
                        <p className="text-[10px] tracking-[0.15em] text-muted uppercase mt-0.5">
                          Size: {i.product.selectedSize}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-primary/15">
                        <button
                          onClick={() => updateQuantity(i.product.id, i.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary transition-colors duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} strokeWidth={1.8} />
                        </button>
                        <span className="w-7 text-center text-[11px] font-bold tracking-[0.05em]">
                          {i.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(i.product.id, i.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary transition-colors duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} strokeWidth={1.8} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-[13px] font-bold tracking-[0.04em]">
                        {formatPrice(i.product.price * i.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(i.product.id)}
                    className="self-start mt-0.5 text-muted/40 hover:text-red-400 transition-colors duration-200"
                    aria-label={`Remove ${i.product.name}`}
                  >
                    <Trash2 size={14} strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and actions */}
        {items.length > 0 && (
          <div className="border-t border-primary/10 px-6 py-5 flex flex-col gap-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                Subtotal
              </span>
              <span className="text-[18px] font-bold tracking-[0.04em]">
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-primary text-text-dark text-[11px] font-bold tracking-[0.28em] uppercase flex items-center justify-center gap-2 hover:bg-primary/85 transition-colors duration-200"
            >
              Checkout via WhatsApp
            </a>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-red-400 transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

