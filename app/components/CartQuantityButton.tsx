'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Define a minimal MenuItem interface that works with both static and DB items
interface MenuItemBase {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

interface CartQuantityButtonProps {
  item: MenuItemBase;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CartQuantityButton({ 
  item, 
  size = 'md',
  className = '' 
}: CartQuantityButtonProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  // Size configurations
  const sizes = {
    sm: { button: 32, expanded: 80, icon: 14 },
    md: { button: 40, expanded: 96, icon: 16 },
    lg: { button: 48, expanded: 112, icon: 20 },
  };

  const currentSize = sizes[size];

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  // If item is not in cart, show simple add button
  if (quantity === 0) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        className={`rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-[#B8420A] transition-colors ${className}`}
        style={{ width: currentSize.button, height: currentSize.button }}
      >
        <Plus style={{ width: currentSize.icon, height: currentSize.icon }} />
      </motion.button>
    );
  }

  // If item is in cart, show quantity with hover expand
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isHovered ? currentSize.expanded : currentSize.button,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      style={{
        height: currentSize.button,
        borderRadius: currentSize.button / 2,
        backgroundColor: '#D94F04',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Minus Button - Always rendered, fades in/out */}
      <motion.button
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.15 }}
        onClick={handleDecrement}
        className="absolute left-0 h-full flex items-center justify-center text-white hover:bg-black/10 transition-colors"
        style={{ width: currentSize.button }}
        disabled={!isHovered}
      >
        <Minus style={{ width: currentSize.icon, height: currentSize.icon }} />
      </motion.button>

      {/* Quantity Display - Always centered */}
      <motion.span
        className="font-semibold text-white pointer-events-none"
        style={{ fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18 }}
      >
        {quantity}
      </motion.span>

      {/* Plus Button - Always rendered, fades in/out */}
      <motion.button
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.15 }}
        onClick={handleIncrement}
        className="absolute right-0 h-full flex items-center justify-center text-white hover:bg-black/10 transition-colors"
        style={{ width: currentSize.button }}
        disabled={!isHovered}
      >
        <Plus style={{ width: currentSize.icon, height: currentSize.icon }} />
      </motion.button>
    </motion.div>
  );
}
