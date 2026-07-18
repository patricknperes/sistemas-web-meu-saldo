import logoTemaClaro from "../../assets/images/logo-completa-tema-claro.svg";
import logoTemaEscuro from "../../assets/images/logo-completa-tema-escuro.svg";

import { cn } from "../../lib/cn.js";

function BrandMark({
    className,
    compact = false,
}) {
    return (
        <div
            className={cn(
                `
                    flex w-full
                    items-center justify-center
                `,
                className,
            )}
        >
            <div
                className={cn(
                    `
                        relative
                        shrink-0
                        overflow-hidden
                    `,
                    compact
                        ? "size-10"
                        : "h-12 w-[187px]",
                )}
            >
                <img
                    src={logoTemaClaro}
                    alt="Meu Saldo"
                    className={cn(
                        `
                            absolute left-0 top-0
                            h-full
                            max-w-none
                            object-left
                            dark:hidden
                        `,
                        compact
                            ? "w-auto"
                            : "w-full object-contain",
                    )}
                />

                <img
                    src={logoTemaEscuro}
                    alt="Meu Saldo"
                    className={cn(
                        `
                            absolute left-0 top-0
                            hidden h-full
                            max-w-none
                            object-left
                            dark:block
                        `,
                        compact
                            ? "w-auto"
                            : "w-full object-contain",
                    )}
                />
            </div>
        </div>
    );
}

export default BrandMark;