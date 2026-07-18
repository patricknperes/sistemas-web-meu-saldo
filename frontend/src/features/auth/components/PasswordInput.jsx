import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Input from "../../../components/ui/Input.jsx";
import IconButton from "../../../components/ui/IconButton.jsx";

function PasswordInput({ label, ...props }) {
    const [visible, setVisible] = useState(false);
    return (
        <Input
            {...props}
            label={label}
            type={visible ? "text" : "password"}
            leadingIcon={LockKeyhole}
            trailingElement={
                <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setVisible((current) => !current)}
                    className="-mr-1 text-subtle-foreground"
                >
                    {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                </IconButton>
            }
        />
    );
}

export default PasswordInput;
