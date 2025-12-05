'use client';

import { useCart } from '../context/CartContext';
import AuthPrompt from './AuthPrompt';

export default function AuthPromptWrapper() {
  const { isAuthPromptOpen, closeAuthPrompt } = useCart();

  return <AuthPrompt isOpen={isAuthPromptOpen} onClose={closeAuthPrompt} />;
}
