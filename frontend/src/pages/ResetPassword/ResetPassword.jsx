import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Link2Off, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import Button from "../../components/ui/Button.jsx";
import AuthNotice from "../../features/auth/components/AuthNotice.jsx";
import AuthPanelHeader from "../../features/auth/components/AuthPanelHeader.jsx";
import PasswordInput from "../../features/auth/components/PasswordInput.jsx";
import PasswordStrength from "../../features/auth/components/PasswordStrength.jsx";
import { resetPasswordSchema } from "../../features/auth/schemas/authSchemas.js";
import { passwordResetService } from "../../services/passwordResetService.js";

function getErrorMessage(error) {
    return error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message ?? "Não foi possível redefinir sua senha.";
}

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);
    const [tokenStatus, setTokenStatus] = useState("validating");
    const [notice, setNotice] = useState("");
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", passwordConfirmation: "" },
    });
    const password = watch("password");

    useEffect(() => {
        let active = true;
        async function validateToken() {
            if (!token) {
                setTokenStatus("invalid");
                return;
            }
            try {
                const response = await passwordResetService.validatePasswordResetToken(token);
                if (active) setTokenStatus(response.valid ? "valid" : "invalid");
            } catch {
                if (active) setTokenStatus("invalid");
            }
        }
        validateToken();
        return () => { active = false; };
    }, [token]);

    async function onSubmit(values) {
        setNotice("");
        try {
            await passwordResetService.resetPassword({ token, ...values });
            setSuccess(true);
        } catch (error) {
            setNotice(getErrorMessage(error));
        }
    }

    if (tokenStatus === "validating") {
        return <div className="mx-auto flex min-h-80 max-w-md flex-col items-center justify-center text-center"><LoaderCircle size={30} className="animate-spin text-primary" /><h1 className="mt-5 text-xl font-semibold text-foreground">Validando seu link</h1><p className="mt-2 text-sm text-muted-foreground">Isso levará apenas alguns instantes.</p></div>;
    }

    if (tokenStatus === "invalid") {
        return (
            <div className="mx-auto w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[22px] border border-danger/20 bg-danger-muted text-danger"><Link2Off size={28} /></div>
                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">Link inválido ou expirado</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Por segurança, os links de recuperação possuem validade limitada. Solicite um novo para continuar.</p>
                <Button asChild size="lg" className="mt-7 w-full"><Link to="/esqueci-senha">Solicitar novo link<ArrowRight size={17} /></Link></Button>
                <Link to="/login" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft size={16} />Voltar para o login</Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="mx-auto w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[22px] border border-success/20 bg-success-muted text-success"><CheckCircle2 size={29} /></div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-success">Senha atualizada</p>
                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">Tudo pronto</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Sua nova senha foi salva. Agora você já pode acessar sua conta normalmente.</p>
                <Button asChild size="lg" className="mt-7 w-full"><Link to="/login">Acessar minha conta<ArrowRight size={17} /></Link></Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <AuthPanelHeader eyebrow="Nova credencial" title="Crie uma nova senha" description="Escolha uma senha forte e diferente das que você utiliza em outros serviços." icon={KeyRound} />
            <AuthNotice type="error">{notice}</AuthNotice>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
                <PasswordInput label="Nova senha" autoComplete="new-password" placeholder="Digite sua nova senha" error={errors.password?.message} disabled={isSubmitting} {...register("password")} />
                <PasswordStrength value={password} />
                <PasswordInput label="Confirmar nova senha" autoComplete="new-password" placeholder="Digite novamente" error={errors.passwordConfirmation?.message} disabled={isSubmitting} {...register("passwordConfirmation")} />
                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar nova senha"}<ArrowRight size={17} /></Button>
            </form>
        </div>
    );
}

export default ResetPassword;
