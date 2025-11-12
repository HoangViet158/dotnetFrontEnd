export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CustomerResponse {
  customerId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createAt: string;
}
