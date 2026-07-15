import {
  authenticateWithGoogle,
  loginUser,
  registerUser,
} from "../services/authService.js";

export async function register(req, res) {
  const result = await registerUser(req.body);

  return res.status(201).json({
    message: "Usuário cadastrado com sucesso.",
    ...result,
  });
}

export async function login(req, res) {
  const result = await loginUser(req.body);

  return res.status(200).json({
    message: "Login realizado com sucesso.",
    ...result,
  });
}

export async function googleAuth(req, res) {
  const result = await authenticateWithGoogle(
    req.body
  );

  const message = result.isNewUser
    ? "Conta criada com o Google com sucesso."
    : "Login com Google realizado com sucesso.";

  return res.status(
    result.isNewUser ? 201 : 200
  ).json({
    message,
    ...result,
  });
}

export async function me(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}