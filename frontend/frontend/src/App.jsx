import AppErrorBoundary from "./components/app/AppErrorBoundary.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
    return (
        <AppErrorBoundary>
            <AppRoutes />
        </AppErrorBoundary>
    );
}

export default App;
