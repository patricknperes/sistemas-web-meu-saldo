import {
  OAuth2Client,
} from "google-auth-library";

import {
  env,
} from "../config/env.js";

export const googleAuthClient =
  new OAuth2Client(
    env.googleClientId
  );

export async function verifyGoogleCredential(
  credential
) {
  if (
    typeof credential !== "string" ||
    !credential.trim()
  ) {
    throw new Error(
      "A credencial do Google não foi informada."
    );
  }

  const ticket =
    await googleAuthClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error(
      "Não foi possível obter os dados da conta Google."
    );
  }

  return payload;
}