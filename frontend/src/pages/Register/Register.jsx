import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Mail,
    UserPlus,
    UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Link,
    useNavigate,
} from "react-router";

import GoogleAuthButton from "../../components/auth/GoogleAuthButton.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import AuthNotice from "../../features/auth/components/AuthNotice.jsx";
import AuthPanelHeader from "../../features/auth/components/AuthPanelHeader.jsx";
import PasswordInput from "../../features/auth/components/PasswordInput.jsx";
import { registerSchema } from "../../features/auth/schemas/authSchemas.js";
import { useAuth } from "../../hooks/useAuth.js";

function getErrorMessage(error) {
    return error?.response?.data?.error
        ?? error?.response?.data?.message
        ?? error?.message
        ?? "Não foi possível criar sua conta.";
}

function Register() {
    const navigate = useNavigate();

    const {
        register: createAccount,
        authenticateWithGoogle,
    } = useAuth();

    const [notice, setNotice] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    async function onSubmit(values) {
        setNotice("");

        try {
            await createAccount(values);

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setNotice(getErrorMessage(error));
        }
    }

    async function handleGoogleCredential(credential) {
        setGoogleLoading(true);
        setNotice("");

        try {
            await authenticateWithGoogle(credential);

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setNotice(getErrorMessage(error));
        } finally {
            setGoogleLoading(false);
        }
    }

    const busy = isSubmitting || googleLoading;

    return (
        <div className="mx-auto w-full max-w-md">
            <AuthPanelHeader
                eyebrow="Comece agora"
                title="Crie sua conta"
                description="Organize suas finanças em poucos minutos. Você poderá ajustar seus dados e preferências depois."
                icon={UserPlus}
            />

            <div className="space-y-5">
                <GoogleAuthButton
                    onCredential={handleGoogleCredential}
                    onError={(error) => {
                        setNotice(getErrorMessage(error));
                    }}
                    disabled={busy}
                    text="signup_with"
                />

                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />

                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
                        ou cadastre-se
                    </span>

                    <span className="h-px flex-1 bg-border" />
                </div>

                <AuthNotice type="error">
                    {notice}
                </AuthNotice>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <Input
                        label="Nome completo"
                        autoComplete="name"
                        placeholder="Como podemos chamar você?"
                        leadingIcon={UserRound}
                        error={errors.name?.message}
                        disabled={busy}
                        {...register("name")}
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        autoComplete="email"
                        placeholder="voce@exemplo.com"
                        leadingIcon={Mail}
                        error={errors.email?.message}
                        disabled={busy}
                        {...register("email")}
                    />

                    <PasswordInput
                        label="Senha"
                        autoComplete="new-password"
                        placeholder="Crie uma senha segura"
                        showStrengthPopover
                        error={errors.password?.message}
                        disabled={busy}
                        {...register("password")}
                    />

                    <PasswordInput
                        label="Confirmar senha"
                        autoComplete="new-password"
                        placeholder="Digite a senha novamente"
                        error={errors.passwordConfirmation?.message}
                        disabled={busy}
                        {...register("passwordConfirmation")}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={busy}
                    >
                        {isSubmitting
                            ? "Criando conta..."
                            : "Criar minha conta"}

                        <ArrowRight
                            aria-hidden="true"
                            className="size-[17px]"
                        />
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Já possui uma conta?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-primary hover:text-primary-hover"
                    >
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;