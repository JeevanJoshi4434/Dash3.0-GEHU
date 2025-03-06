type UserType = 'asha' | 'user' | 'admin';

type StocksId = string;

type SALT = number | string;

export interface Location {
  type: string;
  coordinates: number[];
}


type UserValidFields = 'id' | 'name' | 'phone' | 'password' | 'type' | 'location' | 'lastActive' | 'stocks' | 'payments';

interface BaseUser {
  _id: string;
  name: string;
  phone: string;
  password: string;
  type: UserType;
  lastActive: Date;
  location: Location;
  isModified: boolean;
}

// asha user interface
interface asha extends BaseUser {
  type: 'asha';
  stocks: StocksId[]; // Farmers must have stocks
  payments?: never; // Farmers shouldn't have payments
  balance?: never;
}

// user user interface
interface user extends BaseUser {
  type: 'user';
  stocks?: never; // Buyers shouldn't have stocks
  payments: string[]; // Buyers must have payments
  balance: number;
}

// Admin user interface
interface Admin extends BaseUser {
  type: 'admin';
  stocks?: never; // Admins shouldn't have stocks
  payments?: never; // Admins shouldn't have payments
  balance?: never;
}

// Union type for all user types
type IUser = asha | user | Admin;

export { IUser, UserType, StocksId, Location, SALT, UserValidFields };
