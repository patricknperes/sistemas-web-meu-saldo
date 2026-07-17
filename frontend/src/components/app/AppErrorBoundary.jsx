import {
    Component,
} from "react";

import {
    UnexpectedErrorPage,
} from "../ui/system/index.js";

import {
    TOKEN_KEY,
} from "../../services/api.js";

function getFallbackHomePath() {
    try {
        return window.localStorage.getItem(TOKEN_KEY)
            ? "/dashboard"
            : "/login";
    } catch {
        return "/login";
    }
}

class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error(
                "Erro não tratado na interface:",
                error,
                errorInfo
            );
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <UnexpectedErrorPage
                    homeTo={getFallbackHomePath()}
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
