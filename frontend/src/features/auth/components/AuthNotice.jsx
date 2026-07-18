import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const config = {
    error: { icon: AlertCircle, classes: "border-danger/20 bg-danger-muted text-danger" },
    success: { icon: CheckCircle2, classes: "border-success/20 bg-success-muted text-success" },
    info: { icon: Info, classes: "border-info/20 bg-info-muted text-info" },
};

function AuthNotice({ type = "info", children }) {
    if (!children) return null;
    const { icon: Icon, classes } = config[type] ?? config.info;
    return (
        <div role={type === "error" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-sm leading-5 ${classes}`}>
            <Icon size={17} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}

export default AuthNotice;
