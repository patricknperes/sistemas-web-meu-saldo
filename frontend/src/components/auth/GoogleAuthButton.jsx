import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    RiErrorWarningLine,
    RiLoader4Line,
} from "react-icons/ri";

const GOOGLE_SCRIPT_URL =
    "https://accounts.google.com/gsi/client";

let googleLibraryPromise = null;
let initializedClientId = null;
let activeCredentialHandler = null;

function getGoogleIdentityApi() {
    return (
        window.google?.accounts?.id ??
        null
    );
}

function waitForGoogleIdentityApi() {
    const existingApi =
        getGoogleIdentityApi();

    if (existingApi) {
        return Promise.resolve(
            existingApi
        );
    }

    if (googleLibraryPromise) {
        return googleLibraryPromise;
    }

    googleLibraryPromise =
        new Promise(
            (
                resolve,
                reject,
            ) => {
                let finished = false;

                const finish = (
                    callback,
                    value,
                ) => {
                    if (finished) {
                        return;
                    }

                    finished = true;

                    window.clearInterval(
                        verificationInterval,
                    );

                    window.clearTimeout(
                        timeout,
                    );

                    callback(value);
                };

                const verifyLibrary =
                    () => {
                        const googleApi =
                            getGoogleIdentityApi();

                        if (googleApi) {
                            finish(
                                resolve,
                                googleApi,
                            );
                        }
                    };

                let script =
                    document.querySelector(
                        `script[src^="${GOOGLE_SCRIPT_URL}"]`,
                    );

                if (!script) {
                    script =
                        document.createElement(
                            "script",
                        );

                    script.src =
                        GOOGLE_SCRIPT_URL;

                    script.async = true;
                    script.defer = true;

                    document.head.appendChild(
                        script,
                    );
                }

                script.addEventListener(
                    "load",
                    verifyLibrary,
                    {
                        once: true,
                    },
                );

                script.addEventListener(
                    "error",
                    () => {
                        finish(
                            reject,
                            new Error(
                                "Não foi possível carregar o Google Identity Services.",
                            ),
                        );
                    },
                    {
                        once: true,
                    },
                );

                const verificationInterval =
                    window.setInterval(
                        verifyLibrary,
                        100,
                    );

                const timeout =
                    window.setTimeout(
                        () => {
                            finish(
                                reject,
                                new Error(
                                    "O carregamento do Google demorou mais que o esperado.",
                                ),
                            );
                        },
                        10000,
                    );

                verifyLibrary();
            },
        ).catch((error) => {
            googleLibraryPromise = null;

            throw error;
        });

    return googleLibraryPromise;
}

function initializeGoogleIdentity(
    googleApi,
    clientId,
) {
    if (
        initializedClientId ===
        clientId
    ) {
        return;
    }

    googleApi.initialize({
        client_id: clientId,

        callback: (response) => {
            const credential =
                typeof response?.credential ===
                    "string"
                    ? response.credential
                    : "";

            if (!credential) {
                return;
            }

            activeCredentialHandler?.(
                credential,
            );
        },

        ux_mode: "popup",
        auto_select: false,
    });

    initializedClientId = clientId;
}

