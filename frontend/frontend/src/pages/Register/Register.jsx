import {
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router";

import {
    RiMailLine,
    RiUser3Line,
    RiUserAddLine,
} from "react-icons/ri";

import GoogleAuthButton from "../../components/auth/GoogleAuthButton.jsx";

import {
    Button,
} from "../../components/ui/actions/index.js";

import {
    AuthDivider,
    AuthForm,
    AuthHeader,
    PasswordField,
    evaluatePassword,
} from "../../components/ui/auth/index.js";

import {
    Snackbar,
} from "../../components/ui/feedback/index.js";

import {
    FormField,
    Input,
} from "../../components/ui/forms/index.js";

import {
    useAuth,
} from "../../hooks/useAuth.js";

import {
    createNotification,
    getErrorMessage,
    validateEmail,
} from "../Auth/authPageUtils.js";

const passwordRequirements = [
    {
        id: "length",
        label: "Pelo menos 8 caracteres",
        test: (password) => password.length >= 8,
    },
    {
        id: "lowercase",
        label: "Uma letra minúscula",
        test: (password) => /[a-z]/.test(password),
    },
    {
        id: "uppercase",
        label: "Uma letra maiúscula",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        id: "number",
        label: "Pelo menos um número",
        test: (password) => /\d/.test(password),
    },
    {
        id: "special",
        label: "Um caractere especial",
        test: (password) => /[^A-Za-z0-9\s]/.test(password),
    },
    {
        id: "no-spaces",
        label: "Sem espaços",
        test: (password) => password.length > 0 && !/\s/.test(password),
    },
];

function Register() {
    const navigate = useNavigate();

    const {
        register,
        authenticateWithGoogle,
    } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const [notification, setNotification] = useState(
        createNotification()
    );

    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const busy = submitting || googleSubmitting;

    const passwordEvaluation = useMemo(
        () => evaluatePassword(formData.password, passwordRequirements),
        [formData.password]
    );

    const confirmationTouched = formData.passwordConfirmation.length > 0;
    const passwordsMatch =
        confirmationTouched &&
        formData.password === formData.passwordConfirmation;

    function closeNotification() {
        setNotification((current) => ({
            ...current,
            open: false,
        }));
    }

    function showError(message) {
        setNotification(createNotification("danger", message));
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setFieldErrors((current) => ({
            ...current,
            [name]: "",
            ...(name === "password"
                ? { passwordConfirmation: "" }
                : {}),
        }));
    }

    async function handleGoogleRegister(credential) {
        if (busy) {
            return;
        }

        setGoogleSubmitting(true);
        closeNotification();

        try {
            await authenticateWithGoogle(credential);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            showError(
                getErrorMessage(
                    error,
                    "Não foi possível criar sua conta com o Google."
                )
            );
        } finally {
            setGoogleSubmitting(false);
        }
    }

    function handleGoogleError(error) {
        showError(
            getErrorMessage(
                error,
                "Não foi possível carregar a autenticação do Google."
            )
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (busy) {
            return;
        }

        const name = formData.name.trim();
        const emailValidation = validateEmail(formData.email);

        const nextErrors = {
            name:
                name.length < 2
                    ? "Informe um nome com pelo menos 2 caracteres."
                    : name.length > 100
                        ? "O nome deve possuir no máximo 100 caracteres."
                        : "",
            email: emailValidation.error,
            password: passwordEvaluation.valid
                ? ""
                : "A senha ainda não atende a todos os requisitos de segurança.",
            passwordConfirmation: passwordsMatch
                ? ""
                : "A confirmação não corresponde à senha criada.",
        };

        setFieldErrors(nextErrors);

        if (Object.values(nextErrors).some(Boolean)) {
            return;
        }

        setSubmitting(true);
        closeNotification();

        try {
            await register({
                name,
                email: emailValidation.value,
                password: formData.password,
            });

            navigate("/dashboard", { replace: true });
        } catch (error) {
            showError(
                getErrorMessage(
                    error,
                    "Não foi possível criar sua conta."
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Snackbar
                open={notification.open}
                onOpenChange={(open) => {
                    if (!open) {
                        closeNotification();
                    }
                }}
                variant={notification.variant}
                title="Não foi possível criar a conta"
                description={notification.description}
            />

            <AuthHeader
                icon={<RiUserAddLine size={19} aria-hidden="true" />}
                eyebrow="Seu espaço financeiro"
                title="Crie sua conta"
                description="Use o Google ou preencha seus dados para começar a organizar sua vida financeira."
            />

            <div className="mt-7" aria-busy={googleSubmitting}>
                <GoogleAuthButton
                    onCredential={handleGoogleRegister}
                    onError={handleGoogleError}
                    disabled={busy}
                    text="signup_with"
                />

                {googleSubmitting ? (
                    <p className="mt-2 text-center text-caption font-semibold text-muted-foreground" aria-live="polite">
                        Criando sua conta com o Google...
                    </p>
                ) : null}
            </div>

            <AuthDivider label="ou cadastre-se com seu e-mail" className="my-6" />

            <AuthForm onSubmit={handleSubmit} spacing="relaxed">
                <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                    <FormField
                        label="Nome completo"
                        errorMessage={fieldErrors.name}
                        required
                    >
                        <Input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            leadingIcon={<RiUser3Line size={18} aria-hidden="true" />}
                            autoComplete="name"
                            placeholder="Digite seu nome"
                            minLength={2}
                            maxLength={100}
                            disabled={busy}
                            autoFocus
                        />
                    </FormField>

                    <FormField
                        label="Endereço de e-mail"
                        errorMessage={fieldErrors.email}
                        required
                    >
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                            autoComplete="email"
                            inputMode="email"
                            placeholder="nome@exemplo.com"
                            disabled={busy}
                        />
                    </FormField>
                </div>

                <PasswordField
                    name="password"
                    label="Crie uma senha"
                    value={formData.password}
                    onChange={handleChange}
                    errorMessage={fieldErrors.password}
                    autoComplete="new-password"
                    placeholder="Crie uma senha segura"
                    minLength={8}
                    maxLength={72}
                    disabled={busy}
                    required
                    showStrength
                    showRequirements
                    requirements={passwordRequirements}
                    requirementColumns={2}
                />

                <PasswordField
                    name="passwordConfirmation"
                    label="Confirme sua senha"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    errorMessage={
                        fieldErrors.passwordConfirmation ||
                        (confirmationTouched && !passwordsMatch
                            ? "As senhas ainda não correspondem."
                            : "")
                    }
                    successMessage={
                        passwordsMatch ? "As senhas correspondem." : ""
                    }
                    autoComplete="new-password"
                    placeholder="Digite a senha novamente"
                    minLength={8}
                    maxLength={72}
                    disabled={busy}
                    required
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    leadingIcon={<RiUserAddLine size={18} aria-hidden="true" />}
                    loading={submitting}
                    loadingText="Criando sua conta..."
                    disabled={googleSubmitting}
                >
                    Criar minha conta
                </Button>
            </AuthForm>

            <p className="mt-6 text-center text-caption text-muted-foreground">
                Já possui uma conta?{" "}
                <Link
                    to="/login"
                    className="font-bold text-primary hover:text-primary-hover"
                >
                    Acesse agora
                </Link>
            </p>
        </>
    );
}

export default Register;
