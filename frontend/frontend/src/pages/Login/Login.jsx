import {
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router";

import {
    RiLoginBoxLine,
    RiMailLine,
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

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        login,
        authenticateWithGoogle,
    } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });

    const [notification, setNotification] = useState(
        createNotification()
    );

    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const busy = submitting || googleSubmitting;

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
        }));
    }

    function navigateAfterAuthentication() {
        const previousPage = location.state?.from?.pathname ?? "/dashboard";

        navigate(previousPage, {
            replace: true,
        });
    }

    async function handleGoogleLogin(credential) {
        if (busy) {
            return;
        }

        setGoogleSubmitting(true);
        closeNotification();

        try {
            await authenticateWithGoogle(credential);
            navigateAfterAuthentication();
        } catch (error) {
            showError(
                getErrorMessage(
                    error,
                    "Não foi possível acessar sua conta com o Google."
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

        const emailValidation = validateEmail(formData.email);
        const nextErrors = {
            email: emailValidation.error,
            password:
                formData.password.length >= 8
                    ? ""
                    : "A senha deve possuir pelo menos 8 caracteres.",
        };

        setFieldErrors(nextErrors);

        if (nextErrors.email || nextErrors.password) {
            return;
        }

        setSubmitting(true);
        closeNotification();

        try {
            await login({
                email: emailValidation.value,
                password: formData.password,
            });

            navigateAfterAuthentication();
        } catch (error) {
            showError(
                getErrorMessage(
                    error,
                    "Não foi possível acessar sua conta."
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
                title="Não foi possível entrar"
                description={notification.description}
            />

            <AuthHeader
                icon={<RiLoginBoxLine size={19} aria-hidden="true" />}
                eyebrow="Bem-vindo de volta"
                title="Acesse sua conta"
                description="Entre para acompanhar seu saldo, suas movimentações e os próximos compromissos financeiros."
            />

            <div className="mt-7" aria-busy={googleSubmitting}>
                <GoogleAuthButton
                    onCredential={handleGoogleLogin}
                    onError={handleGoogleError}
                    disabled={busy}
                    text="signin_with"
                />

                {googleSubmitting ? (
                    <p className="mt-2 text-center text-caption font-semibold text-muted-foreground" aria-live="polite">
                        Autenticando com o Google...
                    </p>
                ) : null}
            </div>

            <AuthDivider label="ou entre com seu e-mail" className="my-6" />

            <AuthForm onSubmit={handleSubmit}>
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
                        autoFocus
                    />
                </FormField>

                <PasswordField
                    name="password"
                    label="Senha de acesso"
                    value={formData.password}
                    onChange={handleChange}
                    errorMessage={fieldErrors.password}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    minLength={8}
                    maxLength={128}
                    disabled={busy}
                    required
                />

                <div className="-mt-2 flex justify-end">
                    <Link
                        to="/esqueci-senha"
                        className="rounded-md px-1.5 py-1 text-caption font-bold text-primary outline-none transition-colors hover:bg-primary-muted hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring/25"
                    >
                        Esqueci minha senha
                    </Link>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    leadingIcon={<RiLoginBoxLine size={18} aria-hidden="true" />}
                    loading={submitting}
                    loadingText="Acessando sua conta..."
                    disabled={googleSubmitting}
                >
                    Entrar na conta
                </Button>
            </AuthForm>

            <p className="mt-6 text-center text-caption text-muted-foreground">
                Ainda não possui uma conta?{" "}
                <Link
                    to="/cadastro"
                    className="font-bold text-primary hover:text-primary-hover"
                >
                    Crie sua conta gratuitamente
                </Link>
            </p>
        </>
    );
}

export default Login;
