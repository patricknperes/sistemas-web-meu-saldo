import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useSearchParams,
} from "react-router";

import {
    RiArrowLeftLine,
    RiLockPasswordLine,
    RiRefreshLine,
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
    PasswordField,
    evaluatePassword,
} from "../../components/ui/auth/index.js";

import {
    LoadingState,
    Snackbar,
} from "../../components/ui/feedback/index.js";

import {
    passwordResetService,
} from "../../services/passwordResetService.js";

import {
    createNotification,
    getErrorMessage,
} from "../Auth/authPageUtils.js";

const TOKEN_STATUS = {
    checking: "checking",
    valid: "valid",
    invalid: "invalid",
};

const steps = [
    {
        id: "link",
        label: "Validar link",
    },
    {
        id: "password",
        label: "Criar senha",
    },
    {
        id: "completed",
        label: "Concluir",
    },
];

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
        test: (password) => /[0-9]/.test(password),
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

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = String(searchParams.get("token") ?? "").trim();

    const [tokenStatus, setTokenStatus] = useState(TOKEN_STATUS.checking);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        password: "",
        passwordConfirmation: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [resetCompleted, setResetCompleted] = useState(false);
    const [notification, setNotification] = useState(
        createNotification()
    );

    const passwordEvaluation = useMemo(
        () => evaluatePassword(password, passwordRequirements),
        [password]
    );

    const confirmationTouched = passwordConfirmation.length > 0;
    const passwordsMatch =
        confirmationTouched && password === passwordConfirmation;

    useEffect(() => {
        let active = true;

        async function validateToken() {
            setTokenStatus(TOKEN_STATUS.checking);

            if (!token) {
                if (active) {
                    setTokenStatus(TOKEN_STATUS.invalid);
                }
                return;
            }

            try {
                const result = await passwordResetService.validatePasswordResetToken(token);

                if (active) {
                    setTokenStatus(
                        result.valid ? TOKEN_STATUS.valid : TOKEN_STATUS.invalid
                    );
                }
            } catch {
                if (active) {
                    setTokenStatus(TOKEN_STATUS.invalid);
                }
            }
        }

        validateToken();

        return () => {
            active = false;
        };
    }, [token]);

    function closeNotification() {
        setNotification((current) => ({
            ...current,
            open: false,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (tokenStatus !== TOKEN_STATUS.valid || submitting) {
            return;
        }

        const nextErrors = {
            password: passwordEvaluation.valid
                ? ""
                : "A nova senha ainda não atende a todos os requisitos.",
            passwordConfirmation: passwordsMatch
                ? ""
                : "A confirmação não corresponde à nova senha.",
        };

        setFieldErrors(nextErrors);

        if (Object.values(nextErrors).some(Boolean)) {
            return;
        }

        setSubmitting(true);
        closeNotification();

        try {
            await passwordResetService.resetPassword({
                token,
                password,
                passwordConfirmation,
            });

            setResetCompleted(true);
            setPassword("");
            setPasswordConfirmation("");
        } catch (error) {
            const code = error?.response?.data?.code ?? error?.code;

            setNotification(
                createNotification(
                    "danger",
                    getErrorMessage(
                        error,
                        "Não foi possível redefinir sua senha."
                    )
                )
            );

            if (["INVALID_RESET_TOKEN", "RESET_TOKEN_UNAVAILABLE"].includes(code)) {
                setTokenStatus(TOKEN_STATUS.invalid);
            }
        } finally {
            setSubmitting(false);
        }
    }

    const currentStep = resetCompleted
        ? 2
        : tokenStatus === TOKEN_STATUS.valid
            ? 1
            : 0;

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
                title="Não foi possível redefinir a senha"
                description={notification.description}
            />

            <AuthStepIndicator
                steps={steps}
                currentStep={currentStep}
                className="mb-7"
            />

            {tokenStatus === TOKEN_STATUS.checking ? (
                <LoadingState
                    compact
                    title="Validando seu link"
                    description="Aguarde enquanto verificamos se o link de recuperação ainda está disponível."
                />
            ) : null}

            {tokenStatus === TOKEN_STATUS.invalid ? (
                <AuthStatusState
                    variant="error"
                    title="Link indisponível"
                    description="Este link é inválido, expirou, já foi utilizado ou foi substituído por uma solicitação mais recente."
                    actions={(
                        <>
                            <LinkButton
                                to="/esqueci-senha"
                                variant="primary"
                                leadingIcon={<RiRefreshLine size={17} aria-hidden="true" />}
                            >
                                Solicitar novo link
                            </LinkButton>

                            <LinkButton
                                to="/login"
                                variant="ghost"
                                leadingIcon={<RiArrowLeftLine size={17} aria-hidden="true" />}
                            >
                                Voltar ao login
                            </LinkButton>
                        </>
                    )}
                />
            ) : null}

            {tokenStatus === TOKEN_STATUS.valid && resetCompleted ? (
                <AuthStatusState
                    variant="success"
                    title="Senha atualizada"
                    description="Sua nova senha foi salva. Agora você já pode acessar a conta normalmente."
                    actions={(
                        <LinkButton
                            to="/login"
                            variant="primary"
                            leadingIcon={<RiArrowLeftLine size={17} aria-hidden="true" />}
                        >
                            Acessar minha conta
                        </LinkButton>
                    )}
                />
            ) : null}

            {tokenStatus === TOKEN_STATUS.valid && !resetCompleted ? (
                <>
                    <AuthHeader
                        icon={<RiLockPasswordLine size={19} aria-hidden="true" />}
                        eyebrow="Última etapa"
                        title="Crie uma nova senha"
                        description="Escolha uma combinação segura e diferente das senhas utilizadas anteriormente."
                    />

                    <AuthForm onSubmit={handleSubmit} className="mt-7">
                        <PasswordField
                            name="password"
                            label="Nova senha"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    password: "",
                                    passwordConfirmation: "",
                                }));
                            }}
                            errorMessage={fieldErrors.password}
                            autoComplete="new-password"
                            placeholder="Digite sua nova senha"
                            minLength={8}
                            maxLength={128}
                            disabled={submitting}
                            required
                            showStrength
                            showRequirements
                            requirements={passwordRequirements}
                            requirementColumns={2}
                            autoFocus
                        />

                        <PasswordField
                            name="passwordConfirmation"
                            label="Confirme a nova senha"
                            value={passwordConfirmation}
                            onChange={(event) => {
                                setPasswordConfirmation(event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    passwordConfirmation: "",
                                }));
                            }}
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
                            maxLength={128}
                            disabled={submitting}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            leadingIcon={<RiLockPasswordLine size={18} aria-hidden="true" />}
                            loading={submitting}
                            loadingText="Salvando nova senha..."
                        >
                            Redefinir minha senha
                        </Button>
                    </AuthForm>
                </>
            ) : null}
        </>
    );
}

export default ResetPassword;
