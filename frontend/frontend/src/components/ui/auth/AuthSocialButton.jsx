import Button from "../actions/Button.jsx";

function GoogleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
        >
            <path fill="#4285F4" d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.873h5.382a4.6 4.6 0 0 1-1.996 3.018v2.509h3.232c1.89-1.741 2.982-4.309 2.982-7.355Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.418l-3.232-2.509c-.895.6-2.041.955-3.386.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A9.998 9.998 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.404 13.905A6.019 6.019 0 0 1 6.091 12c0-.659.114-1.3.313-1.905V7.504h-3.34A9.999 9.999 0 0 0 2 12c0 1.614.386 3.141 1.064 4.496l3.34-2.591Z" />
            <path fill="#EA4335" d="M12 5.973c1.468 0 2.786.504 3.823 1.491l2.868-2.868C16.959 2.982 14.695 2 12 2a9.998 9.998 0 0 0-8.936 5.504l3.34 2.591C7.191 7.732 9.395 5.973 12 5.973Z" />
        </svg>
    );
}

function AuthSocialButton({
    provider = "google",
    children,
    loading = false,
    disabled = false,
    ...props
}) {
    const configuration = {
        google: {
            icon: <GoogleIcon />,
            label: "Continuar com Google",
        },
    }[provider] ?? {
        icon: null,
        label: "Continuar",
    };

    return (
        <Button
            variant="outline"
            fullWidth
            leadingIcon={configuration.icon}
            loading={loading}
            loadingText="Conectando..."
            disabled={disabled}
            className="bg-surface"
            {...props}
        >
            {children ?? configuration.label}
        </Button>
    );
}

export default AuthSocialButton;
