import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import AuthNotice from "../../features/auth/components/AuthNotice.jsx";
import AuthPanelHeader from "../../features/auth/components/AuthPanelHeader.jsx";
import PasswordInput from "../../features/auth/components/PasswordInput.jsx";
import { loginSchema } from "../../features/auth/schemas/authSchemas.js";
import { useAuth } from "../../hooks/useAuth.js";

function getErrorMessage(error) {
    return error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message ?? "Não foi possível acessar sua conta.";
}

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, authenticateWithGoogle } = useAuth();
    const [notice, setNotice] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const redirectAfterLogin = () => navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });

    async function onSubmit(values) {
        setNotice("");
        try {
            await login(values);
            redirectAfterLogin();
        } catch (error) {
            setNotice(getErrorMessage(error));
        }
    }

    async function handleGoogleCredential(credential) {
        setGoogleLoading(true);
        setNotice("");
        try {
            await authenticateWithGoogle(credential);
            redirectAfterLogin();
        } catch (error) {
            setNotice(getErrorMessage(error));
        } finally {
            setGoogleLoading(false);
        }
    }

    const busy = isSubmitting || googleLoading;

    return (
        <div className="mx-auto w-full max-w-md">
            <AuthPanelHeader eyebrow="Bem-vindo de volta" title="Acesse sua conta" description="Entre para acompanhar seu saldo, suas movimentações e tudo o que importa nas suas finanças." icon={LogIn} />

            <div className="space-y-5">
                <GoogleAuthButton onCredential={handleGoogleCredential} onError={(error) => setNotice(getErrorMessage(error))} disabled={busy} text="signin_with" />

                <div className="flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">ou use seu e-mail</span><span className="h-px flex-1 bg-border" /></div>

                <AuthNotice type="error">{notice}</AuthNotice>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <Input label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" leadingIcon={Mail} error={errors.email?.message} disabled={busy} {...register("email")} />
                    <div>
                        <PasswordInput label="Senha" autoComplete="current-password" placeholder="Digite sua senha" error={errors.password?.message} disabled={busy} {...register("password")} />
                        <div className="mt-2 flex justify-end"><Link to="/esqueci-senha" className="text-xs font-semibold text-primary transition hover:text-primary-hover">Esqueci minha senha</Link></div>
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2" disabled={busy}>
                        {isSubmitting ? "Entrando..." : "Entrar"}<ArrowRight size={17} aria-hidden="true" />
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">Ainda não possui uma conta? <Link to="/cadastro" className="font-semibold text-primary hover:text-primary-hover">Criar conta</Link></p>
            </div>
        </div>
    );
}

export default Login;
