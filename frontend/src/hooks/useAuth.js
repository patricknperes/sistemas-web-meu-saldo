import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext.js";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth precisa ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}