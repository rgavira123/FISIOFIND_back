// src/context/appointmentContext.tsx
"use client";
import React, { createContext, useReducer, useContext } from "react";
import { AppointmentData } from "@/lib/definitions";

type State = {
  appointmentData: AppointmentData;
};

type Action =
  | { type: "SELECT_SERVICE"; payload: { serviceId: string; serviceTitle: string; price: number; duration: number } }
  | { type: "DESELECT_SERVICE" }
  | { type: "SELECT_PAYMENT_METHOD"; payload: string };

const initialState: State = {
  appointmentData: {
    serviceId: null,
    serviceTitle: "",
    price: 0,
    duration: 0,
    paymentMethod: null,
  },
};

const AppointmentContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SELECT_SERVICE":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          serviceId: action.payload.serviceId,
          serviceTitle: action.payload.serviceTitle,
          price: action.payload.price,
          duration: action.payload.duration,
        },
      };
    case "DESELECT_SERVICE":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          serviceId: null,
          serviceTitle: "",
          price: 0,
          duration: 0,
        },
      };
    case "SELECT_PAYMENT_METHOD":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};
