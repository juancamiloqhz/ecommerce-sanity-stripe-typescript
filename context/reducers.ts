import { Product } from "../@types/types";

export type Actions = ShowCartActions | AddToCartActions | TotalPriceActions | TotalQuantitiesActions | QuantityActions;

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      }
};

export enum StateTypes {
  ToggleCart = 'TOGGLE_CART',
  DeleteFromCart = 'DELETE_ITEM',
  AddToCart = 'ADD_ITEM',
  AddToTotalPrice = 'ADD_TO_TOTAL_PRICE',
  DeleteFromTotalPrice = 'DELETE_FROM_TOTAL_PRICE',
  AddToTotalQuantity = 'ADD_TO_TOTAL_QUANTITY',
  DeleteFromTotalQuantity = 'DELETE_FROM_TOTAL_QUANTITY',
  SetQuantity = 'SET_QUANTITY',
  AddOneToCartItem = 'ADD_ONE_TO_CART_ITEM',
  DeleteOneFromCartItem = 'DELETE_ONE_FROM_CART_ITEM',
}

type ShowCartPayload = {
  [StateTypes.ToggleCart]: boolean;
}

export type ShowCartActions = ActionMap<ShowCartPayload>[keyof ActionMap<ShowCartPayload>];

export const showCartReducer = (state: boolean, action: Actions) => {
  switch (action.type) {
    case StateTypes.ToggleCart:
      return !state;
    default:
      return state;
  }
}

type CartItem = {
  product: Product;
  quantity: number;
}

type CartItemsPayload = {
  [StateTypes.DeleteFromCart]: CartItem;
  [StateTypes.AddToCart] : CartItem;
  [StateTypes.AddOneToCartItem]: CartItem;
  [StateTypes.DeleteOneFromCartItem]: CartItem;
}

export type AddToCartActions = ActionMap<CartItemsPayload>[keyof ActionMap<CartItemsPayload>];

export const cartItemsReducer = (state: CartItem[], action: Actions) => {
  switch (action.type) {
    case StateTypes.AddToCart:
      const checkItemInCart = state.find(cartItem => cartItem.product._id === action.payload.product._id);
      if (checkItemInCart) {
        return [
          ...state.map(cartItem => {
            if (cartItem.product._id === action.payload.product._id) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + action.payload.quantity,
              }
            }
            return cartItem;
          })
        ]
      }
      return [
        ...state,
        {
          ...action.payload,
        }
      ]
    case StateTypes.DeleteFromCart:
      return [
        ...state.filter(cartItem => cartItem.product._id !== action.payload.product._id),
      ]
    case StateTypes.AddOneToCartItem:
      return [
        ...state.map(cartItem => {
          if (cartItem.product._id === action.payload.product._id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          }
          return cartItem;
        }
      )]
    case StateTypes.DeleteOneFromCartItem:
      if (action.payload.quantity > 1) {
        return [
          ...state.map(cartItem => {
            if (cartItem.product._id === action.payload.product._id) {
              return {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              }
            }
            return cartItem;
          }
        )]
      }
      return [
        ...state
      ]
    default:
      return state;
  }
}

type TotalPricePayload = {
  [StateTypes.AddToTotalPrice]: number;
  [StateTypes.DeleteFromTotalPrice]: number;
}

export type TotalPriceActions = ActionMap<TotalPricePayload>[keyof ActionMap<TotalPricePayload>];

export const totalPriceReducer = (state: number, action: Actions) => {
  switch (action.type) {
    case StateTypes.AddToTotalPrice:
      return state + action.payload;
    case StateTypes.DeleteFromTotalPrice:
      return state - action.payload;
    default:
      return state;
  }
}

type TotalQuantitiesPayload = {
  [StateTypes.AddToTotalQuantity]: number;
  [StateTypes.DeleteFromTotalQuantity]: number;
}

export type TotalQuantitiesActions = ActionMap<TotalQuantitiesPayload>[keyof ActionMap<TotalQuantitiesPayload>];
  
export const totalQuantitiesReducer = (state: number, action: Actions) => {
  switch (action.type) {
    case StateTypes.AddToTotalQuantity:
      return state + action.payload;
    case StateTypes.DeleteFromTotalQuantity:
      return state - action.payload;
    default:
      return state;
  }
}

type QuantityPayload = {
  [StateTypes.SetQuantity]: number;
}

export type QuantityActions = ActionMap<QuantityPayload>[keyof ActionMap<QuantityPayload>];

export const quantityReducer = (state: number, action: Actions) => {
  switch (action.type) {
    case StateTypes.SetQuantity:
      if (action.payload < 1) {
        return 1;
      }
      return action.payload;
    default:
      return state;
  }
}