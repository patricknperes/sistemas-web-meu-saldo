import {
    useState,
} from "react";

import {
    Link,
} from "react-router";

import {
    RiArrowLeftLine,
    RiLockPasswordLine,
    RiMailLine,
    RiSendPlaneLine,
} from "react-icons/ri";

import {
    Button,
    LinkButton,
} from "../../components/ui/actions/index.js";

import {
    AuthForm,
    AuthHeader,
    AuthStatusState,
    AuthStepIndicator,
} from "../../components/ui/auth/index.js";

import {
    Snackbar,
} from "../../components/ui/feedback/index.js";

import {
    FormField,
    Input,
} from "../../components/ui/forms/index.js";

import {
    passwordResetService,
} from "../../services/passwordResetService.js";

import {
    createNotification,
    getErrorMessage,
    validateEmail,
} from "../Auth/authPageUtils.js";

const steps = [
    {
        id: "email",
        label: "Informar e-mail",
    },
    {
        id: "link",
        label: "Abrir o link",
    },
    {
        id: "password",
        label: "Nova senha",
    },
];

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [requestCompleted, setRequestCompleted] = useState(false);
    const [fieldError, setFieldError] = useState("");
    const [notification, setNotification] = useState(
        createNotification()
    );

    function closeNotification() {
        setNotification((current) => ({
            ...current,
            open: false,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validation = validateEmail(email);
        setFieldError(validation.error);

        if (validation.error) {
            return;
        }

        setSubmitting(true);
        closeNotification();

        try {
            await passwordResetService.requestPasswordReset(validation.value);
            setSubmittedEmail(validation.value);
            setRequestCompleted(true);
        } catch (error) {
            setNotification(
                createNotification(
                    "danger",
                    getErrorMessage(
                        error,
                        "Não foi possível enviar as instruções de recuperação."
                    )
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    function handleTryAnotherEmail() {
        setRequestCompleted(false);
        setSubmittedEmail("");
        setEmail("");
        setFieldError("");
        closeNotification();
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
                title="Não foi possível enviar o link"
                description={notification.description}
            />

            <AuthStepIndicator
                steps={steps}
                currentStep={requestCompleted ? 1 : 0}
                className="mb-7"
            />

            {requestCompleted ? (
                <AuthStatusState
                    variant="email"
                    title="Verifique seu e-mail"
                    description="Caso exista uma conta vinculada ao endereço informado, enviaremos um link temporário para redefinir sua senha."
                    detail={submittedEmail}
                    actions={(
                        <>
                            <Button
                                variant="secondary"
                                onClick={handleTryAnotherEmail}
                            >
                                Usar outro e-mail
                            </Button>

                            <LinkButton
                                to="/login"
                                variant="primary"
                                leadingIcon={<RiArrowLeftLine size={17} aria-hidden="true" />}
                            >
                                Voltar ao login
                            </LinkButton>
                        </>
                    )}
                />
            ) : (
                <>
                    <AuthHeader
                        icon={<RiLockPasswordLine size={19} aria-hidden="true" />}
                        eyebrow="Recupere seu acesso"
                        title="Esqueceu sua senha?"
                        description="Informe o e-mail usado na conta. O link enviado será válido por 30 minutos e poderá ser utilizado apenas uma vez."
                    />

                    <AuthForm onSubmit={handleSubmit} className="mt-7">
                        <FormField
                            label="Endereço de e-mail"
                            helperText="Use o mesmo endereço cadastrado na sua conta."
                            errorMessage={fieldError}
                            required
                        >
                            <Input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setFieldError("");
                                }}
                                leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                                autoComplete="email"
                                inputMode="email"
                                placeholder="nome@exemplo.com"
                                disabled={submitting}
                                autoFocus
                            />
                        </FormField>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            leadingIcon={<RiSendPlaneLine size={18} aria-hidden="true" />}
                            loading={submitting}
                            loadingText="Enviando instruções..."
                        >
                            Enviar link de recuperação
                        </Button>
                    </AuthForm>

                    <p className="mt-6 text-center text-caption text-muted-foreground">
                        Lembrou sua senha?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-primary hover:text-primary-hover"
                        >
                            Voltar ao login
                        </Link>
                    </p>
                </>
            )}
        </>
    );
}

export default ForgotPassword;
