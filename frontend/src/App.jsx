import AppErrorBoundary from "./components/system/AppErrorBoundary.jsx";
import RouteEffects from "./components/system/RouteEffects.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
    return (
        <AppErrorBoundary>
            <RouteEffects />
            <AppRoutes />
        </AppErrorBoundary>
    );
}

export default App;
