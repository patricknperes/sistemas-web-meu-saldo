import {
    useLocation,
} from "react-router";

import ThemeToggle from "../theme/ThemeToggle.jsx";

import {
    Topbar,
} from "../ui/layout/index.js";

import {
    getRouteMetadata,
} from "./navigationConfig.js";

import UserMenu from "./UserMenu.jsx";

function AppBar() {
    const location = useLocation();

    const route =
        getRouteMetadata(
            location.pathname
        );

    const RouteIcon = route.icon;

    return (
        <Topbar
            title={route.title}
            description={route.description}
            startContent={
                <span
                    className="
                        hidden size-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-primary-muted
                        text-primary
                        sm:inline-flex
                    "
                >
                    <RouteIcon
                        size={18}
                        aria-hidden="true"
                    />
                </span>
            }
            actions={<ThemeToggle />}
            account={
                <>
                    <span
                        aria-hidden="true"
                        className="
                            mx-0.5 h-5 w-px
                            bg-border-subtle
                        "
                    />

                    <UserMenu />
                </>
            }
        />
    );
}

export default AppBar;
