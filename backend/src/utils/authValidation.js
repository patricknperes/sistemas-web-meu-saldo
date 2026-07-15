const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

export function normalizeEmail(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);

  if (!email) {
    return false;
  }

  return EMAIL_PATTERN.test(email);
}

export function getPasswordValidationErrors(
  password,
  fieldLabel = "A senha"
) {
  const errors = [];

  if (
    typeof password !== "string" ||
    password.length === 0
  ) {
    return [`${fieldLabel} é obrigatória.`];
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `${fieldLabel} deve possuir pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push(
      `${fieldLabel} deve possuir pelo menos uma letra minúscula.`
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(
      `${fieldLabel} deve possuir pelo menos uma letra maiúscula.`
    );
  }

  if (!/\d/.test(password)) {
    errors.push(
      `${fieldLabel} deve possuir pelo menos um número.`
    );
  }

  if (!/[^A-Za-z0-9\s]/.test(password)) {
    errors.push(
      `${fieldLabel} deve possuir pelo menos um caractere especial.`
    );
  }

  if (
    Buffer.byteLength(password, "utf8") >
    PASSWORD_MAX_BYTES
  ) {
    errors.push(
      `${fieldLabel} deve possuir no máximo ${PASSWORD_MAX_BYTES} bytes.`
    );
  }

  return errors;
}

export function isStrongPassword(password) {
  return (
    getPasswordValidationErrors(password).length === 0
  );
}

export const passwordRequirements = Object.freeze({
  minimumLength: PASSWORD_MIN_LENGTH,
  maximumBytes: PASSWORD_MAX_BYTES,
  requiresLowercase: true,
  requiresUppercase: true,
  requiresNumber: true,
  requiresSpecialCharacter: true,
});