import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import AuthNotice from "../../features/auth/components/AuthNotice.jsx";
import AuthPanelHeader from "../../features/auth/components/AuthPanelHeader.jsx";
import { forgotPasswordSchema } from "../../features/auth/schemas/authSchemas.js";
import { passwordResetService } from "../../services/passwordResetService.js";

function getErrorMessage(error) {
    return error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message ?? "Não foi possível enviar o link de recuperação.";
}

function ForgotPassword() {
    const [sentEmail, setSentEmail] = useState("");
    const [notice, setNotice] = useState("");
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values) {
        setNotice("");
        try {
            await passwordResetService.requestPasswordReset(values.email);
            setSentEmail(values.email);
        } catch (error) {
            setNotice(getErrorMessage(error));
        }
    }

    if (sentEmail) {
        return (
            <div className="mx-auto w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[22px] border border-success/20 bg-success-muted text-success"><MailCheck size={28} /></div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-success">Solicitação enviada</p>
                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">Verifique seu e-mail</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Caso exista uma conta vinculada a <strong className="font-semibold text-foreground">{sentEmail}</strong>, você receberá um link para criar uma nova senha.</p>
                <div className="mt-7 rounded-2xl border border-border bg-surface-muted/55 p-4 text-left text-xs leading-5 text-muted-foreground">O link possui validade limitada. Verifique também a caixa de spam e não compartilhe o endereço recebido.</div>
                <div className="mt-7 grid gap-3">
                    <Button asChild size="lg" className="w-full"><Link to="/login">Voltar para o login<ArrowRight size={17} /></Link></Button>
                    <Button variant="ghost" className="w-full" onClick={() => { setSentEmail(""); setNotice(""); reset({ email: sentEmail }); }}>Enviar novamente</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <AuthPanelHeader eyebrow="Recuperação de acesso" title="Esqueceu sua senha?" description="Informe o e-mail cadastrado. Enviaremos as instruções para você recuperar o acesso com segurança." icon={Mail} />
            <AuthNotice type="error">{notice}</AuthNotice>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5" noValidate>
                <Input label="E-mail da conta" type="email" autoComplete="email" placeholder="voce@exemplo.com" leadingIcon={Mail} error={errors.email?.message} disabled={isSubmitting} {...register("email")} />
                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar instruções"}<ArrowRight size={17} /></Button>
            </form>
            <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"><ArrowLeft size={16} />Voltar para o login</Link>
        </div>
    );
}

export default ForgotPassword;
