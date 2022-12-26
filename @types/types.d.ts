export interface Product {
  _id: string;
  _createdAt: date;
  _rev: string;
  _type: string;
  _updatedAt: date;
  description: string;
  image: {
    _type: string;
    _key: string;
    asset: {
      _ref: string;
      _type: string;
    }
  }[]
  name: string;
  price: number;
  slug: {
    _type: string;
    current: string;
  }
}


export interface Banner {
  _id: string;
  _createdAt: date;
  _rev: string;
  _type: string;
  _updatedAt: date;
  buttonText: string;
  desc: string;
  discount: string;
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    }
  }
  largeText1: string;
  largeText2: string;
  middleText: string;
  product: string;
  saleTime: string;
  smallText: string;
}