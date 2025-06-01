import { useContext } from 'react';
import CartContext from './CartContext';

export function useCartContext() {
	const cartContext = useContext(CartContext);
	if (!cartContext) {
		throw new Error('useCartContext nên được sử dụng trong một component con của CartContext.Provider');
	}
	return cartContext;
}