function GoogleAuthButton({
    onCredential,
    onClick,
    onError,
    disabled = false,
    text = "continue_with",
}) {
    const buttonContainerReference =
        useRef(null);

    const credentialHandlerReference =
        useRef(
            onCredential ?? onClick,
        );

    const errorHandlerReference =
        useRef(onError);

    const disabledReference =
        useRef(disabled);

    const [
        status,
        setStatus,
    ] = useState("loading");

    credentialHandlerReference.current =
        onCredential ?? onClick;

    errorHandlerReference.current =
        onError;

    disabledReference.current =
        disabled;

    useEffect(() => {
        let cancelled = false;
        let resizeObserver = null;
        let lastRenderedWidth = 0;

        const clientId =
            import.meta.env
                .VITE_GOOGLE_CLIENT_ID?.trim();

        const handleCredential = (
            credential,
        ) => {
            if (
                disabledReference.current
            ) {
                return;
            }

            credentialHandlerReference.current?.(
                credential,
            );
        };

        activeCredentialHandler =
            handleCredential;

        async function configureGoogleButton() {
            if (!clientId) {
                const error =
                    new Error(
                        "VITE_GOOGLE_CLIENT_ID não foi configurado.",
                    );

                if (!cancelled) {
                    setStatus("error");

                    errorHandlerReference.current?.(
                        error,
                    );
                }

                return;
            }

            try {
                const googleApi =
                    await waitForGoogleIdentityApi();

                if (cancelled) {
                    return;
                }

                initializeGoogleIdentity(
                    googleApi,
                    clientId,
                );

                const renderButton = () => {
                    const container =
                        buttonContainerReference.current;

                    if (
                        !container ||
                        cancelled
                    ) {
                        return;
                    }

                    const availableWidth =
                        Math.floor(
                            container.clientWidth ||
                            400,
                        );

                    const buttonWidth =
                        Math.max(
                            200,
                            Math.min(
                                400,
                                availableWidth,
                            ),
                        );

                    if (
                        buttonWidth ===
                        lastRenderedWidth &&
                        container
                            .childElementCount >
                        0
                    ) {
                        return;
                    }

                    lastRenderedWidth =
                        buttonWidth;

                    container.replaceChildren();

                    googleApi.renderButton(
                        container,
                        {
                            type: "standard",
                            theme: "outline",
                            size: "large",
                            text,
                            shape: "pill",
                            logo_alignment:
                                "left",
                            width: buttonWidth,
                            locale: "pt-BR",
                        },
                    );

                    setStatus("ready");
                };

                renderButton();

                if (
                    typeof ResizeObserver !==
                    "undefined"
                ) {
                    resizeObserver =
                        new ResizeObserver(
                            renderButton,
                        );

                    resizeObserver.observe(
                        buttonContainerReference.current,
                    );
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setStatus("error");

                errorHandlerReference.current?.(
                    error,
                );
            }
        }

        configureGoogleButton();

        return () => {
            cancelled = true;

            resizeObserver?.disconnect();

            if (
                activeCredentialHandler ===
                handleCredential
            ) {
                activeCredentialHandler =
                    null;
            }
        };
    }, [text]);

    return (
        <div
            className="
                relative
                min-h-11
                w-full
            "
        >
            <div
                ref={
                    buttonContainerReference
                }
                aria-busy={
                    status === "loading"
                }
                className={`
                    flex min-h-11
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    transition-opacity
                    ${disabled
                        ? "pointer-events-none opacity-60"
                        : ""
                    }
                    ${status === "error"
                        ? "hidden"
                        : ""
                    }
                `}
            />

            {status === "loading" && (
                <div
                    className="
                        absolute inset-0
                        flex min-h-11
                        items-center
                        justify-center gap-2
                        rounded-full
                        border border-border
                        bg-background
                        px-4
                        text-sm
                        font-medium
                        text-muted-foreground
                    "
                >
                    <RiLoader4Line
                        className="animate-spin"
                        size={18}
                        aria-hidden="true"
                    />

                    <span>
                        Carregando Google...
                    </span>
                </div>
            )}

            {status === "error" && (
                <div
                    role="alert"
                    className="
                        flex min-h-11
                        w-full
                        items-center
                        justify-center gap-2
                        rounded-full
                        border border-rose-200
                        bg-rose-50
                        px-4
                        text-sm
                        font-medium
                        text-rose-700
                        dark:border-rose-900/60
                        dark:bg-rose-950/30
                        dark:text-rose-300
                    "
                >
                    <RiErrorWarningLine
                        size={18}
                        aria-hidden="true"
                    />

                    <span>
                        Google indisponível
                    </span>
                </div>
            )}

            {disabled &&
                status === "ready" && (
                    <div
                        aria-hidden="true"
                        className="
                            absolute inset-0
                            cursor-not-allowed
                            rounded-full
                        "
                    />
                )}
        </div>
    );
}

export default GoogleAuthButton;