import TransactionWorkspace from "../../features/transactions/components/TransactionWorkspace.jsx";

function TransactionPage({ type = "INCOME" }) {
    return <TransactionWorkspace type={type} />;
}

export default TransactionPage;
