import React from 'react';
import { Product } from '../@types/types';
import { 
  cartItemsReducer,
  showCartReducer,
  totalPriceReducer,
  totalQuantitiesReducer,
  quantityReducer,
  Actions
} from './reducers';

type CartItem = {
  product: Product;
  quantity: number;
}

type InitialStateType = {
  showCart: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantities: number;
  quantity: number;
}

export type StateContextType = {
  state: InitialStateType;
  dispatch: React.Dispatch<Actions>;
};

const initialState = {
  showCart: false,
  cartItems: [],
  totalPrice: 0,
  totalQuantities: 0,
  quantity: 1,
}

const AppContext = React.createContext<StateContextType>({ state: initialState, dispatch: () => null });

export const useAppContext = () => React.useContext(AppContext);

const mainReducer = ({ showCart, cartItems, totalPrice, totalQuantities, quantity }: InitialStateType, action: Actions) => ({
  showCart: showCartReducer(showCart, action),
  cartItems: cartItemsReducer(cartItems, action),
  totalPrice: totalPriceReducer(totalPrice, action),
  totalQuantities: totalQuantitiesReducer(totalQuantities, action),
  quantity: quantityReducer(quantity, action),
});

const AppProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(mainReducer, initialState);
  React.useEffect(() => {
    console.log('state', state);
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };