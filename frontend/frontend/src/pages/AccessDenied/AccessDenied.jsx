import {
    RiLoginBoxLine,
} from "react-icons/ri";

import {
    useNavigate,
} from "react-router";

import {
    Button,
} from "../../components/ui/actions/index.js";

import {
    Page,
} from "../../components/ui/layout/index.js";

import {
    AccessDeniedPage,
} from "../../components/ui/system/index.js";

import {
    useAuth,
} from "../../hooks/useAuth.js";

function AccessDenied() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    function handleSwitchAccount() {
        logout();

        navigate(
            "/login",
            { replace: true }
        );
    }

    return (
        <Page maxWidth="2xl">
            <AccessDeniedPage
                embedded
                compact
                showBrand={false}
                homeTo="/dashboard"
                secondaryAction={(
                    <Button
                        variant="outline"
                        leadingIcon={(
                            <RiLoginBoxLine
                                size={18}
                                aria-hidden="true"
                            />
                        )}
                        onClick={handleSwitchAccount}
                    >
                        Trocar de conta
                    </Button>
                )}
            />
        </Page>
    );
}

export default AccessDenied;
