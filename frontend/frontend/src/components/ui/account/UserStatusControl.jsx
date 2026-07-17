import Switch from "../forms/Switch.jsx";
import Alert from "../feedback/Alert.jsx";

import UserStatusBadge from "./UserStatusBadge.jsx";
import {
    getUserStatusMeta,
    normalizeUserStatus,
} from "./accountUtils.js";

function UserStatusControl({
    status = "ACTIVE",
    onChange,
    disabled = false,
    ownAccount = false,
    className = "",
}) {
    const normalizedStatus = normalizeUserStatus(status);
    const active = normalizedStatus === "ACTIVE";
    const meta = getUserStatusMeta(normalizedStatus);

    return (
        <div className={`grid gap-3 ${className}`}>
            <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-border bg-surface-subtle p-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-body-sm font-bold text-foreground">
                            Acesso ao sistema
                        </p>
                        <UserStatusBadge status={normalizedStatus} size="sm" />
                    </div>

                    <p className="mt-1 text-caption text-muted-foreground">
                        {meta.description}
                    </p>
                </div>

                <Switch
                    checked={active}
                    disabled={disabled || ownAccount}
                    aria-label={active ? "Desativar acesso" : "Ativar acesso"}
                    onCheckedChange={(checked) => onChange?.(checked ? "ACTIVE" : "INACTIVE")}
                />
            </div>

            {ownAccount ? (
                <Alert variant="info" title="Conta atual">
                    Um administrador não pode desativar a própria conta durante a sessão.
                </Alert>
            ) : null}
        </div>
    );
}

export default UserStatusControl;
