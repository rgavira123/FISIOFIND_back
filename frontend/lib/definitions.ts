export type CalendarProps = {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
};

export interface Step {
  step: number;
  label: string;
}

export interface Service {
  id: string;
  title: string;
  price: number;
  description: string;
  duration: string;
}

export interface AppointmentData {
  serviceId: string | null;
  serviceTitle: string;
  price: number;
  duration: number;
  paymentMethod: string | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
}
