import {
    useState,
} from "react";

import {
    RiAddLine,
    RiArrowLeftLine,
    RiArrowRightLine,
    RiBankCardLine,
    RiCalendarLine,
    RiCheckLine,
    RiContrastDrop2Line,
    RiCursorLine,
    RiDeleteBin6Line,
    RiDownloadLine,
    RiEditLine,
    RiExternalLinkLine,
    RiInputField,
    RiKey2Line,
    RiLoginBoxLine,
    RiLockPasswordLine,
    RiFontSize2,
    RiLayoutGridLine,
    RiListCheck2,
    RiMailLine,
    RiMore2Line,
    RiPaletteLine,
    RiPriceTag3Line,
    RiRuler2Line,
    RiSave3Line,
    RiSettings3Line,
    RiShieldCheckLine,
    RiStackLine,
    RiTableLine,
    RiUserLine,
    RiUserAddLine,
    RiWallet3Line,
    RiBuilding2Line,
    RiShoppingBasket2Line,
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiFilter3Line,
    RiFolderOpenLine,
    RiInformationLine,
    RiNotification3Line,
    RiRefreshLine,
    RiExchangeDollarLine,
    RiFundsLine,
    RiLineChartLine,
    RiMoneyDollarCircleLine,
    RiPieChart2Line,
    RiRepeat2Line,
} from "react-icons/ri";

import {
    Button,
    ButtonGroup,
    IconButton,
    LinkButton,
} from "../../components/ui/actions/index.js";

import {
    Checkbox,
    Combobox,
    CurrencyInput,
    FormField,
    Input,
    PasswordInput,
    RadioGroup,
    SearchInput,
    SegmentedControl,
    Select,
    Switch,
    TextArea,
} from "../../components/ui/forms/index.js";

import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Section,
    Surface,
} from "../../components/ui/surfaces/index.js";

import {
    Alert,
    ConfirmDialog,
    Drawer,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    EmptyState,
    ErrorState,
    LoadingState,
    Modal,
    Popover,
    Skeleton,
    SkeletonText,
    Snackbar,
    Tooltip,
} from "../../components/ui/feedback/index.js";

import {
    Calendar,
    DateField,
    MonthPicker,
    MonthYearPicker,
    PeriodPicker,
    YearPicker,
} from "../../components/ui/date-picker/index.js";

import {
    CategoryBadge,
    TagBadge,
    TagColorPicker,
    TagCreateForm,
    TagGroup,
    TagScopeSelect,
    TagSelector,
} from "../../components/ui/tags/index.js";

import {
    AppShell,
    Page,
    PageGrid,
    PageHeader,
    PageSection,
    PageToolbar,
    Sidebar,
    SidebarAccount,
    SidebarBrand,
    SidebarNavigation,
    Topbar,
} from "../../components/ui/layout/index.js";

import {
    DataCard,
    DataCardBody,
    DataCardField,
    DataCardFooter,
    DataCardHeader,
    DataList,
    DataTable,
    DataTableActions,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    DataTableSortButton,
    Pagination,
    ResponsiveDataView,
} from "../../components/ui/data-display/index.js";

import {
    BalanceStatus,
    ChartCard,
    ChartState,
    ChartTooltip,
    CurrencyValue,
    FinancialSummary,
    MetricCard,
    TrendIndicator,
} from "../../components/ui/finance/index.js";

import {
    RecurrenceFrequency,
    RecurrencePeriod,
    RecurrenceStatusBadge,
    RecurrenceSummary,
    RecurringTransactionCard,
    RecurringTransactionRow,
    TransactionActions,
    TransactionAmount,
    TransactionCard,
    TransactionDate,
    TransactionDescription,
    TransactionFilterBar,
    TransactionFilters,
    TransactionForm,
    TransactionReview,
    TransactionRow,
    TransactionSummary,
    TransactionTabs,
    countTransactionFilters,
    emptyTransactionFilters,
} from "../../components/ui/transactions/index.js";

import {
    AuthDivider,
    AuthForm,
    AuthHeader,
    AuthShell,
    AuthSocialButton,
    AuthStatusState,
    AuthStepIndicator,
    AuthTabs,
    PasswordField,
    PasswordRequirements,
    PasswordStrength,
} from "../../components/ui/auth/index.js";

import {
    PermissionItem,
    PermissionList,
    ProfileForm,
    UserActionsMenu,
    UserAdminForm,
    UserDetailItem,
    UserDetailList,
    UserIdentity,
    UserRoleBadge,
    UserStatusBadge,
} from "../../components/ui/account/index.js";

import {
    AccessDeniedPage,
    MaintenancePage,
    NotFoundPage,
    UnexpectedErrorPage,
} from "../../components/ui/system/index.js";

const transactionTypeOptions = [
    {
        value: "income",
        label: "Receita",
    },
    {
        value: "expense",
        label: "Despesa",
    },
    {
        value: "transfer",
        label: "Transferência",
    },
];

const accountOptions = [
    {
        value: "wallet",
        label: "Carteira",
        description: "Saldo em dinheiro",
        icon: RiWallet3Line,
        keywords: "dinheiro espécie",
    },
    {
        value: "checking",
        label: "Conta principal",
        description: "Banco Meu Saldo · final 2048",
        icon: RiBuilding2Line,
        keywords: "corrente banco principal",
    },
    {
        value: "credit-card",
        label: "Cartão de crédito",
        description: "Fatura fecha no dia 18",
        icon: RiBankCardLine,
        keywords: "cartão crédito fatura",
    },
    {
        value: "benefit",
        label: "Vale-alimentação",
        description: "Uso exclusivo em alimentação",
        icon: RiShoppingBasket2Line,
        keywords: "benefício mercado restaurante",
    },
];

const notificationOptions = [
    {
        value: "daily",
        label: "Diário",
        description: "Resumo ao final de cada dia.",
    },
    {
        value: "weekly",
        label: "Semanal",
        description: "Uma visão consolidada por semana.",
    },
    {
        value: "never",
        label: "Não enviar",
        description: "Desativa os resumos automáticos.",
    },
];

const periodOptions = [
    {
        value: "all",
        label: "Todo período",
    },
    {
        value: "month",
        label: "Mês",
    },
    {
        value: "year",
        label: "Ano",
    },
];

const viewOptions = [
    {
        value: "table",
        label: "Tabela",
        icon: RiLayoutGridLine,
    },
    {
        value: "cards",
        label: "Cards",
        icon: RiStackLine,
    },
];

const tagExamples = [
    {
        id: 1,
        name: "Moradia",
        color: "#7C3AED",
        scope: "EXPENSE",
    },
    {
        id: 2,
        name: "Alimentação",
        color: "#C2410C",
        scope: "EXPENSE",
    },
    {
        id: 3,
        name: "Salário",
        color: "#15803D",
        scope: "INCOME",
    },
    {
        id: 4,
        name: "Educação",
        color: "#2563EB",
        scope: "BOTH",
    },
    {
        id: 5,
        name: "Saúde",
        color: "#BE185D",
        scope: "BOTH",
    },
    {
        id: 6,
        name: "Assinatura mensal",
        color: "#0891B2",
        scope: "EXPENSE",
    },
];



const tableTransactionExamples = [
    {
        id: 1,
        description: "Supermercado Central",
        category: "Alimentação",
        type: "expense",
        account: "Conta principal",
        date: "16 jul 2026",
        dateKey: "2026-07-16",
        amount: "- R$ 284,90",
        amountValue: -284.9,
        tags: [tagExamples[1], tagExamples[5]],
        icon: RiShoppingBasket2Line,
    },
    {
        id: 2,
        description: "Salário mensal",
        category: "Trabalho",
        type: "income",
        account: "Conta principal",
        date: "05 jul 2026",
        dateKey: "2026-07-05",
        amount: "+ R$ 4.500,00",
        amountValue: 4500,
        tags: [tagExamples[2]],
        icon: RiWallet3Line,
    },
    {
        id: 3,
        description: "Aluguel do apartamento",
        category: "Moradia",
        type: "expense",
        account: "Conta principal",
        date: "03 jul 2026",
        dateKey: "2026-07-03",
        amount: "- R$ 1.250,00",
        amountValue: -1250,
        tags: [tagExamples[0], tagExamples[5]],
        icon: RiBuilding2Line,
    },
    {
        id: 4,
        description: "Curso de React avançado",
        category: "Educação",
        type: "expense",
        account: "Cartão de crédito",
        date: "28 jun 2026",
        dateKey: "2026-06-28",
        amount: "- R$ 189,90",
        amountValue: -189.9,
        tags: [tagExamples[3]],
        icon: RiListCheck2,
    },
    {
        id: 5,
        description: "Farmácia e cuidados pessoais",
        category: "Saúde",
        type: "expense",
        account: "Cartão de crédito",
        date: "24 jun 2026",
        dateKey: "2026-06-24",
        amount: "- R$ 96,40",
        amountValue: -96.4,
        tags: [tagExamples[4]],
        icon: RiPriceTag3Line,
    },
];

const transactionComponentExamples = [
    {
        id: 101,
        description: "Supermercado Central",
        notes: "Compras do mês e itens de limpeza.",
        category: "Alimentação",
        type: "EXPENSE",
        date: "2026-07-16",
        amountCents: 28490,
        account: "Conta principal",
        tags: [tagExamples[1], tagExamples[5]],
    },
    {
        id: 102,
        description: "Salário mensal",
        notes: "Pagamento referente a julho.",
        category: "Trabalho",
        type: "INCOME",
        date: "2026-07-05",
        amountCents: 450000,
        account: "Conta principal",
        tags: [tagExamples[2]],
        generatedByRecurrence: true,
    },
    {
        id: 103,
        description: "Curso de React avançado",
        notes: "Parcela 2 de 4 no cartão de crédito.",
        category: "Educação",
        type: "EXPENSE",
        date: "2026-06-28",
        amountCents: 18990,
        account: "Cartão de crédito",
        tags: [tagExamples[3]],
    },
];

const recurringComponentExamples = [
    {
        id: 201,
        description: "Salário mensal",
        notes: "Registrado apenas quando o dia configurado chegar.",
        category: "Trabalho",
        type: "INCOME",
        amountCents: 450000,
        intervalMonths: 1,
        dayOfMonth: 5,
        startDate: "2026-01-05",
        endDate: null,
        nextOccurrenceDate: "2026-08-05",
        status: "ACTIVE",
        isActive: true,
        tags: [tagExamples[2]],
    },
    {
        id: 202,
        description: "Aluguel do apartamento",
        notes: "Recorrência pausada temporariamente.",
        category: "Moradia",
        type: "EXPENSE",
        amountCents: 125000,
        intervalMonths: 1,
        dayOfMonth: 3,
        startDate: "2026-01-03",
        endDate: "2026-12-03",
        nextOccurrenceDate: "2026-08-03",
        status: "PAUSED",
        isActive: false,
        tags: [tagExamples[0], tagExamples[5]],
    },
    {
        id: 203,
        description: "Renovação do domínio",
        notes: "Cobrança anual do domínio do projeto.",
        category: "Serviços",
        type: "EXPENSE",
        amountCents: 7990,
        intervalMonths: 12,
        dayOfMonth: 20,
        startDate: "2026-09-20",
        endDate: null,
        nextOccurrenceDate: "2026-09-20",
        status: "SCHEDULED",
        isActive: true,
        tags: [tagExamples[3]],
    },
];

const shellNavigationSections = [
    {
        id: "overview",
        label: "Visão geral",
        items: [
            {
                id: "dashboard",
                label: "Dashboard",
                icon: RiLayoutGridLine,
                active: true,
            },
            {
                id: "income",
                label: "Receitas",
                icon: RiWallet3Line,
            },
            {
                id: "expenses",
                label: "Despesas",
                icon: RiBankCardLine,
            },
            {
                id: "history",
                label: "Histórico",
                icon: RiListCheck2,
            },
        ],
    },
    {
        id: "management",
        label: "Administração",
        items: [
            {
                id: "users",
                label: "Usuários",
                icon: RiUserLine,
            },
            {
                id: "design-system",
                label: "Design System",
                icon: RiPaletteLine,
                badge: "Admin",
            },
        ],
    },
];

const shellMetrics = [
    {
        label: "Saldo disponível",
        value: "R$ 8.420,00",
        helper: "+8,4% no mês",
        tone: "text-foreground",
    },
    {
        label: "Receitas",
        value: "R$ 5.860,00",
        helper: "12 lançamentos",
        tone: "text-success",
    },
    {
        label: "Despesas",
        value: "R$ 3.210,00",
        helper: "18 lançamentos",
        tone: "text-danger",
    },
    {
        label: "Economia",
        value: "R$ 2.650,00",
        helper: "45% das receitas",
        tone: "text-primary",
    },
];

const typographySamples = [
    {
        name: "Display",
        token: "text-display",
        className:
            "text-display font-bold tracking-display",
        sample:
            "Controle financeiro com clareza.",
        specification:
            "36 px · 700 · 1.08",
    },
    {
        name: "Título de página",
        token: "text-page-title",
        className:
            "text-page-title font-bold tracking-heading",
        sample: "Visão geral financeira",
        specification:
            "28 px · 700 · 1.15",
    },
    {
        name: "Título de seção",
        token: "text-section-title",
        className:
            "text-section-title font-bold",
        sample: "Receitas e despesas",
        specification:
            "18 px · 700 · 1.35",
    },
    {
        name: "Título de card",
        token: "text-card-title",
        className:
            "text-card-title font-semibold",
        sample: "Saldo disponível",
        specification:
            "15 px · 600 · 1.40",
    },
    {
        name: "Texto padrão",
        token: "text-body",
        className:
            "text-body text-foreground-soft",
        sample:
            "Acompanhe suas movimentações e tome decisões com mais segurança.",
        specification:
            "14 px · 400 · 1.60",
    },
    {
        name: "Texto auxiliar",
        token: "text-body-sm",
        className:
            "text-body-sm text-muted-foreground",
        sample:
            "Última atualização hoje às 10:42.",
        specification:
            "13 px · 400 · 1.55",
    },
    {
        name: "Legenda",
        token: "text-caption",
        className:
            "text-caption text-muted-foreground",
        sample:
            "Valores referentes ao período selecionado.",
        specification:
            "12 px · 400 · 1.50",
    },
    {
        name: "Overline",
        token: "text-overline",
        className:
            "text-overline font-bold uppercase tracking-overline text-primary",
        sample: "Resumo mensal",
        specification:
            "11 px · 700 · 0.12 em",
    },
];

const colorGroups = [
    {
        title: "Marca",
        description:
            "Ações principais, seleção e elementos de identidade.",
        colors: [
            {
                name: "Primary",
                token: "--app-primary",
            },
            {
                name: "Primary hover",
                token: "--app-primary-hover",
            },
            {
                name: "Primary muted",
                token: "--app-primary-muted",
                border: true,
            },
        ],
    },
    {
        title: "Superfícies",
        description:
            "Níveis visuais usados para páginas, cards e áreas interativas.",
        colors: [
            {
                name: "Background",
                token: "--app-background",
                border: true,
            },
            {
                name: "Surface",
                token: "--app-surface",
                border: true,
            },
            {
                name: "Subtle",
                token: "--app-surface-subtle",
                border: true,
            },
            {
                name: "Muted",
                token: "--app-surface-muted",
                border: true,
            },
            {
                name: "Hover",
                token: "--app-surface-hover",
                border: true,
            },
        ],
    },
    {
        title: "Texto e bordas",
        description:
            "Hierarquia de leitura e separação entre conteúdos.",
        colors: [
            {
                name: "Foreground",
                token: "--app-foreground",
            },
            {
                name: "Foreground soft",
                token: "--app-foreground-soft",
            },
            {
                name: "Muted",
                token: "--app-muted-foreground",
            },
            {
                name: "Subtle",
                token: "--app-subtle-foreground",
            },
            {
                name: "Border",
                token: "--app-border",
                border: true,
            },
        ],
    },
    {
        title: "Estados",
        description:
            "Cores semânticas para feedback, valores e validações.",
        colors: [
            {
                name: "Success",
                token: "--app-success",
            },
            {
                name: "Danger",
                token: "--app-danger",
            },
            {
                name: "Warning",
                token: "--app-warning",
            },
            {
                name: "Info",
                token: "--app-info",
            },
        ],
    },
];

const tagColors = [
    {
        name: "Roxo",
        color: "--app-tag-purple",
        muted: "--app-tag-purple-muted",
    },
    {
        name: "Azul",
        color: "--app-tag-blue",
        muted: "--app-tag-blue-muted",
    },
    {
        name: "Ciano",
        color: "--app-tag-cyan",
        muted: "--app-tag-cyan-muted",
    },
    {
        name: "Verde",
        color: "--app-tag-green",
        muted: "--app-tag-green-muted",
    },
    {
        name: "Laranja",
        color: "--app-tag-orange",
        muted: "--app-tag-orange-muted",
    },
    {
        name: "Âmbar",
        color: "--app-tag-amber",
        muted: "--app-tag-amber-muted",
    },
    {
        name: "Rosa",
        color: "--app-tag-pink",
        muted: "--app-tag-pink-muted",
    },
    {
        name: "Vermelho",
        color: "--app-tag-red",
        muted: "--app-tag-red-muted",
    },
    {
        name: "Cinza",
        color: "--app-tag-slate",
        muted: "--app-tag-slate-muted",
    },
];

const spacingScale = [
    {
        token: "1",
        pixels: 4,
    },
    {
        token: "2",
        pixels: 8,
    },
    {
        token: "3",
        pixels: 12,
    },
    {
        token: "4",
        pixels: 16,
    },
    {
        token: "5",
        pixels: 20,
    },
    {
        token: "6",
        pixels: 24,
    },
    {
        token: "8",
        pixels: 32,
    },
    {
        token: "10",
        pixels: 40,
    },
    {
        token: "12",
        pixels: 48,
    },
];

const radiusScale = [
    {
        name: "XS",
        value: "6 px",
        token: "--app-radius-xs",
    },
    {
        name: "SM",
        value: "8 px",
        token: "--app-radius-sm",
    },
    {
        name: "MD",
        value: "10 px",
        token: "--app-radius-md",
    },
    {
        name: "LG",
        value: "12 px",
        token: "--app-radius-lg",
    },
    {
        name: "XL",
        value: "16 px",
        token: "--app-radius-xl",
    },
    {
        name: "2XL",
        value: "20 px",
        token: "--app-radius-2xl",
    },
];

const shadows = [
    {
        name: "XS",
        usage: "Separação mínima",
        token: "--app-shadow-xs",
    },
    {
        name: "SM",
        usage: "Controles elevados",
        token: "--app-shadow-sm",
    },
    {
        name: "Card",
        usage: "Cards destacados",
        token: "--app-shadow-card",
    },
    {
        name: "Raised",
        usage: "Elementos flutuantes",
        token: "--app-shadow-raised",
    },
    {
        name: "Dropdown",
        usage: "Menus e calendários",
        token: "--app-shadow-dropdown",
    },
    {
        name: "Dialog",
        usage: "Modais e drawers",
        token: "--app-shadow-dialog",
    },
];

const principles = [
    {
        title: "Hierarquia clara",
        description:
            "Títulos, valores e ações devem ser compreendidos antes dos detalhes secundários.",
    },
    {
        title: "Densidade equilibrada",
        description:
            "Informação suficiente sem criar cards, margens ou espaços vazios desnecessários.",
    },
    {
        title: "Cores com função",
        description:
            "Cor indica ação, estado ou categoria. Nunca deve existir apenas como decoração.",
    },
    {
        title: "Responsividade real",
        description:
            "O conteúdo se reorganiza conforme o espaço; não apenas diminui de tamanho.",
    },
];

function SectionHeader({
    icon: Icon,
    eyebrow,
    title,
    description,
}) {
    return (
        <div
            className="
                flex flex-col gap-4
                border-b border-border
                pb-5
                sm:flex-row
                sm:items-start
                sm:justify-between
            "
        >
            <div className="min-w-0">
                <div
                    className="
                        mb-2 flex
                        items-center gap-2
                        text-overline
                        font-bold uppercase
                        tracking-overline
                        text-primary
                    "
                >
                    <Icon
                        size={16}
                        aria-hidden="true"
                    />

                    <span>{eyebrow}</span>
                </div>

                <h2 className="text-section-title font-bold">
                    {title}
                </h2>

                <p
                    className="
                        mt-2 max-w-3xl
                        text-body-sm
                        text-muted-foreground
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

function FoundationSection({
    icon,
    eyebrow,
    title,
    description,
    children,
}) {
    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border border-border
                bg-surface
                shadow-xs
            "
        >
            <div className="p-card">
                <SectionHeader
                    icon={icon}
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                />

                <div className="pt-6">
                    {children}
                </div>
            </div>
        </section>
    );
}

function SystemPagePreview({
    value,
    onAction,
}) {
    const commonProps = {
        embedded: true,
        compact: true,
        primaryAction: (
            <Button
                leadingIcon={<RiRefreshLine size={18} aria-hidden="true" />}
                onClick={onAction}
            >
                Ação principal
            </Button>
        ),
        secondaryAction: (
            <Button variant="outline" onClick={onAction}>
                Ação secundária
            </Button>
        ),
    };

    if (value === "not-found") {
        return <NotFoundPage {...commonProps} />;
    }

    if (value === "access-denied") {
        return <AccessDeniedPage {...commonProps} />;
    }

    if (value === "maintenance") {
        return (
            <MaintenancePage
                {...commonProps}
                estimatedReturn="hoje, às 18h"
            />
        );
    }

    return <UnexpectedErrorPage {...commonProps} />;
}

function ColorSwatch({
    name,
    token,
    border = false,
}) {
    return (
        <article
            className="
                min-w-0 overflow-hidden
                rounded-xl
                border border-border
                bg-surface-subtle
            "
        >
            <div
                aria-hidden="true"
                className={
                    border
                        ? "h-24 border-b border-border"
                        : "h-24"
                }
                style={{
                    backgroundColor: `var(${token})`,
                }}
            />

            <div className="p-3">
                <p
                    className="
                        truncate
                        text-body-sm
                        font-semibold
                        text-foreground
                    "
                >
                    {name}
                </p>

                <code
                    className="
                        mt-1 block truncate
                        text-caption
                        text-muted-foreground
                    "
                >
                    {token}
                </code>
            </div>
        </article>
    );
}


function DesignSystemSidebar() {
    return (
        <Sidebar>
            <SidebarBrand
                icon={
                    <RiWallet3Line
                        size={18}
                        aria-hidden="true"
                    />
                }
                title="Meu Saldo"
                subtitle="Inteligência financeira"
                to="/design-system"
            />

            <SidebarNavigation
                sections={
                    shellNavigationSections
                }
            />

            <SidebarAccount
                name="Patrick Peres"
                role="Administrador"
                profileTo="/design-system"
            />
        </Sidebar>
    );
}

function DesignSystemTopbar() {
    return (
        <Topbar
            title="Visão geral"
            description="Atualizado há poucos segundos"
            actions={
                <>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        label="Notificações"
                        icon={
                            <RiNotification3Line
                                size={18}
                                aria-hidden="true"
                            />
                        }
                    />

                    <IconButton
                        size="sm"
                        variant="ghost"
                        label="Configurações"
                        icon={
                            <RiSettings3Line
                                size={18}
                                aria-hidden="true"
                            />
                        }
                    />
                </>
            }
            account={
                <button
                    type="button"
                    aria-label="Abrir menu da conta"
                    className="
                        ml-1
                        inline-flex size-9
                        items-center justify-center
                        rounded-full
                        bg-primary-muted
                        text-[11px]
                        font-extrabold
                        text-primary
                        outline-none
                        ring-1 ring-primary/10
                        focus-visible:ring-2
                        focus-visible:ring-ring/25
                    "
                >
                    PP
                </button>
            }
        />
    );
}

function ShellMetricCard({
    label,
    value,
    helper,
    tone,
}) {
    return (
        <article
            className="
                min-w-0
                rounded-xl
                border border-border
                bg-surface
                p-4
                shadow-xs
            "
        >
            <p
                className="
                    text-caption
                    font-semibold
                    text-muted-foreground
                "
            >
                {label}
            </p>

            <strong
                className={`
                    numeric-value
                    mt-2 block truncate
                    text-section-title
                    font-extrabold
                    tracking-heading
                    ${tone}
                `}
            >
                {value}
            </strong>

            <p
                className="
                    mt-1 text-[10px]
                    font-medium
                    text-subtle-foreground
                "
            >
                {helper}
            </p>
        </article>
    );
}

function ShellPreviewContent({
    compact = false,
}) {
    return (
        <Page
            maxWidth="full"
            spacing="compact"
            className={
                compact
                    ? "px-3 sm:px-3 lg:px-3"
                    : ""
            }
        >
            <PageHeader
                eyebrow="Julho de 2026"
                title={
                    compact
                        ? "Dashboard"
                        : "Visão geral financeira"
                }
                description={
                    compact
                        ? "Acompanhe seus principais números."
                        : "Acompanhe o saldo, o fluxo mensal e os lançamentos mais recentes em um único lugar."
                }
                actions={
                    <Button
                        size="sm"
                        leadingIcon={
                            <RiAddLine
                                size={17}
                                aria-hidden="true"
                            />
                        }
                    >
                        Nova movimentação
                    </Button>
                }
            />

            <PageToolbar
                startContent={
                    <SearchInput
                        placeholder="Pesquisar lançamento"
                        className="w-full sm:max-w-60"
                    />
                }
                endContent={
                    <PeriodPicker
                        defaultValue={{
                            mode: "month",
                            month: "2026-07",
                            year: 2026,
                        }}
                    />
                }
            />

            <PageGrid columns="metrics">
                {shellMetrics.map(
                    (metric) => (
                        <ShellMetricCard
                            key={metric.label}
                            {...metric}
                        />
                    )
                )}
            </PageGrid>

            <PageSection
                eyebrow="Movimentações"
                title="Atividade recente"
                description="Os componentes de página mantêm título, ação e conteúdo alinhados sem criar uma sequência de containers."
                actions={
                    <Button
                        size="sm"
                        variant="ghost"
                        trailingIcon={
                            <RiArrowRightLine
                                size={16}
                                aria-hidden="true"
                            />
                        }
                    >
                        Ver histórico
                    </Button>
                }
            >
                <Card variant="outlined">
                    <CardBody className="p-0">
                        {[
                            {
                                description:
                                    "Pagamento de salário",
                                category:
                                    "Receita",
                                value:
                                    "+ R$ 3.800,00",
                                valueClass:
                                    "text-success",
                            },
                            {
                                description:
                                    "Supermercado",
                                category:
                                    "Alimentação",
                                value:
                                    "- R$ 286,40",
                                valueClass:
                                    "text-danger",
                            },
                            {
                                description:
                                    "Assinatura de software",
                                category:
                                    "Trabalho",
                                value:
                                    "- R$ 79,90",
                                valueClass:
                                    "text-danger",
                            },
                        ].map(
                            (
                                transaction,
                                index
                            ) => (
                                <div
                                    key={
                                        transaction.description
                                    }
                                    className={`
                                        flex min-w-0
                                        items-center gap-3
                                        px-4 py-3
                                        ${index > 0
                                            ? "border-t border-border-subtle"
                                            : ""
                                        }
                                    `}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="
                                            flex size-9 shrink-0
                                            items-center justify-center
                                            rounded-lg
                                            bg-surface-muted
                                            text-muted-foreground
                                        "
                                    >
                                        <RiWallet3Line
                                            size={17}
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <strong
                                            className="
                                                block truncate
                                                text-body-sm
                                                font-bold
                                                text-foreground
                                            "
                                        >
                                            {
                                                transaction.description
                                            }
                                        </strong>

                                        <span
                                            className="
                                                mt-0.5 block
                                                text-[10px]
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            {
                                                transaction.category
                                            }
                                        </span>
                                    </span>

                                    <strong
                                        className={`
                                            numeric-value
                                            shrink-0
                                            text-body-sm
                                            font-extrabold
                                            ${transaction.valueClass}
                                        `}
                                    >
                                        {
                                            transaction.value
                                        }
                                    </strong>
                                </div>
                            )
                        )}
                    </CardBody>
                </Card>
            </PageSection>
        </Page>
    );
}


function MetricSparkline({ tone = "primary" }) {
    const colorMap = {
        primary: "var(--app-primary)",
        positive: "var(--app-success)",
        negative: "var(--app-danger)",
        warning: "var(--app-warning)",
    };
    const color = colorMap[tone] || colorMap.primary;

    return (
        <svg
            viewBox="0 0 180 46"
            className="h-11 w-full overflow-visible"
            role="img"
            aria-label="Tendência resumida do indicador"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={`sparkline-${tone}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.24" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            <path
                d="M0 39 C18 37 22 25 40 29 C59 33 64 16 82 20 C101 24 107 9 126 14 C145 19 154 6 180 8 L180 46 L0 46 Z"
                fill={`url(#sparkline-${tone})`}
            />
            <path
                d="M0 39 C18 37 22 25 40 29 C59 33 64 16 82 20 C101 24 107 9 126 14 C145 19 154 6 180 8"
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function CashFlowChartPreview() {
    const points = [
        { month: "Fev", income: 62, expense: 40 },
        { month: "Mar", income: 74, expense: 48 },
        { month: "Abr", income: 58, expense: 46 },
        { month: "Mai", income: 86, expense: 55 },
        { month: "Jun", income: 78, expense: 52 },
        { month: "Jul", income: 94, expense: 60 },
    ];

    return (
        <div className="relative min-h-64">
            <div className="absolute inset-x-0 top-2 grid h-48 grid-rows-4">
                {[0, 1, 2, 3].map((item) => (
                    <span key={item} className="border-t border-chart-grid" />
                ))}
            </div>

            <div className="relative flex h-56 items-end justify-between gap-3 pt-4 sm:gap-5">
                {points.map((point) => (
                    <div key={point.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="flex h-44 w-full items-end justify-center gap-1.5">
                            <span
                                className="w-[38%] max-w-7 rounded-t-md bg-chart-1 transition-opacity hover:opacity-80"
                                style={{ height: `${point.income}%` }}
                                title={`Receitas em ${point.month}: ${point.income}% da escala`}
                            />
                            <span
                                className="w-[38%] max-w-7 rounded-t-md bg-chart-3 transition-opacity hover:opacity-80"
                                style={{ height: `${point.expense}%` }}
                                title={`Despesas em ${point.month}: ${point.expense}% da escala`}
                            />
                        </div>

                        <span className="text-[0.6875rem] font-semibold text-muted-foreground">
                            {point.month}
                        </span>
                    </div>
                ))}
            </div>

            <ChartTooltip
                title="Julho de 2026"
                description="Resultado consolidado"
                className="pointer-events-none absolute right-2 top-1 hidden sm:block"
                items={[
                    {
                        label: "Receitas",
                        value: "R$ 5.860,00",
                        color: "var(--app-chart-1)",
                    },
                    {
                        label: "Despesas",
                        value: "R$ 3.210,00",
                        color: "var(--app-chart-3)",
                    },
                ]}
                total={{
                    label: "Resultado",
                    value: "R$ 2.650,00",
                }}
            />
        </div>
    );
}

function ExpenseDonutPreview() {
    const categories = [
        { label: "Moradia", value: "38%", color: "var(--app-chart-1)" },
        { label: "Alimentação", value: "26%", color: "var(--app-chart-3)" },
        { label: "Transporte", value: "19%", color: "var(--app-chart-4)" },
        { label: "Outros", value: "17%", color: "var(--app-chart-5)" },
    ];

    return (
        <div className="grid min-h-64 items-center gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="relative mx-auto size-44">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                        background:
                            "conic-gradient(var(--app-chart-1) 0 38%, var(--app-chart-3) 38% 64%, var(--app-chart-4) 64% 83%, var(--app-chart-5) 83% 100%)",
                    }}
                />
                <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full border border-border bg-surface text-center shadow-xs">
                    <span className="text-caption font-semibold text-muted-foreground">
                        Total
                    </span>
                    <CurrencyValue value={3210} size="lg" tone="neutral" />
                </div>
            </div>

            <div className="grid gap-2.5">
                {categories.map((category) => (
                    <div
                        key={category.label}
                        className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2.5"
                    >
                        <span
                            aria-hidden="true"
                            className="size-2.5 rounded-[3px]"
                            style={{ backgroundColor: category.color }}
                        />
                        <span className="min-w-0 flex-1 truncate text-caption font-semibold text-muted-foreground">
                            {category.label}
                        </span>
                        <strong className="numeric-value text-caption font-extrabold text-foreground tabular-nums">
                            {category.value}
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DesignSystem() {
    const [searchValue, setSearchValue] = useState("mercado");
    const [currencyValue, setCurrencyValue] = useState(1890);
    const [description, setDescription] = useState(
        "Pagamento referente ao serviço mensal."
    );
    const [transactionType, setTransactionType] = useState("expense");
    const [account, setAccount] = useState("checking");
    const [includeRecurring, setIncludeRecurring] = useState(true);
    const [autoReconcile, setAutoReconcile] = useState(false);
    const [weeklySummary, setWeeklySummary] = useState(true);
    const [securityAlerts, setSecurityAlerts] = useState(true);
    const [notificationFrequency, setNotificationFrequency] = useState("weekly");
    const [periodMode, setPeriodMode] = useState("month");
    const [viewMode, setViewMode] = useState("table");
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dismissibleAlertVisible, setDismissibleAlertVisible] = useState(true);
    const [exampleDate, setExampleDate] = useState("2026-07-16");
    const [limitedDate, setLimitedDate] = useState("2026-07-24");
    const [calendarDate, setCalendarDate] = useState("2026-07-16");
    const [monthOnly, setMonthOnly] = useState("2026-07");
    const [monthYear, setMonthYear] = useState("2026-07");
    const [selectedYear, setSelectedYear] = useState(2026);
    const [dashboardPeriod, setDashboardPeriod] = useState({
        mode: "month",
        month: "2026-07",
        year: 2026,
    });
    const [designTags, setDesignTags] = useState(tagExamples);
    const [selectedTagIds, setSelectedTagIds] = useState([1, 2, 5]);
    const [tagPreviewColor, setTagPreviewColor] = useState("#7C3AED");
    const [tagPreviewScope, setTagPreviewScope] = useState("BOTH");
    const [removableTags, setRemovableTags] = useState(tagExamples.slice(0, 3));
    const [tableSort, setTableSort] = useState({
        key: "dateKey",
        direction: "desc",
    });
    const [tablePage, setTablePage] = useState(1);
    const [transactionView, setTransactionView] = useState("transactions");
    const [transactionFiltersOpen, setTransactionFiltersOpen] = useState(false);
    const [transactionSearch, setTransactionSearch] = useState("mercado");
    const [transactionOperationPeriod, setTransactionOperationPeriod] = useState({
        mode: "month",
        month: "2026-07",
        year: 2026,
    });
    const [transactionOperationFilters, setTransactionOperationFilters] = useState({
        ...emptyTransactionFilters,
        type: "expense",
        origin: "manual",
        tagIds: [2],
    });
    const [authMode, setAuthMode] = useState("login");
    const [authPassword, setAuthPassword] = useState("MeuSaldo@2026");
    const [resetPassword, setResetPassword] = useState("NovaSenha@2026");
    const [recoveryStep, setRecoveryStep] = useState(1);
    const [profileFormValue, setProfileFormValue] = useState({
        name: "Patrick Peres",
        email: "patrick@email.com",
    });
    const [adminUserValue, setAdminUserValue] = useState({
        name: "Mariana Costa",
        email: "mariana.costa@email.com",
        role: "USER",
        status: "ACTIVE",
    });
    const [systemPagePreview, setSystemPagePreview] = useState("not-found");
    const [transactionFormValue, setTransactionFormValue] = useState({
        kind: "recurring",
        type: "expense",
        description: "Assinatura da plataforma",
        amount: 89.9,
        date: "2026-07-16",
        notes: "Plano profissional utilizado para atividades do trabalho.",
        tagIds: [2, 5],
        recurrence: {
            startDate: "2026-07-16",
            endDate: "2027-06-16",
            dayOfMonth: 16,
            intervalMonths: 1,
        },
    });

    const transactionOperationFilterCount = countTransactionFilters(
        transactionOperationFilters
    );
    const transactionFormTags = designTags.filter((tag) =>
        transactionFormValue.tagIds.includes(tag.id)
    );

    const sortedTableTransactions = [...tableTransactionExamples].sort((left, right) => {
        const leftValue = left[tableSort.key];
        const rightValue = right[tableSort.key];
        const comparison = typeof leftValue === "number"
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), "pt-BR");

        return tableSort.direction === "asc" ? comparison : -comparison;
    });

    function handleTableSort(key, direction) {
        setTableSort({
            key,
            direction,
        });
    }

    return (
        <div className="page-container">
            <header
                className="
                    relative overflow-hidden
                    rounded-3xl
                    border border-border
                    bg-surface
                    shadow-card
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        surface-grid
                        pointer-events-none
                        absolute inset-0
                        opacity-60
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -right-20 -top-24
                        size-72 rounded-full
                        bg-primary-muted
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative z-10
                        grid gap-8
                        p-6
                        sm:p-8
                        lg:grid-cols-[minmax(0,1fr)_320px]
                        lg:items-end
                        lg:p-10
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                mb-4 inline-flex
                                items-center gap-2
                                rounded-pill
                                border border-primary/15
                                bg-primary-muted
                                px-3 py-1.5
                                text-caption
                                font-bold
                                text-primary
                            "
                        >
                            <RiPaletteLine
                                size={15}
                                aria-hidden="true"
                            />

                            <span>
                                Área exclusiva do administrador
                            </span>
                        </div>

                        <p
                            className="
                                text-overline
                                font-bold uppercase
                                tracking-overline
                                text-primary
                            "
                        >
                            Meu Saldo · Foundation 15
                        </p>

                        <h1
                            className="
                                mt-3 max-w-4xl
                                text-page-title
                                font-bold
                                tracking-heading
                                sm:text-display
                            "
                        >
                            A base visual, estrutural e financeira do sistema.
                        </h1>

                        <p
                            className="
                                mt-4 max-w-3xl
                                text-body
                                text-muted-foreground
                            "
                        >
                            Esta página reúne os tokens e componentes reutilizáveis já
                            aprovados. Nesta etapa, perfil, conta e administração de usuários também passam a usar
                            componentes reutilizáveis para identidade, dados pessoais, funções,
                            status, permissões e ações em qualquer tamanho de tela.
                        </p>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            border border-border
                            bg-surface-elevated/90
                            p-5
                            shadow-sm
                            backdrop-blur
                        "
                    >
                        <p
                            className="
                                text-overline
                                font-bold uppercase
                                tracking-overline
                                text-muted-foreground
                            "
                        >
                            Fonte principal
                        </p>

                        <p
                            className="
                                mt-3 text-page-title
                                font-extrabold
                                tracking-heading
                                text-foreground
                            "
                        >
                            Manrope
                        </p>

                        <p
                            className="
                                mt-2 text-body-sm
                                text-muted-foreground
                            "
                        >
                            Moderna, geométrica e legível para dados,
                            formulários e números financeiros.
                        </p>

                        <div
                            className="
                                mt-5 flex flex-wrap
                                gap-2
                            "
                        >
                            {[400, 500, 600, 700, 800].map(
                                (weight) => (
                                    <span
                                        key={weight}
                                        className="
                                            rounded-pill
                                            border border-border
                                            bg-surface-subtle
                                            px-2.5 py-1
                                            text-caption
                                            text-foreground-soft
                                        "
                                        style={{
                                            fontWeight:
                                                weight,
                                        }}
                                    >
                                        {weight}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div
                className="
                    mt-section
                    grid gap-section
                "
            >
                <FoundationSection
                    icon={RiCursorLine}
                    eyebrow="Componentes · Ações"
                    title="Botões consistentes para todos os fluxos"
                    description="Ações primárias, secundárias, destrutivas e de navegação agora compartilham tamanhos, estados, foco, carregamento e comportamento responsivo."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Variantes
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Cada variante possui uma função clara. A cor
                                    principal fica reservada para a ação mais
                                    importante do contexto.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    leadingIcon={
                                        <RiAddLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Nova transação
                                </Button>

                                <Button
                                    variant="secondary"
                                    leadingIcon={
                                        <RiDownloadLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Exportar
                                </Button>

                                <Button
                                    variant="outline"
                                    leadingIcon={
                                        <RiEditLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Editar
                                </Button>

                                <Button
                                    variant="soft"
                                    leadingIcon={
                                        <RiSettings3Line
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Configurar
                                </Button>

                                <Button variant="ghost">
                                    Cancelar
                                </Button>

                                <Button
                                    variant="danger"
                                    leadingIcon={
                                        <RiDeleteBin6Line
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Excluir
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Tamanhos e ícones
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O tamanho médio será o padrão. O pequeno será
                                    usado em tabelas e o grande em ações de maior
                                    destaque.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <Button
                                        size="sm"
                                        trailingIcon={
                                            <RiArrowRightLine
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Pequeno
                                    </Button>

                                    <Button
                                        size="md"
                                        trailingIcon={
                                            <RiArrowRightLine
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Médio
                                    </Button>

                                    <Button
                                        size="lg"
                                        trailingIcon={
                                            <RiArrowRightLine
                                                size={20}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Grande
                                    </Button>
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Estados
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Carregamento bloqueia novos cliques e mantém a
                                    dimensão do controle. O estado desabilitado é
                                    sempre perceptível.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <Button
                                        loading
                                        loadingText="Salvando"
                                        leadingIcon={
                                            <RiSave3Line
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Salvar
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        disabled
                                    >
                                        Indisponível
                                    </Button>

                                    <Button
                                        variant="outline"
                                        fullWidth
                                        className="sm:w-auto"
                                    >
                                        Responsivo
                                    </Button>
                                </div>
                            </article>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Botões de ícone
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Todas as ações sem texto exigem um nome
                                    acessível e uma área de clique confortável.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <IconButton
                                        size="sm"
                                        variant="outline"
                                        label="Editar item"
                                        icon={
                                            <RiEditLine
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        }
                                    />

                                    <IconButton
                                        variant="soft"
                                        label="Configurações"
                                        icon={
                                            <RiSettings3Line
                                                size={19}
                                                aria-hidden="true"
                                            />
                                        }
                                    />

                                    <IconButton
                                        size="lg"
                                        variant="primary"
                                        label="Adicionar item"
                                        icon={
                                            <RiAddLine
                                                size={22}
                                                aria-hidden="true"
                                            />
                                        }
                                    />

                                    <IconButton
                                        variant="ghost"
                                        label="Mais opções"
                                        icon={
                                            <RiMore2Line
                                                size={20}
                                                aria-hidden="true"
                                            />
                                        }
                                    />

                                    <IconButton
                                        variant="danger"
                                        label="Excluir item"
                                        icon={
                                            <RiDeleteBin6Line
                                                size={19}
                                                aria-hidden="true"
                                            />
                                        }
                                    />
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Grupos de ação
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Ações relacionadas podem ficar agrupadas sem
                                    criar novos containers desnecessários.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <ButtonGroup label="Período do relatório">
                                        <Button
                                            size="sm"
                                            variant="soft"
                                        >
                                            Mês
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                        >
                                            Ano
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                        >
                                            Todo período
                                        </Button>
                                    </ButtonGroup>

                                    <ButtonGroup
                                        label="Visualização da listagem"
                                        attached
                                    >
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                        >
                                            Tabela
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                        >
                                            Cards
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </article>
                        </div>

                        <article className="rounded-xl border border-primary/15 bg-primary-muted p-5">
                            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        Botões de navegação
                                    </h3>

                                    <p className="mt-1 max-w-2xl text-caption text-muted-foreground">
                                        O LinkButton mantém a mesma linguagem dos
                                        botões, mas usa navegação interna ou links
                                        externos semanticamente corretos.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <LinkButton
                                        to="/dashboard"
                                        variant="primary"
                                        trailingIcon={
                                            <RiArrowRightLine
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Abrir dashboard
                                    </LinkButton>

                                    <LinkButton
                                        href="https://fonts.google.com/specimen/Manrope"
                                        external
                                        variant="outline"
                                        trailingIcon={
                                            <RiExternalLinkLine
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Ver Manrope
                                    </LinkButton>
                                </div>
                            </div>
                        </article>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "variant",
                                "size",
                                "loading",
                                "disabled",
                                "fullWidth",
                                "leadingIcon",
                                "trailingIcon",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>

                <FoundationSection
                    icon={RiInputField}
                    eyebrow="Componentes · Formulários"
                    title="Campos claros, acessíveis e previsíveis"
                    description="Labels, mensagens, foco, validação e estados agora seguem a mesma estrutura. Os componentes funcionam isoladamente ou dentro do FormField, sem duplicar estilos em cada tela."
                >
                    <div className="grid gap-7">
                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Campos de texto
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O FormField conecta label, obrigatoriedade, ajuda e
                                    mensagem de validação ao controle automaticamente.
                                </p>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        id="design-system-name"
                                        label="Nome completo"
                                        helperText="Use o nome que será exibido no perfil."
                                        required
                                    >
                                        <Input
                                            placeholder="Patrick Peres"
                                            leadingIcon={
                                                <RiUserLine
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            }
                                        />
                                    </FormField>

                                    <FormField
                                        id="design-system-email"
                                        label="E-mail"
                                        errorMessage="Informe um endereço de e-mail válido."
                                        required
                                    >
                                        <Input
                                            type="email"
                                            defaultValue="patrick@"
                                            leadingIcon={
                                                <RiMailLine
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            }
                                        />
                                    </FormField>
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Pesquisa e valor monetário
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    A pesquisa possui limpeza rápida e o campo monetário
                                    aplica máscara brasileira sem permitir letras.
                                </p>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        id="design-system-search"
                                        label="Pesquisar transação"
                                        optional
                                    >
                                        <SearchInput
                                            value={searchValue}
                                            onValueChange={setSearchValue}
                                            placeholder="Descrição, categoria ou tag"
                                        />
                                    </FormField>

                                    <FormField
                                        id="design-system-value"
                                        label="Valor"
                                        helperText={
                                            currencyValue === null
                                                ? "Digite o valor da movimentação."
                                                : `Valor numérico: ${currencyValue}`
                                        }
                                        required
                                    >
                                        <CurrencyInput
                                            value={currencyValue}
                                            onValueChange={setCurrencyValue}
                                            placeholder="0,00"
                                        />
                                    </FormField>
                                </div>
                            </article>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Senha e conteúdo longo
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O botão de visibilidade é acessível por teclado e o
                                    TextArea pode exibir limite de caracteres.
                                </p>

                                <div className="mt-5 grid gap-5">
                                    <FormField
                                        id="design-system-password"
                                        label="Senha"
                                        helperText="Mínimo de oito caracteres."
                                        required
                                    >
                                        <PasswordInput
                                            defaultValue="MeuSaldo@2026"
                                            autoComplete="new-password"
                                        />
                                    </FormField>

                                    <FormField
                                        id="design-system-description"
                                        label="Descrição"
                                        optional
                                    >
                                        <TextArea
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(event.target.value)
                                            }
                                            maxLength={140}
                                            showCount
                                            resize="vertical"
                                            placeholder="Adicione informações relevantes"
                                        />
                                    </FormField>
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Estados e tamanhos
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Os mesmos estados atendem formulários completos,
                                    filtros compactos e edições dentro de tabelas.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <Input
                                        size="sm"
                                        placeholder="Campo pequeno para filtros"
                                    />

                                    <Input
                                        size="md"
                                        status="success"
                                        defaultValue="Informação validada"
                                        leadingIcon={
                                            <RiBankCardLine
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        }
                                    />

                                    <Input
                                        size="lg"
                                        placeholder="Campo grande para ações principais"
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            defaultValue="Somente leitura"
                                            readOnly
                                        />

                                        <Input
                                            defaultValue="Indisponível"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "label",
                                "helperText",
                                "errorMessage",
                                "successMessage",
                                "required",
                                "optional",
                                "size",
                                "status",
                                "leadingIcon",
                                "onValueChange",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiListCheck2}
                    eyebrow="Componentes · Seleção"
                    title="Escolhas objetivas sem perder contexto"
                    description="Select, Combobox, Checkbox, Radio, Switch e SegmentedControl cobrem escolhas simples, listas pesquisáveis, preferências e filtros compactos com foco acessível e estados consistentes."
                >
                    <div className="grid gap-7">
                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Select e Combobox
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O Select atende listas curtas e previsíveis. O Combobox
                                    pesquisa listas maiores e mantém o menu visível mesmo
                                    dentro de containers com recorte.
                                </p>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        id="design-system-transaction-type"
                                        label="Tipo de movimentação"
                                        required
                                    >
                                        <Select
                                            value={transactionType}
                                            onChange={(event) =>
                                                setTransactionType(event.target.value)
                                            }
                                            options={transactionTypeOptions}
                                        />
                                    </FormField>

                                    <FormField
                                        id="design-system-account"
                                        label="Conta"
                                        helperText="Pesquise pelo nome ou pela descrição."
                                        required
                                    >
                                        <Combobox
                                            value={account}
                                            onValueChange={setAccount}
                                            options={accountOptions}
                                            placeholder="Selecione uma conta"
                                            searchPlaceholder="Pesquisar conta..."
                                        />
                                    </FormField>
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Checkbox
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Caixas de seleção permitem múltiplas decisões e exibem
                                    explicações sem depender de tooltips.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <Checkbox
                                        checked={includeRecurring}
                                        onCheckedChange={setIncludeRecurring}
                                        label="Incluir movimentações recorrentes"
                                        description="Considera recorrências efetivadas no período selecionado."
                                    />

                                    <Checkbox
                                        checked={autoReconcile}
                                        onCheckedChange={setAutoReconcile}
                                        label="Conciliar automaticamente"
                                        description="Relaciona lançamentos semelhantes quando houver segurança."
                                    />

                                    <Checkbox
                                        checked
                                        disabled
                                        label="Proteção contra duplicidade"
                                        description="Obrigatória para todas as importações."
                                    />
                                </div>
                            </article>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-2">
                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Radio
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O RadioGroup comunica uma única escolha entre opções
                                    mutuamente exclusivas.
                                </p>

                                <div className="mt-5">
                                    <RadioGroup
                                        aria-label="Frequência do resumo financeiro"
                                        value={notificationFrequency}
                                        onValueChange={setNotificationFrequency}
                                        options={notificationOptions}
                                    />
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-background p-5">
                                <h3 className="text-card-title font-semibold">
                                    Switch
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Alternâncias são reservadas para configurações que
                                    entram em vigor imediatamente.
                                </p>

                                <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-surface">
                                    <Switch
                                        checked={weeklySummary}
                                        onCheckedChange={setWeeklySummary}
                                        label="Resumo semanal"
                                        description="Receba os principais números da semana."
                                        labelPosition="left"
                                        className="p-4"
                                    />

                                    <Switch
                                        checked={securityAlerts}
                                        onCheckedChange={setSecurityAlerts}
                                        label="Alertas de segurança"
                                        description="Avise sobre acessos e alterações sensíveis."
                                        labelPosition="left"
                                        className="p-4"
                                    />

                                    <Switch
                                        disabled
                                        label="Sincronização bancária"
                                        description="Disponível em uma próxima integração."
                                        labelPosition="left"
                                        className="p-4"
                                    />
                                </div>
                            </article>
                        </div>

                        <article className="rounded-xl border border-primary/15 bg-primary-muted p-5">
                            <div className="grid gap-6 xl:grid-cols-2">
                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        Filtro de período
                                    </h3>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        O SegmentedControl torna alternativas curtas visíveis
                                        sem esconder as opções em um menu.
                                    </p>

                                    <div className="mt-4">
                                        <SegmentedControl
                                            aria-label="Período do relatório"
                                            value={periodMode}
                                            onValueChange={setPeriodMode}
                                            options={periodOptions}
                                            fullWidth
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        Modo de visualização
                                    </h3>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Ícones podem reforçar a leitura quando as opções
                                        representam modos de exibição.
                                    </p>

                                    <div className="mt-4">
                                        <SegmentedControl
                                            aria-label="Modo de visualização"
                                            value={viewMode}
                                            onValueChange={setViewMode}
                                            options={viewOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "options",
                                "value",
                                "defaultValue",
                                "onValueChange",
                                "checked",
                                "onCheckedChange",
                                "disabled",
                                "orientation",
                                "fullWidth",
                                "clearable",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiStackLine}
                    eyebrow="Componentes · Superfícies"
                    title="Estrutura visual sem containers redundantes"
                    description="Surface, Card, CardHeader, CardBody, CardFooter, Section e Divider criam níveis claros de agrupamento. Cada componente possui uma função específica, evitando cards dentro de cards apenas para controlar espaçamento."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Níveis de superfície
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Surface oferece fundos semânticos para agrupar conteúdo
                                    sem impor a estrutura completa de um card.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <Surface variant="default" padding="lg">
                                    <p className="text-body-sm font-semibold">
                                        Default
                                    </p>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Conteúdo principal sobre a superfície padrão.
                                    </p>
                                </Surface>

                                <Surface variant="subtle" padding="lg">
                                    <p className="text-body-sm font-semibold">
                                        Subtle
                                    </p>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Agrupamento secundário com contraste discreto.
                                    </p>
                                </Surface>

                                <Surface variant="primary" padding="lg">
                                    <p className="text-body-sm font-semibold">
                                        Primary
                                    </p>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Destaque relacionado à ação ou seleção principal.
                                    </p>
                                </Surface>

                                <Surface variant="elevated" padding="lg">
                                    <p className="text-body-sm font-semibold">
                                        Elevated
                                    </p>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Elementos que realmente precisam de elevação.
                                    </p>
                                </Surface>
                            </div>
                        </div>

                        <Divider label="Composição de card" />

                        <div className="grid gap-5 xl:grid-cols-2">
                            <Card>
                                <CardHeader
                                    icon={RiWallet3Line}
                                    eyebrow="Resumo mensal"
                                    title="Saldo disponível"
                                    description="Visão consolidada das movimentações confirmadas."
                                    action={
                                        <IconButton
                                            icon={RiMore2Line}
                                            variant="ghost"
                                            size="sm"
                                            aria-label="Abrir ações do saldo"
                                        />
                                    }
                                    divider
                                />

                                <CardBody>
                                    <p className="text-caption font-semibold text-muted-foreground">
                                        Saldo atual
                                    </p>

                                    <p className="mt-2 text-page-title font-extrabold tracking-heading tabular-nums">
                                        R$ 8.420,70
                                    </p>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <Surface variant="subtle" padding="sm" radius="lg">
                                            <p className="text-caption text-muted-foreground">
                                                Receitas
                                            </p>

                                            <p className="mt-1 text-body-sm font-bold text-success tabular-nums">
                                                R$ 10.890,00
                                            </p>
                                        </Surface>

                                        <Surface variant="subtle" padding="sm" radius="lg">
                                            <p className="text-caption text-muted-foreground">
                                                Despesas
                                            </p>

                                            <p className="mt-1 text-body-sm font-bold text-danger tabular-nums">
                                                R$ 2.469,30
                                            </p>
                                        </Surface>
                                    </div>
                                </CardBody>

                                <CardFooter>
                                    <span className="text-caption text-muted-foreground">
                                        Atualizado há poucos segundos
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        trailingIcon={RiArrowRightLine}
                                    >
                                        Ver detalhes
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card variant="subtle">
                                <CardHeader
                                    icon={RiSettings3Line}
                                    title="Preferências financeiras"
                                    description="Um card secundário mantém a hierarquia sem competir com o conteúdo principal."
                                />

                                <CardBody className="pt-0">
                                    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
                                        <div className="flex items-center justify-between gap-4 p-4">
                                            <div>
                                                <p className="text-body-sm font-semibold">
                                                    Fechamento mensal
                                                </p>

                                                <p className="mt-0.5 text-caption text-muted-foreground">
                                                    Primeiro dia de cada mês
                                                </p>
                                            </div>

                                            <span className="text-body-sm font-bold text-primary">
                                                Dia 1
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 p-4">
                                            <div>
                                                <p className="text-body-sm font-semibold">
                                                    Moeda padrão
                                                </p>

                                                <p className="mt-0.5 text-caption text-muted-foreground">
                                                    Aplicada a novos lançamentos
                                                </p>
                                            </div>

                                            <span className="text-body-sm font-bold">
                                                BRL
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>

                                <CardFooter align="end" divider={false} className="pt-0">
                                    <Button variant="outline" size="sm">
                                        Configurar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <Divider label="Section e cards interativos" />

                        <Section
                            icon={RiBankCardLine}
                            eyebrow="Contas"
                            title="Escolha onde visualizar os dados"
                            description="Section organiza título, descrição, ação e conteúdo sem adicionar outra caixa ao redor de tudo."
                            action={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leadingIcon={RiAddLine}
                                >
                                    Nova conta
                                </Button>
                            }
                        >
                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        title: "Conta principal",
                                        detail: "R$ 6.210,40",
                                        meta: "Banco Meu Saldo · 2048",
                                    },
                                    {
                                        title: "Carteira",
                                        detail: "R$ 730,00",
                                        meta: "Saldo em dinheiro",
                                    },
                                    {
                                        title: "Reserva",
                                        detail: "R$ 1.480,30",
                                        meta: "Objetivos e segurança",
                                    },
                                ].map((item) => (
                                    <Card
                                        key={item.title}
                                        as="button"
                                        type="button"
                                        variant="interactive"
                                        padding="lg"
                                        className="text-left"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
                                                <RiWallet3Line
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </span>

                                            <RiArrowRightLine
                                                size={18}
                                                className="text-subtle-foreground"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <p className="mt-5 text-body-sm font-semibold">
                                            {item.title}
                                        </p>

                                        <p className="mt-1 text-section-title font-extrabold tabular-nums">
                                            {item.detail}
                                        </p>

                                        <p className="mt-2 text-caption text-muted-foreground">
                                            {item.meta}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </Section>

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    Divisores
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Divisores separam grupos relacionados sem exigir uma
                                    nova superfície em cada bloco.
                                </p>

                                <div className="mt-5 grid gap-5">
                                    <Divider />
                                    <Divider label="ou continue com" />
                                    <Divider label="Informações adicionais" labelAlign="start" />

                                    <div className="flex min-h-12 items-stretch gap-4">
                                        <span className="flex items-center text-body-sm font-semibold">
                                            Receita
                                        </span>

                                        <Divider orientation="vertical" />

                                        <span className="flex items-center text-body-sm font-semibold">
                                            Despesa
                                        </span>

                                        <Divider orientation="vertical" />

                                        <span className="flex items-center text-body-sm font-semibold">
                                            Saldo
                                        </span>
                                    </div>
                                </div>
                            </Surface>

                            <Surface variant="primary" padding="lg">
                                <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                    Regra de composição
                                </p>

                                <p className="mt-3 text-card-title font-semibold">
                                    Uma superfície por nível de informação.
                                </p>

                                <p className="mt-2 text-body-sm text-muted-foreground">
                                    Espaçamento, divisores e tipografia devem resolver a
                                    maioria dos agrupamentos antes de adicionar outro card.
                                </p>
                            </Surface>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "variant",
                                "radius",
                                "padding",
                                "divider",
                                "align",
                                "orientation",
                                "label",
                                "action",
                                "as",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiNotification3Line}
                    eyebrow="Componentes · Feedback e sobreposição"
                    title="Elementos flutuantes previsíveis e estados claros"
                    description="Modal, Drawer, Popover, DropdownMenu, Tooltip, Alert, Snackbar, estados vazios, erros, carregamento e skeleton compartilham movimento, elevação, fechamento por teclado e adaptação para telas menores."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Modais, drawers e confirmação
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Sobreposições bloqueiam a rolagem da página, preservam o
                                    foco do teclado e devolvem o foco ao elemento que abriu o fluxo.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <Card variant="outlined" padding="lg">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
                                        <RiInputField size={20} aria-hidden="true" />
                                    </span>

                                    <h3 className="mt-5 text-card-title font-semibold">
                                        Modal de formulário
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        Para criação e edição de informações com contexto curto.
                                    </p>

                                    <Button
                                        variant="outline"
                                        fullWidth
                                        className="mt-5"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Abrir modal
                                    </Button>
                                </Card>

                                <Card variant="outlined" padding="lg">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-info-muted text-info">
                                        <RiFilter3Line size={20} aria-hidden="true" />
                                    </span>

                                    <h3 className="mt-5 text-card-title font-semibold">
                                        Drawer de filtros
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        Ideal para filtros, detalhes e ações auxiliares no mobile.
                                    </p>

                                    <Button
                                        variant="outline"
                                        fullWidth
                                        className="mt-5"
                                        onClick={() => setDrawerOpen(true)}
                                    >
                                        Abrir drawer
                                    </Button>
                                </Card>

                                <Card variant="outlined" padding="lg" className="sm:col-span-2 xl:col-span-1">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-danger-muted text-danger">
                                        <RiErrorWarningLine size={20} aria-hidden="true" />
                                    </span>

                                    <h3 className="mt-5 text-card-title font-semibold">
                                        Confirmação destrutiva
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        Confirma ações irreversíveis sem repetir estrutura de modal.
                                    </p>

                                    <Button
                                        variant="danger"
                                        fullWidth
                                        className="mt-5"
                                        onClick={() => setConfirmOpen(true)}
                                    >
                                        Excluir exemplo
                                    </Button>
                                </Card>
                            </div>
                        </div>

                        <Divider label="Elementos ancorados" />

                        <div className="grid gap-5 xl:grid-cols-2">
                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    Popover e tooltip
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O posicionamento acompanha o controle de origem e permanece
                                    dentro da área visível da janela.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <Popover
                                        placement="bottom-start"
                                        trigger={
                                            <Button
                                                variant="outline"
                                                leadingIcon={<RiFilter3Line size={18} aria-hidden="true" />}
                                            >
                                                Resumo dos filtros
                                            </Button>
                                        }
                                    >
                                        <div className="w-64">
                                            <p className="text-body-sm font-bold">
                                                Filtros ativos
                                            </p>

                                            <div className="mt-3 grid gap-2 text-body-sm text-muted-foreground">
                                                <div className="flex justify-between gap-4">
                                                    <span>Período</span>
                                                    <strong className="font-semibold text-foreground">Julho de 2026</strong>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span>Tipo</span>
                                                    <strong className="font-semibold text-foreground">Despesas</strong>
                                                </div>
                                            </div>

                                            <Button variant="ghost" size="sm" fullWidth className="mt-3">
                                                Limpar filtros
                                            </Button>
                                        </div>
                                    </Popover>

                                    <Tooltip content="Atualiza os dados desta seção" placement="top">
                                        <IconButton
                                            icon={<RiRefreshLine size={19} aria-hidden="true" />}
                                            label="Atualizar dados"
                                            variant="soft"
                                        />
                                    </Tooltip>

                                    <Tooltip content="As alterações são salvas automaticamente" placement="bottom">
                                        <span
                                            tabIndex={0}
                                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-body-sm font-medium text-foreground-soft"
                                        >
                                            <RiInformationLine size={17} aria-hidden="true" />
                                            Passe o mouse
                                        </span>
                                    </Tooltip>
                                </div>
                            </Surface>

                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    Menu de ações
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Ações relacionadas permanecem compactas e navegáveis pelas setas do teclado.
                                </p>

                                <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-surface-subtle p-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-body-sm font-semibold">
                                            Assinatura de software
                                        </p>
                                        <p className="mt-1 text-caption text-muted-foreground">
                                            R$ 89,90 · 15 jul. 2026
                                        </p>
                                    </div>

                                    <DropdownMenu
                                        trigger={
                                            <IconButton
                                                icon={<RiMore2Line size={20} aria-hidden="true" />}
                                                label="Abrir ações da transação"
                                                variant="ghost"
                                            />
                                        }
                                    >
                                        <DropdownMenuLabel>Transação</DropdownMenuLabel>
                                        <DropdownMenuItem icon={RiEditLine}>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem icon={RiDownloadLine}>
                                            Exportar comprovante
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem icon={RiDeleteBin6Line} danger>
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                </div>
                            </Surface>
                        </div>

                        <Divider label="Mensagens de sistema" />

                        <div className="grid gap-4 xl:grid-cols-2">
                            <Alert
                                variant="success"
                                title="Alterações salvas"
                            >
                                Os dados financeiros foram atualizados com sucesso.
                            </Alert>

                            <Alert
                                variant="info"
                                title="Sincronização em andamento"
                                action={
                                    <Button variant="ghost" size="sm">
                                        Ver detalhes
                                    </Button>
                                }
                            >
                                Novas movimentações podem aparecer nos próximos minutos.
                            </Alert>

                            <Alert
                                variant="warning"
                                title="Atenção ao período"
                            >
                                O relatório inclui transações pendentes e confirmadas.
                            </Alert>

                            <Alert
                                variant="danger"
                                title="Não foi possível concluir"
                            >
                                Revise sua conexão e tente novamente.
                            </Alert>

                            {dismissibleAlertVisible ? (
                                <Alert
                                    variant="neutral"
                                    title="Aviso dispensável"
                                    onDismiss={() => setDismissibleAlertVisible(false)}
                                    className="xl:col-span-2"
                                >
                                    Este exemplo demonstra mensagens que o usuário pode remover da tela.
                                </Alert>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-self-start xl:col-span-2"
                                    onClick={() => setDismissibleAlertVisible(true)}
                                >
                                    Restaurar aviso
                                </Button>
                            )}
                        </div>

                        <Surface variant="primary" padding="lg">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        Snackbar temporário
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Confirma ações sem interromper o fluxo atual do usuário.
                                    </p>
                                </div>

                                <Button
                                    leadingIcon={<RiCheckboxCircleLine size={18} aria-hidden="true" />}
                                    onClick={() => setSnackbarOpen(true)}
                                >
                                    Exibir snackbar
                                </Button>
                            </div>
                        </Surface>

                        <Divider label="Estados de conteúdo" />

                        <div className="grid gap-5 xl:grid-cols-3">
                            <EmptyState
                                compact
                                icon={RiFolderOpenLine}
                                title="Nenhuma transação"
                                description="Ainda não existem movimentações para os filtros selecionados."
                                action={
                                    <Button size="sm" leadingIcon={<RiAddLine size={16} aria-hidden="true" />}>
                                        Nova transação
                                    </Button>
                                }
                            />

                            <ErrorState
                                compact
                                title="Falha ao carregar"
                                description="Não conseguimos buscar os dados desta seção."
                                action={
                                    <Button size="sm" variant="outline" leadingIcon={<RiRefreshLine size={16} aria-hidden="true" />}>
                                        Tentar novamente
                                    </Button>
                                }
                            />

                            <LoadingState
                                compact
                                title="Carregando dados"
                                description="Aguarde enquanto preparamos as informações financeiras."
                            />
                        </div>

                        <Card variant="outlined">
                            <CardHeader
                                title="Skeleton de tabela"
                                description="Mantém a estrutura da página estável durante carregamentos curtos."
                                divider
                            />

                            <CardBody className="grid gap-4">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="grid grid-cols-[40px_minmax(0,1fr)_80px] items-center gap-3"
                                    >
                                        <Skeleton width="40px" height="40px" radius="lg" />
                                        <div className="min-w-0">
                                            <Skeleton width="42%" height="0.875rem" />
                                            <SkeletonText lines={1} className="mt-2 max-w-xs" />
                                        </div>
                                        <Skeleton width="80px" height="0.875rem" className="justify-self-end" />
                                    </div>
                                ))}
                            </CardBody>
                        </Card>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "open",
                                "onOpenChange",
                                "placement",
                                "position",
                                "variant",
                                "duration",
                                "closeOnEscape",
                                "closeOnBackdrop",
                                "compact",
                                "action",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiCalendarLine}
                    eyebrow="Componentes · Data e período"
                    title="Seletores de data consistentes em qualquer tela"
                    description="Campos de data, calendário, seleção de mês, ano e período agora compartilham formatação brasileira, limites, estados, teclado e comportamento responsivo. No mobile, os seletores abrem em um drawer inferior para não serem cortados pela tela."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Campos de data
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O campo não utiliza o calendário nativo do navegador. A mesma
                                    experiência será mantida no Chrome, Firefox, Edge e dispositivos móveis.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                <FormField
                                    label="Data do lançamento"
                                    helperText="Seleção controlada pelo componente."
                                >
                                    <DateField
                                        value={exampleDate}
                                        onChange={setExampleDate}
                                    />
                                </FormField>

                                <FormField
                                    label="Data com limite"
                                    helperText="Disponível entre 15 e 31 de julho."
                                >
                                    <DateField
                                        value={limitedDate}
                                        onChange={setLimitedDate}
                                        min="2026-07-15"
                                        max="2026-07-31"
                                    />
                                </FormField>

                                <FormField label="Somente leitura">
                                    <DateField
                                        value="2026-07-24"
                                        readOnly
                                    />
                                </FormField>

                                <FormField label="Campo desabilitado">
                                    <DateField
                                        value="2026-08-05"
                                        disabled
                                    />
                                </FormField>
                            </div>
                        </div>

                        <Divider label="Calendário e seletores" />

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                            <Card variant="outlined">
                                <CardHeader
                                    title="Calendar"
                                    description="Calendário reutilizável para formulários, filtros e fluxos de recorrência."
                                    divider
                                />

                                <CardBody>
                                    <div className="mx-auto max-w-sm">
                                        <Calendar
                                            value={calendarDate}
                                            onChange={setCalendarDate}
                                            min="2026-06-01"
                                            max="2026-09-30"
                                            isDateDisabled={(date) => date.getDay() === 0}
                                        />
                                    </div>
                                </CardBody>

                                <CardFooter divider>
                                    <p className="text-caption text-muted-foreground">
                                        Data selecionada: <strong className="font-semibold text-foreground">{calendarDate}</strong>
                                    </p>
                                </CardFooter>
                            </Card>

                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                                <Surface variant="outlined" padding="lg">
                                    <h3 className="text-card-title font-semibold">
                                        MonthPicker
                                    </h3>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Seleção compacta de mês para contextos em que o ano já está definido.
                                    </p>

                                    <MonthPicker
                                        year={2026}
                                        value={monthOnly}
                                        onChange={setMonthOnly}
                                        min="2026-03"
                                        max="2026-11"
                                        className="mt-5"
                                    />
                                </Surface>

                                <Surface variant="outlined" padding="lg">
                                    <h3 className="text-card-title font-semibold">
                                        YearPicker
                                    </h3>

                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Navegação paginada para históricos e relatórios anuais.
                                    </p>

                                    <YearPicker
                                        value={selectedYear}
                                        onChange={setSelectedYear}
                                        minYear={2020}
                                        maxYear={2035}
                                        className="mt-5"
                                    />
                                </Surface>
                            </div>
                        </div>

                        <Divider label="Mês, ano e período" />

                        <div className="grid gap-5 lg:grid-cols-2">
                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    MonthYearPicker
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    O usuário alterna entre ano e mês sem sair do mesmo seletor.
                                </p>

                                <div className="mx-auto mt-5 max-w-sm">
                                    <MonthYearPicker
                                        value={monthYear}
                                        onChange={setMonthYear}
                                        min="2022-01"
                                        max="2030-12"
                                    />
                                </div>

                                <div className="mt-5 rounded-lg bg-surface-subtle px-3 py-2 text-center text-caption text-muted-foreground">
                                    Valor salvo: <strong className="font-semibold text-foreground">{monthYear}</strong>
                                </div>
                            </Surface>

                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    PeriodPicker
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Componente único para Todo período, Mês e Ano, ideal para Dashboard, Histórico, Receitas e Despesas.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <PeriodPicker
                                        value={dashboardPeriod}
                                        onChange={setDashboardPeriod}
                                        minMonth="2020-01"
                                        maxMonth="2035-12"
                                        minYear={2020}
                                        maxYear={2035}
                                    />

                                    <span className="rounded-pill border border-border bg-surface-subtle px-3 py-1.5 text-caption text-muted-foreground">
                                        modo: <strong className="font-semibold text-foreground">{dashboardPeriod.mode}</strong>
                                    </span>
                                </div>

                                <div className="mt-5 rounded-xl border border-border bg-surface-subtle p-4">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Comportamento responsivo
                                    </p>
                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        No desktop, o seletor abre como popover ancorado. Em telas pequenas,
                                        o mesmo conteúdo vira um drawer inferior com área de toque confortável.
                                    </p>
                                </div>
                            </Surface>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "value",
                                "onChange",
                                "min",
                                "max",
                                "isDateDisabled",
                                "clearable",
                                "readOnly",
                                "mode",
                                "minYear",
                                "maxYear",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiPriceTag3Line}
                    eyebrow="Componentes · Tags e categorias"
                    title="Identificação compacta sem poluir tabelas"
                    description="TagBadge, TagGroup, TagOverflow, CategoryBadge, TagSelector, TagColorPicker, TagScopeSelect e TagCreateForm padronizam tamanho, contraste, excesso de itens, criação e seleção. Categoria e tag permanecem visualmente distintas."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Tags em tabelas
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    A linha mantém altura previsível: duas tags ficam visíveis e o restante é agrupado em um popover compacto.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-border bg-surface">
                                <div className="hidden grid-cols-[minmax(15rem,1.5fr)_minmax(10rem,1fr)_minmax(11rem,1fr)_7rem] items-center gap-4 border-b border-border bg-surface-subtle px-4 py-3 text-overline font-bold uppercase tracking-overline text-muted-foreground md:grid">
                                    <span>Movimentação</span>
                                    <span>Categoria</span>
                                    <span>Tags</span>
                                    <span className="text-right">Valor</span>
                                </div>

                                {[
                                    {
                                        description: "Supermercado do mês",
                                        date: "16 de julho de 2026",
                                        category: "Alimentação",
                                        categoryTone: "expense",
                                        tags: designTags.filter((tag) => [1, 2, 5, 6].includes(Number(tag.id))),
                                        amount: "− R$ 487,90",
                                        amountClassName: "text-danger-strong",
                                    },
                                    {
                                        description: "Pagamento mensal",
                                        date: "05 de julho de 2026",
                                        category: "Salário",
                                        categoryTone: "income",
                                        tags: designTags.filter((tag) => [3, 4].includes(Number(tag.id))),
                                        amount: "+ R$ 4.850,00",
                                        amountClassName: "text-success-strong",
                                    },
                                ].map((transaction) => (
                                    <article
                                        key={transaction.description}
                                        className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[minmax(15rem,1.5fr)_minmax(10rem,1fr)_minmax(11rem,1fr)_7rem] md:items-center md:gap-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-body-sm font-semibold text-foreground">
                                                {transaction.description}
                                            </p>

                                            <p className="mt-0.5 text-caption text-muted-foreground">
                                                {transaction.date}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="mb-1 block text-overline font-bold uppercase tracking-overline text-muted-foreground md:hidden">
                                                Categoria
                                            </span>

                                            <CategoryBadge
                                                label={transaction.category}
                                                tone={transaction.categoryTone}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <span className="mb-1 block text-overline font-bold uppercase tracking-overline text-muted-foreground md:hidden">
                                                Tags
                                            </span>

                                            <TagGroup
                                                tags={transaction.tags}
                                                maxVisible={2}
                                                overflowPlacement="bottom-start"
                                            />
                                        </div>

                                        <p className={`text-body-sm font-bold tabular-nums md:text-right ${transaction.amountClassName}`}>
                                            {transaction.amount}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <Divider label="Variações e comportamento" />

                        <div className="grid gap-5 xl:grid-cols-2">
                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    TagBadge e TagGroup
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    A cor identifica a tag sem pintar a linha inteira. O texto é truncado e o nome completo permanece disponível no tooltip nativo.
                                </p>

                                <div className="mt-5 grid gap-5">
                                    <div>
                                        <p className="mb-2 text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                            Tamanhos
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <TagBadge tag={designTags[0]} size="sm" />
                                            <TagBadge tag={designTags[1]} size="md" />
                                            <TagBadge
                                                label="Nome extenso que não altera a largura da tabela"
                                                color="#0891B2"
                                                maxWidth="13rem"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                            Selecionadas e removíveis
                                        </p>

                                        <TagGroup
                                            tags={removableTags}
                                            maxVisible={6}
                                            removable
                                            onRemove={(removedTag) => {
                                                setRemovableTags((current) => current.filter(
                                                    (tag) => String(tag.id) !== String(removedTag.id)
                                                ));
                                            }}
                                            emptyFallback={
                                                <p className="text-caption text-muted-foreground">
                                                    Todas as tags foram removidas.
                                                </p>
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className="mb-2 text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                            Categoria não é tag
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            <CategoryBadge label="Moradia" tone="expense" />
                                            <CategoryBadge label="Salário" tone="income" />
                                            <CategoryBadge label="Recorrente" tone="recurring" />
                                            <CategoryBadge label="Sem categoria" />
                                        </div>
                                    </div>
                                </div>
                            </Surface>

                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    Cor e escopo
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    A paleta é controlada para preservar contraste nos temas claro e escuro. O banco pode continuar armazenando o hexadecimal.
                                </p>

                                <div className="mt-5 grid gap-5">
                                    <TagColorPicker
                                        legend="Cor da tag"
                                        value={tagPreviewColor}
                                        onChange={setTagPreviewColor}
                                    />

                                    <div>
                                        <p className="mb-2 text-body-sm font-semibold tracking-label text-foreground-soft">
                                            Disponível em
                                        </p>

                                        <TagScopeSelect
                                            value={tagPreviewScope}
                                            onChange={setTagPreviewScope}
                                        />
                                    </div>

                                    <div className="rounded-xl border border-border bg-surface-subtle p-4">
                                        <p className="text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                            Pré-visualização
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <TagBadge
                                                label="Nova organização"
                                                color={tagPreviewColor}
                                                size="md"
                                            />

                                            <span className="text-caption text-muted-foreground">
                                                {tagPreviewScope === "INCOME"
                                                    ? "Somente receitas"
                                                    : tagPreviewScope === "EXPENSE"
                                                      ? "Somente despesas"
                                                      : "Receitas e despesas"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Surface>
                        </div>

                        <Divider label="Seleção e criação" />

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
                            <Surface variant="outlined" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    TagSelector
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Pesquisa, múltipla seleção, limite, limpeza e criação funcionam no mesmo fluxo. No mobile, o popover vira drawer inferior.
                                </p>

                                <div className="mt-5 grid gap-5">
                                    <FormField
                                        label="Tags da movimentação"
                                        helperText="Selecione até quatro tags para este exemplo."
                                    >
                                        <TagSelector
                                            options={designTags}
                                            value={selectedTagIds}
                                            onValueChange={setSelectedTagIds}
                                            maxSelected={4}
                                            allowCreate
                                            defaultCreateScope="BOTH"
                                            onCreate={(payload) => {
                                                const createdTag = {
                                                    ...payload,
                                                    id: Date.now(),
                                                };

                                                setDesignTags((current) => [
                                                    ...current,
                                                    createdTag,
                                                ]);

                                                return createdTag;
                                            }}
                                        />
                                    </FormField>

                                    <div className="rounded-xl border border-border bg-surface-subtle p-4">
                                        <p className="text-overline font-bold uppercase tracking-overline text-muted-foreground">
                                            Resultado controlado
                                        </p>

                                        <div className="mt-3">
                                            <TagGroup
                                                tags={designTags.filter((tag) => selectedTagIds.some(
                                                    (tagId) => String(tagId) === String(tag.id)
                                                ))}
                                                maxVisible={6}
                                                emptyFallback={
                                                    <p className="text-caption text-muted-foreground">
                                                        Nenhuma tag selecionada.
                                                    </p>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Surface>

                            <Surface variant="subtle" padding="lg">
                                <h3 className="text-card-title font-semibold">
                                    TagCreateForm
                                </h3>

                                <p className="mt-1 text-caption text-muted-foreground">
                                    Formulário independente para modais, drawers ou áreas administrativas, sem acoplamento direto ao serviço da API.
                                </p>

                                <div className="mt-5">
                                    <TagCreateForm
                                        existingTags={designTags}
                                        onSubmit={(payload) => {
                                            const createdTag = {
                                                ...payload,
                                                id: Date.now(),
                                            };

                                            setDesignTags((current) => [
                                                ...current,
                                                createdTag,
                                            ]);

                                            setSnackbarOpen(true);

                                            return createdTag;
                                        }}
                                    />
                                </div>
                            </Surface>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "tag",
                                "color",
                                "scope",
                                "maxVisible",
                                "removable",
                                "options",
                                "value",
                                "onValueChange",
                                "maxSelected",
                                "allowCreate",
                                "onCreate",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiLayoutGridLine}
                    eyebrow="Estrutura · Aplicação e páginas"
                    title="Uma base única para navegação, conteúdo e responsividade"
                    description="AppShell, Sidebar, SidebarBrand, SidebarNavigation, SidebarAccount, Topbar, Page, PageHeader, PageActions, PageToolbar, PageSection e PageGrid definem a estrutura antes que qualquer tela seja refatorada."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        AppShell em desktop
                                    </h3>

                                    <p className="mt-1 max-w-3xl text-caption text-muted-foreground">
                                        O menu pode ser recolhido sem alterar a área útil da página. A Topbar possui um único controle por tamanho de tela e o conteúdo central mantém rolagem independente.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-pill border border-border bg-surface-subtle px-3 py-1.5 text-caption font-semibold text-muted-foreground">
                                    Use o botão da Topbar para recolher
                                </span>
                            </div>

                            <AppShell
                                embedded
                                displayMode="desktop"
                                defaultCollapsed={false}
                                sidebar={<DesignSystemSidebar />}
                                topbar={<DesignSystemTopbar />}
                            >
                                <ShellPreviewContent />
                            </AppShell>
                        </div>

                        <Divider label="Comportamento mobile" />

                        <div className="grid items-start gap-5 xl:grid-cols-[minmax(20rem,0.56fr)_minmax(0,1fr)]">
                            <div className="mx-auto w-full max-w-[390px]">
                                <AppShell
                                    embedded
                                    displayMode="mobile"
                                    sidebar={<DesignSystemSidebar />}
                                    topbar={<DesignSystemTopbar />}
                                    style={{
                                        height: "620px",
                                        minHeight: "620px",
                                    }}
                                >
                                    <ShellPreviewContent compact />
                                </AppShell>

                                <p className="mt-3 text-center text-caption text-muted-foreground">
                                    Toque no menu da Topbar para abrir a Sidebar como drawer.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                <Surface variant="outlined" padding="lg">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        AppShell
                                    </p>

                                    <h3 className="mt-2 text-card-title font-semibold">
                                        Estado e comportamento ficam centralizados
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        O componente controla recolhimento, preferência persistida, abertura mobile, tecla Escape, bloqueio da rolagem e sobreposição. Sidebar e Topbar acessam essas ações pelo mesmo contexto.
                                    </p>
                                </Surface>

                                <Surface variant="outlined" padding="lg">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Sidebar
                                    </p>

                                    <h3 className="mt-2 text-card-title font-semibold">
                                        Navegação composta, não monolítica
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        Marca, grupos de navegação e conta são peças independentes. Itens podem usar rotas, botões, badges, estados ativos e permissões sem duplicar o layout inteiro.
                                    </p>
                                </Surface>

                                <Surface variant="outlined" padding="lg">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Topbar
                                    </p>

                                    <h3 className="mt-2 text-card-title font-semibold">
                                        Slots para contexto e ações
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        Título, descrição, ações globais e conta são opcionais. Em telas pequenas aparece apenas o controle mobile; em desktop aparece apenas o recolhimento lateral.
                                    </p>
                                </Surface>
                            </div>
                        </div>

                        <Divider label="Anatomia de página" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    name: "Page + PageGrid",
                                    description:
                                        "Controlam largura máxima, respiro lateral, densidade e grades adaptativas sem valores espalhados por cada tela.",
                                },
                                {
                                    name: "PageHeader + PageActions",
                                    description:
                                        "Mantêm título, descrição, metadados e ações alinhados. No mobile, as ações descem sem comprimir o conteúdo.",
                                },
                                {
                                    name: "PageToolbar",
                                    description:
                                        "Agrupa pesquisa, filtros, período e visualização. Pode ser sutil, transparente ou fixa durante a rolagem.",
                                },
                                {
                                    name: "PageSection",
                                    description:
                                        "Organiza blocos de conteúdo sem obrigar o uso de card, evitando containers redundantes e alturas artificiais.",
                                },
                            ].map((item) => (
                                <article
                                    key={item.name}
                                    className="rounded-xl border border-border bg-surface-subtle p-5"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="flex size-8 items-center justify-center rounded-lg bg-primary-muted text-primary"
                                    >
                                        <RiCheckLine size={17} />
                                    </span>

                                    <h3 className="mt-4 text-card-title font-semibold">
                                        {item.name}
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "collapsed",
                                "defaultCollapsed",
                                "storageKey",
                                "displayMode",
                                "embedded",
                                "sections",
                                "active",
                                "badge",
                                "actions",
                                "maxWidth",
                                "spacing",
                                "columns",
                                "sticky",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>



                <FoundationSection
                    icon={RiTableLine}
                    eyebrow="Dados · Tabelas e listas"
                    title="Informações densas sem perder legibilidade"
                    description="DataTable, cabeçalhos, células, ordenação, menu de ações, paginação e cards mobile compartilham a mesma hierarquia visual. As telas poderão trocar a fonte dos dados sem recriar a estrutura."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-card-title font-semibold">
                                        Tabela responsiva de movimentações
                                    </h3>

                                    <p className="mt-1 max-w-3xl text-caption text-muted-foreground">
                                        Em telas médias e grandes, os dados aparecem em colunas previsíveis. No mobile, o mesmo conteúdo é reorganizado em cards compactos, sem rolagem horizontal obrigatória.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-pill border border-border bg-surface-subtle px-3 py-1.5 text-caption font-semibold text-muted-foreground">
                                    Redimensione a janela para testar
                                </span>
                            </div>

                            <ResponsiveDataView
                                breakpoint="md"
                                desktop={
                                    <DataTable
                                        aria-label="Exemplo de movimentações financeiras"
                                        density="default"
                                        stickyHeader
                                        footer={
                                            <Pagination
                                                currentPage={tablePage}
                                                totalPages={8}
                                                totalItems={38}
                                                pageSize={5}
                                                itemLabel="movimentações"
                                                onPageChange={setTablePage}
                                            />
                                        }
                                    >
                                        <DataTableHeader>
                                            <DataTableRow hoverable={false}>
                                                <DataTableHead
                                                    sortDirection={tableSort.key === "description" ? tableSort.direction : "none"}
                                                    className="min-w-64"
                                                >
                                                    <DataTableSortButton
                                                        direction={tableSort.key === "description" ? tableSort.direction : undefined}
                                                        onSort={(direction) => handleTableSort("description", direction)}
                                                    >
                                                        Movimentação
                                                    </DataTableSortButton>
                                                </DataTableHead>

                                                <DataTableHead className="min-w-52">
                                                    Classificação
                                                </DataTableHead>

                                                <DataTableHead
                                                    sortDirection={tableSort.key === "dateKey" ? tableSort.direction : "none"}
                                                >
                                                    <DataTableSortButton
                                                        direction={tableSort.key === "dateKey" ? tableSort.direction : undefined}
                                                        onSort={(direction) => handleTableSort("dateKey", direction)}
                                                    >
                                                        Data
                                                    </DataTableSortButton>
                                                </DataTableHead>

                                                <DataTableHead className="min-w-40">
                                                    Conta
                                                </DataTableHead>

                                                <DataTableHead
                                                    align="right"
                                                    sortDirection={tableSort.key === "amountValue" ? tableSort.direction : "none"}
                                                >
                                                    <DataTableSortButton
                                                        direction={tableSort.key === "amountValue" ? tableSort.direction : undefined}
                                                        onSort={(direction) => handleTableSort("amountValue", direction)}
                                                        className="ml-auto"
                                                    >
                                                        Valor
                                                    </DataTableSortButton>
                                                </DataTableHead>

                                                <DataTableHead
                                                    align="right"
                                                    className="w-14"
                                                >
                                                    <span className="sr-only">Ações</span>
                                                </DataTableHead>
                                            </DataTableRow>
                                        </DataTableHeader>

                                        <DataTableBody>
                                            {sortedTableTransactions.map((transaction) => {
                                                const TransactionIcon = transaction.icon;

                                                return (
                                                    <DataTableRow key={transaction.id}>
                                                        <DataTableCell>
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                                                                    <TransactionIcon size={17} aria-hidden="true" />
                                                                </span>

                                                                <div className="min-w-0">
                                                                    <p className="truncate font-bold text-foreground">
                                                                        {transaction.description}
                                                                    </p>

                                                                    <p className="mt-0.5 text-caption text-muted-foreground">
                                                                        Lançamento #{String(transaction.id).padStart(4, "0")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </DataTableCell>

                                                        <DataTableCell>
                                                            <div className="grid gap-2">
                                                                <CategoryBadge
                                                                    label={transaction.category}
                                                                    tone={transaction.type}
                                                                    className="w-fit"
                                                                />

                                                                <TagGroup
                                                                    tags={transaction.tags}
                                                                    maxVisible={2}
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        </DataTableCell>

                                                        <DataTableCell muted>
                                                            {transaction.date}
                                                        </DataTableCell>

                                                        <DataTableCell muted>
                                                            {transaction.account}
                                                        </DataTableCell>

                                                        <DataTableCell
                                                            align="right"
                                                            numeric
                                                            className={`font-extrabold ${
                                                                transaction.type === "income"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                            }`}
                                                        >
                                                            {transaction.amount}
                                                        </DataTableCell>

                                                        <DataTableCell align="right">
                                                            <DataTableActions
                                                                label={`Abrir ações de ${transaction.description}`}
                                                                actions={[
                                                                    {
                                                                        id: "edit",
                                                                        label: "Editar movimentação",
                                                                        icon: RiEditLine,
                                                                        onSelect: () => setSnackbarOpen(true),
                                                                    },
                                                                    {
                                                                        id: "delete",
                                                                        label: "Excluir movimentação",
                                                                        icon: RiDeleteBin6Line,
                                                                        danger: true,
                                                                        separatorBefore: true,
                                                                        onSelect: () => setConfirmOpen(true),
                                                                    },
                                                                ]}
                                                            />
                                                        </DataTableCell>
                                                    </DataTableRow>
                                                );
                                            })}
                                        </DataTableBody>
                                    </DataTable>
                                }
                                mobile={
                                    <div className="grid gap-4">
                                        <DataList>
                                            {sortedTableTransactions.map((transaction) => {
                                                const TransactionIcon = transaction.icon;

                                                return (
                                                    <DataCard key={transaction.id}>
                                                        <DataCardHeader
                                                            leading={
                                                                <span className="flex size-10 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
                                                                    <TransactionIcon size={18} aria-hidden="true" />
                                                                </span>
                                                            }
                                                            title={transaction.description}
                                                            description={`Lançamento #${String(transaction.id).padStart(4, "0")}`}
                                                            value={transaction.amount}
                                                            valueClassName={
                                                                transaction.type === "income"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                            }
                                                            actions={
                                                                <DataTableActions
                                                                    label={`Abrir ações de ${transaction.description}`}
                                                                    actions={[
                                                                        {
                                                                            id: "edit",
                                                                            label: "Editar movimentação",
                                                                            icon: RiEditLine,
                                                                            onSelect: () => setSnackbarOpen(true),
                                                                        },
                                                                        {
                                                                            id: "delete",
                                                                            label: "Excluir movimentação",
                                                                            icon: RiDeleteBin6Line,
                                                                            danger: true,
                                                                            separatorBefore: true,
                                                                            onSelect: () => setConfirmOpen(true),
                                                                        },
                                                                    ]}
                                                                />
                                                            }
                                                        />

                                                        <DataCardBody>
                                                            <DataCardField
                                                                label="Data"
                                                                value={transaction.date}
                                                            />

                                                            <DataCardField
                                                                label="Conta"
                                                                value={transaction.account}
                                                            />
                                                        </DataCardBody>

                                                        <DataCardFooter>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <CategoryBadge
                                                                    label={transaction.category}
                                                                    tone={transaction.type}
                                                                />

                                                                <TagGroup
                                                                    tags={transaction.tags}
                                                                    maxVisible={2}
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        </DataCardFooter>
                                                    </DataCard>
                                                );
                                            })}
                                        </DataList>

                                        <Pagination
                                            currentPage={tablePage}
                                            totalPages={8}
                                            totalItems={38}
                                            pageSize={5}
                                            itemLabel="movimentações"
                                            compact
                                            onPageChange={setTablePage}
                                        />
                                    </div>
                                }
                            />
                        </div>

                        <Divider label="Anatomia e estados" />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    title: "Estrutura semântica",
                                    description:
                                        "DataTableHeader, DataTableBody, DataTableRow, DataTableHead e DataTableCell preservam a semântica nativa de tabela.",
                                },
                                {
                                    title: "Ordenação acessível",
                                    description:
                                        "O cabeçalho informa aria-sort e o botão comunica qual será a próxima direção antes da interação.",
                                },
                                {
                                    title: "Ações previsíveis",
                                    description:
                                        "DataTableActions usa o mesmo DropdownMenu do sistema e impede que o clique acione a linha inteira.",
                                },
                                {
                                    title: "Mobile específico",
                                    description:
                                        "DataCard reorganiza título, valor, metadados e tags sem simplesmente comprimir as colunas da tabela.",
                                },
                            ].map((item) => (
                                <Surface key={item.title} variant="outlined" padding="lg">
                                    <h3 className="text-card-title font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </Surface>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "density",
                                "stickyHeader",
                                "sortDirection",
                                "selected",
                                "interactive",
                                "actions",
                                "currentPage",
                                "totalPages",
                                "breakpoint",
                                "desktop",
                                "mobile",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiFundsLine}
                    eyebrow="Finanças · Indicadores e gráficos"
                    title="Valores financeiros com hierarquia e contexto"
                    description="Moeda, tendências, situação do saldo, indicadores, resumos e estruturas de gráfico agora usam uma API visual única. Os componentes aceitam dados reais sem ficarem acoplados à Dashboard."
                >
                    <div className="grid gap-7">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Indicadores financeiros
                                </h3>
                                <p className="mt-1 max-w-3xl text-caption text-muted-foreground">
                                    O valor é sempre o elemento principal. Ícone, tendência e descrição explicam o contexto sem competir com o número.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <MetricCard
                                    label="Saldo disponível"
                                    value={8420}
                                    icon={RiMoneyDollarCircleLine}
                                    tone="primary"
                                    trend={{
                                        value: 8.4,
                                        label: "no mês",
                                    }}
                                    description="Atualizado hoje às 10:42"
                                    chart={<MetricSparkline tone="primary" />}
                                />

                                <MetricCard
                                    label="Receitas"
                                    value={5860}
                                    icon={RiArrowRightLine}
                                    tone="positive"
                                    trend={{
                                        value: 12.6,
                                        label: "vs. junho",
                                    }}
                                    description="12 lançamentos confirmados"
                                    chart={<MetricSparkline tone="positive" />}
                                />

                                <MetricCard
                                    label="Despesas"
                                    value={-3210}
                                    icon={RiBankCardLine}
                                    tone="negative"
                                    trend={{
                                        value: -4.2,
                                        label: "redução",
                                        direction: "down",
                                        positiveIsGood: false,
                                    }}
                                    description="18 lançamentos no período"
                                    chart={<MetricSparkline tone="negative" />}
                                />

                                <MetricCard
                                    label="Taxa de economia"
                                    formattedValue="45%"
                                    icon={RiExchangeDollarLine}
                                    tone="warning"
                                    trend={{
                                        value: 6.1,
                                        label: "acima da meta",
                                    }}
                                    description="Meta mensal definida em 35%"
                                    chart={<MetricSparkline tone="warning" />}
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Moeda, sinais e tamanhos
                                </h3>
                                <p className="mt-1 text-caption text-muted-foreground">
                                    CurrencyValue centraliza formatação brasileira, alinhamento tabular, sinais e cor semântica.
                                </p>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-surface p-4">
                                        <p className="text-caption font-semibold text-muted-foreground">
                                            Saldo principal
                                        </p>
                                        <CurrencyValue value={12890.45} size="xl" tone="neutral" className="mt-2" />
                                    </div>

                                    <div className="rounded-xl border border-border bg-surface p-4">
                                        <p className="text-caption font-semibold text-muted-foreground">
                                            Variação líquida
                                        </p>
                                        <CurrencyValue value={2650} size="xl" showPositiveSign className="mt-2" />
                                    </div>

                                    <div className="rounded-xl border border-border bg-surface p-4">
                                        <p className="text-caption font-semibold text-muted-foreground">
                                            Valor compacto
                                        </p>
                                        <CurrencyValue value={1250000} size="lg" compact tone="primary" className="mt-2" />
                                    </div>

                                    <div className="rounded-xl border border-border bg-surface p-4">
                                        <p className="text-caption font-semibold text-muted-foreground">
                                            Saída prevista
                                        </p>
                                        <CurrencyValue value={-890.9} size="lg" className="mt-2" suffix="pendente" />
                                    </div>
                                </div>
                            </article>

                            <article className="rounded-xl border border-border bg-surface-subtle p-5">
                                <h3 className="text-card-title font-semibold">
                                    Tendência e saúde do saldo
                                </h3>
                                <p className="mt-1 text-caption text-muted-foreground">
                                    Tendência representa movimento; BalanceStatus explica a condição geral da conta.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <TrendIndicator value={8.4} label="crescimento" />
                                    <TrendIndicator value={-3.2} label="queda" />
                                    <TrendIndicator value={0} label="estável" />
                                    <TrendIndicator
                                        value={-7.5}
                                        label="gasto menor"
                                        direction="down"
                                        positiveIsGood={false}
                                    />
                                </div>

                                <div className="mt-5 grid gap-3">
                                    <BalanceStatus
                                        status="healthy"
                                        description="A reserva cobre mais de três meses de despesas."
                                    />
                                    <BalanceStatus
                                        status="attention"
                                        description="As despesas já atingiram 82% do orçamento mensal."
                                    />
                                    <BalanceStatus status="critical" compact />
                                </div>
                            </article>
                        </div>

                        <FinancialSummary
                            title="Resumo do período"
                            description="Uma composição compacta para cabeçalhos de listas, relatórios e histórico."
                            columns={4}
                            items={[
                                {
                                    id: "opening",
                                    label: "Saldo inicial",
                                    value: 5770,
                                    icon: RiWallet3Line,
                                    tone: "neutral",
                                },
                                {
                                    id: "income",
                                    label: "Entradas",
                                    value: 5860,
                                    icon: RiArrowRightLine,
                                    tone: "positive",
                                },
                                {
                                    id: "expense",
                                    label: "Saídas",
                                    value: -3210,
                                    icon: RiBankCardLine,
                                    tone: "negative",
                                },
                                {
                                    id: "ending",
                                    label: "Saldo final",
                                    value: 8420,
                                    icon: RiMoneyDollarCircleLine,
                                    tone: "primary",
                                },
                            ]}
                        />

                        <Divider label="Estruturas de gráficos" />

                        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
                            <ChartCard
                                title="Fluxo de caixa"
                                description="Comparação mensal entre entradas e saídas."
                                eyebrow="Últimos 6 meses"
                                icon={RiLineChartLine}
                                value="R$ 2.650,00"
                                actions={
                                    <Button size="sm" variant="outline">
                                        Ver relatório
                                    </Button>
                                }
                                legend={[
                                    {
                                        label: "Receitas",
                                        color: "var(--app-chart-1)",
                                    },
                                    {
                                        label: "Despesas",
                                        color: "var(--app-chart-3)",
                                    },
                                ]}
                                height={300}
                                footer={
                                    <div className="flex flex-col gap-2 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                                        <span>Dados consolidados até 16 de julho.</span>
                                        <TrendIndicator value={8.4} label="resultado" variant="plain" />
                                    </div>
                                }
                            >
                                <CashFlowChartPreview />
                            </ChartCard>

                            <ChartCard
                                title="Despesas por categoria"
                                description="Participação no total do mês."
                                icon={RiPieChart2Line}
                                height={300}
                            >
                                <ExpenseDonutPreview />
                            </ChartCard>
                        </div>

                        <Divider label="Estados do gráfico" />

                        <div className="grid gap-4 lg:grid-cols-3">
                            <Surface variant="outlined" padding="none" className="overflow-hidden">
                                <div className="border-b border-border-subtle px-4 py-3">
                                    <p className="text-caption font-bold text-foreground">
                                        Carregamento
                                    </p>
                                </div>
                                <ChartState state="loading" className="min-h-52" />
                            </Surface>

                            <Surface variant="outlined" padding="none" className="overflow-hidden">
                                <div className="border-b border-border-subtle px-4 py-3">
                                    <p className="text-caption font-bold text-foreground">
                                        Sem dados
                                    </p>
                                </div>
                                <ChartState
                                    state="empty"
                                    title="Nenhuma movimentação"
                                    description="Altere o período ou registre uma transação para preencher o gráfico."
                                    className="min-h-52"
                                />
                            </Surface>

                            <Surface variant="outlined" padding="none" className="overflow-hidden">
                                <div className="border-b border-border-subtle px-4 py-3">
                                    <p className="text-caption font-bold text-foreground">
                                        Falha de carregamento
                                    </p>
                                </div>
                                <ChartState
                                    state="error"
                                    className="min-h-52"
                                    onRetry={() => setSnackbarOpen(true)}
                                />
                            </Surface>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "value",
                                "tone",
                                "size",
                                "compact",
                                "trend",
                                "positiveIsGood",
                                "status",
                                "items",
                                "columns",
                                "legend",
                                "state",
                                "height",
                                "onRetry",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiRepeat2Line}
                    eyebrow="Finanças · Movimentações e recorrências"
                    title="Transações consistentes em tabela e mobile"
                    description="Descrição, classificação, data, valor, ações e regras recorrentes agora usam componentes próprios. A mesma informação se reorganiza em tabela no desktop e em cards no mobile sem duplicar decisões visuais."
                >
                    <div className="grid gap-7">
                        <TransactionSummary
                            title="Resumo de julho"
                            count={18}
                            openingBalance={5770}
                            income={5860}
                            expense={3210}
                            endingBalance={8420}
                        />

                        <div>
                            <div className="mb-4">
                                <h3 className="text-card-title font-semibold">
                                    Anatomia da movimentação
                                </h3>
                                <p className="mt-1 max-w-3xl text-caption text-muted-foreground">
                                    Cada parte pode ser usada separadamente em tabelas, cards, histórico, resultados de busca e detalhes.
                                </p>
                            </div>

                            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
                                <Surface variant="outlined" padding="lg">
                                    <TransactionDescription
                                        transaction={transactionComponentExamples[1]}
                                        showCategory
                                        showTags
                                    />

                                    <div className="mt-5 grid gap-4 border-t border-border-subtle pt-5 sm:grid-cols-2">
                                        <TransactionDate
                                            value={transactionComponentExamples[1].date}
                                            label="Data do recebimento"
                                        />

                                        <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
                                            <span className="text-caption font-semibold text-muted-foreground">
                                                Valor
                                            </span>
                                            <TransactionAmount
                                                amountCents={transactionComponentExamples[1].amountCents}
                                                type={transactionComponentExamples[1].type}
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                </Surface>

                                <Surface variant="subtle" padding="lg">
                                    <h3 className="text-card-title font-semibold">
                                        Ações e estados
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Movimentações automáticas podem bloquear edição sem remover as demais ações.
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center gap-3">
                                        <TransactionActions
                                            transaction={transactionComponentExamples[0]}
                                            onView={() => setSnackbarOpen(true)}
                                            onEdit={() => setSnackbarOpen(true)}
                                            onDelete={() => setConfirmOpen(true)}
                                        />

                                        <TransactionActions
                                            transaction={transactionComponentExamples[1]}
                                            onView={() => setSnackbarOpen(true)}
                                            onEdit={() => setSnackbarOpen(true)}
                                            onDelete={() => setConfirmOpen(true)}
                                            canEdit={false}
                                            label="Ações da movimentação automática"
                                        />
                                    </div>

                                    <div className="mt-5 grid gap-2">
                                        <RecurrenceStatusBadge status="ACTIVE" showDescription />
                                        <RecurrenceStatusBadge status="PAUSED" showDescription />
                                        <RecurrenceStatusBadge status="SCHEDULED" showDescription />
                                        <RecurrenceStatusBadge status="ENDED" showDescription />
                                    </div>
                                </Surface>
                            </div>
                        </div>

                        <Divider label="Movimentações comuns" />

                        <ResponsiveDataView
                            breakpoint="lg"
                            desktop={
                                <DataTable
                                    density="compact"
                                    aria-label="Exemplo dos componentes de movimentação"
                                >
                                    <DataTableHeader>
                                        <DataTableRow hoverable={false}>
                                            <DataTableHead>Movimentação</DataTableHead>
                                            <DataTableHead>Classificação</DataTableHead>
                                            <DataTableHead>Data</DataTableHead>
                                            <DataTableHead align="right">Valor</DataTableHead>
                                            <DataTableHead align="right" aria-label="Ações" />
                                        </DataTableRow>
                                    </DataTableHeader>
                                    <DataTableBody>
                                        {transactionComponentExamples.map((transaction) => (
                                            <TransactionRow
                                                key={transaction.id}
                                                transaction={transaction}
                                                onView={() => setSnackbarOpen(true)}
                                                onEdit={() => setSnackbarOpen(true)}
                                                onDelete={() => setConfirmOpen(true)}
                                            />
                                        ))}
                                    </DataTableBody>
                                </DataTable>
                            }
                            mobile={
                                <DataList>
                                    {transactionComponentExamples.map((transaction) => (
                                        <TransactionCard
                                            key={transaction.id}
                                            transaction={transaction}
                                            onView={() => setSnackbarOpen(true)}
                                            onEdit={() => setSnackbarOpen(true)}
                                            onDelete={() => setConfirmOpen(true)}
                                        />
                                    ))}
                                </DataList>
                            }
                        />

                        <Divider label="Recorrências" />

                        <RecurrenceSummary
                            recurrence={recurringComponentExamples[0]}
                            title="Salário mensal"
                            description="A regra fica separada dos lançamentos gerados. Nenhum valor futuro é contabilizado antes da ocorrência."
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Surface variant="outlined" padding="lg">
                                <RecurrenceFrequency
                                    intervalMonths={3}
                                    dayOfMonth={15}
                                />
                            </Surface>
                            <Surface variant="outlined" padding="lg">
                                <RecurrencePeriod
                                    startDate="2026-07-15"
                                    endDate="2027-07-15"
                                />
                            </Surface>
                        </div>

                        <ResponsiveDataView
                            breakpoint="lg"
                            desktop={
                                <DataTable
                                    density="compact"
                                    aria-label="Exemplo dos componentes de recorrência"
                                    tableClassName="min-w-[68rem]"
                                >
                                    <DataTableHeader>
                                        <DataTableRow hoverable={false}>
                                            <DataTableHead>Recorrência</DataTableHead>
                                            <DataTableHead>Frequência</DataTableHead>
                                            <DataTableHead>Período</DataTableHead>
                                            <DataTableHead>Status</DataTableHead>
                                            <DataTableHead align="right">Valor</DataTableHead>
                                            <DataTableHead align="right" aria-label="Ações" />
                                        </DataTableRow>
                                    </DataTableHeader>
                                    <DataTableBody>
                                        {recurringComponentExamples.map((recurrence) => (
                                            <RecurringTransactionRow
                                                key={recurrence.id}
                                                recurrence={recurrence}
                                                onView={() => setSnackbarOpen(true)}
                                                onEdit={() => setSnackbarOpen(true)}
                                                onDelete={() => setConfirmOpen(true)}
                                                onToggleStatus={() => setSnackbarOpen(true)}
                                            />
                                        ))}
                                    </DataTableBody>
                                </DataTable>
                            }
                            mobile={
                                <DataList>
                                    {recurringComponentExamples.map((recurrence) => (
                                        <RecurringTransactionCard
                                            key={recurrence.id}
                                            recurrence={recurrence}
                                            onView={() => setSnackbarOpen(true)}
                                            onEdit={() => setSnackbarOpen(true)}
                                            onDelete={() => setConfirmOpen(true)}
                                            onToggleStatus={() => setSnackbarOpen(true)}
                                        />
                                    ))}
                                </DataList>
                            }
                        />

                        <div className="grid gap-4 lg:grid-cols-3">
                            {[
                                {
                                    title: "Separação de responsabilidades",
                                    description: "TransactionDescription, TransactionDate e TransactionAmount podem compor qualquer visualização sem repetir formatação ou regras de cor.",
                                },
                                {
                                    title: "Recorrência não é lançamento",
                                    description: "RecurrenceSummary explica a regra e a próxima ocorrência sem somar valores que ainda não foram efetivamente gerados.",
                                },
                                {
                                    title: "Desktop e mobile equivalentes",
                                    description: "TransactionRow e TransactionCard mostram os mesmos dados com hierarquias próprias para cada largura de tela.",
                                },
                            ].map((item) => (
                                <Surface key={item.title} variant="outlined" padding="lg">
                                    <h3 className="text-card-title font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-body-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </Surface>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "transaction",
                                "amountCents",
                                "generatedByRecurrence",
                                "showCategory",
                                "showTags",
                                "intervalMonths",
                                "dayOfMonth",
                                "startDate",
                                "endDate",
                                "status",
                                "onToggleStatus",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiListCheck2}
                    eyebrow="Finanças · Operação"
                    title="Filtros, cadastro e revisão antes do salvamento"
                    description="Os fluxos operacionais agora usam peças controladas e desacopladas dos serviços. A barra de filtros permanece compacta, os critérios avançados podem abrir em drawer e o mesmo formulário atende lançamentos únicos ou recorrentes."
                >
                    <div className="grid gap-7">
                        <TransactionTabs
                            value={transactionView}
                            onValueChange={setTransactionView}
                            counts={{
                                transactions: 18,
                                recurring: 4,
                            }}
                        />

                        <TransactionFilterBar
                            searchValue={transactionSearch}
                            onSearchChange={setTransactionSearch}
                            onSearchClear={() => setTransactionSearch("")}
                            period={transactionOperationPeriod}
                            onPeriodChange={setTransactionOperationPeriod}
                            activeFilterCount={transactionOperationFilterCount}
                            onOpenFilters={() => setTransactionFiltersOpen(true)}
                            onClearFilters={() => setTransactionOperationFilters({ ...emptyTransactionFilters })}
                            resultCount={12}
                        />

                        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] 2xl:items-start">
                            <Surface variant="outlined" padding="lg">
                                <div className="mb-6">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Formulário controlado
                                    </p>
                                    <h3 className="mt-1 text-section-title font-bold text-foreground">
                                        Nova movimentação
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Alterne entre receita, despesa, lançamento único e recorrência sem trocar de estrutura.
                                    </p>
                                </div>

                                <TransactionForm
                                    value={transactionFormValue}
                                    onChange={setTransactionFormValue}
                                    tagOptions={designTags}
                                    selectedTagOptions={transactionFormTags}
                                    submitLabel="Salvar exemplo"
                                    onSubmit={() => setSnackbarOpen(true)}
                                    onCancel={() => setTransactionFormValue((current) => ({
                                        ...current,
                                        description: "",
                                        amount: null,
                                        notes: "",
                                        tagIds: [],
                                    }))}
                                />
                            </Surface>

                            <div className="grid gap-5 2xl:sticky 2xl:top-5">
                                <TransactionReview
                                    value={transactionFormValue}
                                    tags={transactionFormTags}
                                />

                                <Surface variant="subtle" padding="lg">
                                    <h3 className="text-card-title font-bold text-foreground">
                                        Regras do fluxo
                                    </h3>
                                    <div className="mt-4 grid gap-3">
                                        {[
                                            "O formulário apenas emite dados; requisições continuam na camada da tela.",
                                            "Recorrências futuras não entram no saldo antes da data de ocorrência.",
                                            "Datas, moeda, tags e validações usam os componentes já padronizados.",
                                        ].map((rule) => (
                                            <div key={rule} className="flex items-start gap-2 text-caption text-muted-foreground">
                                                <RiCheckLine size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                                                <span>{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Surface>
                            </div>
                        </div>

                        <Divider label="Filtros avançados" />

                        <Surface variant="outlined" padding="lg">
                            <TransactionFilters
                                value={transactionOperationFilters}
                                onChange={setTransactionOperationFilters}
                                onApply={() => setSnackbarOpen(true)}
                                onClear={() => setSnackbarOpen(true)}
                                tagOptions={designTags}
                                selectedTagOptions={designTags.filter((tag) =>
                                    transactionOperationFilters.tagIds.includes(tag.id)
                                )}
                                mode={transactionView}
                            />
                        </Surface>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "value",
                                "onValueChange",
                                "counts",
                                "searchValue",
                                "period",
                                "activeFilterCount",
                                "tagOptions",
                                "mode",
                                "errors",
                                "submitting",
                                "onSubmit",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>



                <FoundationSection
                    icon={RiShieldCheckLine}
                    eyebrow="Acesso · Autenticação"
                    title="Entrada, cadastro e recuperação com uma única linguagem visual"
                    description="Os fluxos públicos agora são montados com componentes independentes de rota e serviço. A mesma base atende login, criação de conta, envio do link, redefinição da senha e confirmações sem duplicar estrutura ou validações visuais."
                >
                    <div className="grid gap-7">
                        <AuthShell
                            embedded
                            maxWidth="md"
                            aside={(
                                <div className="flex h-full flex-col justify-between gap-10">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1.5 text-caption font-bold text-white">
                                            <RiShieldCheckLine size={15} aria-hidden="true" />
                                            Acesso protegido
                                        </div>

                                        <h3 className="mt-6 max-w-sm text-[2rem] font-extrabold leading-[1.12] tracking-display text-white">
                                            Suas finanças organizadas desde o primeiro acesso.
                                        </h3>

                                        <p className="mt-4 max-w-md text-body text-white/70">
                                            Uma experiência direta, segura e consistente para entrar, cadastrar ou recuperar a conta.
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        {[
                                            "Dados vinculados somente à sua conta",
                                            "Recuperação guiada em etapas claras",
                                            "Mesma experiência no desktop e no mobile",
                                        ].map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-caption font-semibold text-white/80">
                                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                                                    <RiCheckLine size={14} aria-hidden="true" />
                                                </span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            footer="Ao continuar, você concorda com os termos de uso e a política de privacidade."
                        >
                            <AuthTabs
                                value={authMode}
                                onChange={setAuthMode}
                                options={[
                                    {
                                        value: "login",
                                        label: "Entrar",
                                        icon: RiLoginBoxLine,
                                    },
                                    {
                                        value: "register",
                                        label: "Criar conta",
                                        icon: RiUserAddLine,
                                    },
                                ]}
                            />

                            <div className="mt-6">
                                <AuthHeader
                                    icon={authMode === "login"
                                        ? <RiLoginBoxLine size={19} aria-hidden="true" />
                                        : <RiUserAddLine size={19} aria-hidden="true" />
                                    }
                                    eyebrow={authMode === "login" ? "Bem-vindo de volta" : "Comece agora"}
                                    title={authMode === "login" ? "Acesse sua conta" : "Crie sua conta"}
                                    description={authMode === "login"
                                        ? "Informe seus dados para continuar acompanhando sua vida financeira."
                                        : "Preencha seus dados e mantenha receitas, despesas e metas no mesmo lugar."
                                    }
                                />
                            </div>

                            <div className="mt-6 grid gap-5">
                                <AuthSocialButton
                                    onClick={() => setSnackbarOpen(true)}
                                />

                                <AuthDivider />

                                <AuthForm
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setSnackbarOpen(true);
                                    }}
                                >
                                    {authMode === "register" ? (
                                        <FormField label="Nome completo" required>
                                            <Input
                                                name="name"
                                                autoComplete="name"
                                                placeholder="Patrick Peres"
                                                leadingIcon={<RiUserLine size={18} aria-hidden="true" />}
                                            />
                                        </FormField>
                                    ) : null}

                                    <FormField label="E-mail" required>
                                        <Input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="voce@exemplo.com"
                                            leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                                        />
                                    </FormField>

                                    <PasswordField
                                        label="Senha"
                                        name="password"
                                        value={authPassword}
                                        onChange={(event) => setAuthPassword(event.target.value)}
                                        autoComplete={authMode === "login" ? "current-password" : "new-password"}
                                        required
                                        showStrength={authMode === "register"}
                                        showRequirements={authMode === "register"}
                                        requirementColumns={1}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        trailingIcon={<RiArrowRightLine size={18} aria-hidden="true" />}
                                    >
                                        {authMode === "login" ? "Entrar na conta" : "Criar minha conta"}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setRecoveryStep(0)}
                                        className="mx-auto text-caption font-bold text-primary outline-none hover:text-primary-hover focus-visible:underline"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </AuthForm>
                            </div>
                        </AuthShell>

                        <Divider label="Recuperação e redefinição" />

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                            <Surface variant="outlined" padding="lg">
                                <AuthStepIndicator
                                    currentStep={recoveryStep}
                                    steps={[
                                        { id: "email", label: "E-mail" },
                                        { id: "verify", label: "Verificar" },
                                        { id: "password", label: "Nova senha" },
                                    ]}
                                />

                                <div className="mt-7">
                                    {recoveryStep === 0 ? (
                                        <>
                                            <AuthHeader
                                                icon={<RiKey2Line size={19} aria-hidden="true" />}
                                                eyebrow="Recuperar acesso"
                                                title="Encontre sua conta"
                                                description="Informe o e-mail cadastrado para receber as instruções de redefinição."
                                            />

                                            <AuthForm
                                                className="mt-6"
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    setRecoveryStep(1);
                                                }}
                                            >
                                                <FormField label="E-mail da conta" required>
                                                    <Input
                                                        type="email"
                                                        placeholder="voce@exemplo.com"
                                                        leadingIcon={<RiMailLine size={18} aria-hidden="true" />}
                                                    />
                                                </FormField>

                                                <Button type="submit" fullWidth>
                                                    Enviar instruções
                                                </Button>
                                            </AuthForm>
                                        </>
                                    ) : recoveryStep === 1 ? (
                                        <AuthStatusState
                                            variant="email"
                                            title="Confira seu e-mail"
                                            description="Enviamos um link seguro de recuperação. Ele expira em 30 minutos."
                                            detail="patrick@email.com"
                                            actions={(
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setRecoveryStep(2)}
                                                    >
                                                        Simular abertura do link
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setSnackbarOpen(true)}
                                                    >
                                                        Reenviar e-mail
                                                    </Button>
                                                </>
                                            )}
                                        />
                                    ) : (
                                        <>
                                            <AuthHeader
                                                icon={<RiLockPasswordLine size={19} aria-hidden="true" />}
                                                eyebrow="Última etapa"
                                                title="Defina uma nova senha"
                                                description="Crie uma senha forte e diferente da utilizada anteriormente."
                                            />

                                            <AuthForm
                                                className="mt-6"
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    setSnackbarOpen(true);
                                                }}
                                            >
                                                <PasswordField
                                                    label="Nova senha"
                                                    value={resetPassword}
                                                    onChange={(event) => setResetPassword(event.target.value)}
                                                    autoComplete="new-password"
                                                    required
                                                    showStrength
                                                    showRequirements
                                                    requirementColumns={1}
                                                />

                                                <PasswordField
                                                    label="Confirmar nova senha"
                                                    value={resetPassword}
                                                    onChange={(event) => setResetPassword(event.target.value)}
                                                    autoComplete="new-password"
                                                    required
                                                />

                                                <Button type="submit" fullWidth>
                                                    Atualizar senha
                                                </Button>
                                            </AuthForm>
                                        </>
                                    )}
                                </div>
                            </Surface>

                            <div className="grid gap-5">
                                <Surface variant="subtle" padding="lg">
                                    <h3 className="text-card-title font-bold text-foreground">
                                        Força e requisitos isolados
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Os indicadores também podem ser usados separadamente em formulários existentes.
                                    </p>

                                    <div className="mt-5 grid gap-5">
                                        <PasswordStrength password={authPassword} />
                                        <PasswordRequirements password={authPassword} />
                                    </div>
                                </Surface>

                                <AuthStatusState
                                    variant="success"
                                    title="Senha atualizada"
                                    description="O acesso foi recuperado e o usuário já pode entrar com a nova senha."
                                    actions={(
                                        <Button
                                            size="sm"
                                            leadingIcon={<RiArrowLeftLine size={17} aria-hidden="true" />}
                                            onClick={() => {
                                                setRecoveryStep(0);
                                                setSnackbarOpen(true);
                                            }}
                                        >
                                            Voltar para entrar
                                        </Button>
                                    )}
                                    className="rounded-xl border border-border bg-surface p-5 shadow-xs"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "embedded",
                                "aside",
                                "value",
                                "onChange",
                                "provider",
                                "showStrength",
                                "showRequirements",
                                "currentStep",
                                "variant",
                                "actions",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiUserLine}
                    eyebrow="Conta · Perfil e usuários"
                    title="Identidade, permissões e administração sem componentes duplicados"
                    description="Os mesmos blocos atendem o perfil do usuário, o menu da conta e a gestão administrativa. Dados, função, status e ações permanecem consistentes entre cards, tabelas, modais e formulários."
                >
                    <div className="grid gap-7">
                        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                            <Card variant="default">
                                <CardHeader
                                    overline="Minha conta"
                                    title="Resumo do perfil"
                                    description="Identidade e dados essenciais em uma estrutura compacta."
                                    action={(
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            leadingIcon={<RiEditLine size={16} aria-hidden="true" />}
                                            onClick={() => setSnackbarOpen(true)}
                                        >
                                            Editar
                                        </Button>
                                    )}
                                />

                                <CardBody className="grid gap-5">
                                    <UserIdentity
                                        name={profileFormValue.name}
                                        email={profileFormValue.email}
                                        role="ADMIN"
                                        status="ACTIVE"
                                        size="lg"
                                        description="Responsável pela administração e organização financeira da conta."
                                    />

                                    <Divider />

                                    <UserDetailList>
                                        <UserDetailItem
                                            icon={RiMailLine}
                                            label="E-mail"
                                            value={profileFormValue.email}
                                            description="Usado para autenticação e recuperação."
                                        />

                                        <UserDetailItem
                                            icon={RiCalendarLine}
                                            label="Conta criada"
                                            value="13 de julho de 2026"
                                        />

                                        <UserDetailItem
                                            icon={RiShieldCheckLine}
                                            label="Tipo de conta"
                                            value={<UserRoleBadge role="ADMIN" />}
                                        />

                                        <UserDetailItem
                                            icon={RiCheckboxCircleLine}
                                            label="Situação"
                                            value={<UserStatusBadge status="ACTIVE" />}
                                        />
                                    </UserDetailList>
                                </CardBody>

                                <CardFooter>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        leadingIcon={<RiKey2Line size={16} aria-hidden="true" />}
                                        onClick={() => setSnackbarOpen(true)}
                                    >
                                        Alterar senha
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSnackbarOpen(true)}
                                    >
                                        Encerrar sessão
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Surface variant="outlined" padding="lg">
                                <div className="mb-6">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Edição reutilizável
                                    </p>
                                    <h3 className="mt-2 text-section-title font-bold text-foreground">
                                        Dados pessoais
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        O formulário é controlado e não depende diretamente do serviço de usuários.
                                    </p>
                                </div>

                                <ProfileForm
                                    value={profileFormValue}
                                    onChange={setProfileFormValue}
                                    onSubmit={() => setSnackbarOpen(true)}
                                />
                            </Surface>
                        </div>

                        <Divider label="Administração de usuários" />

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                            <div className="grid content-start gap-4">
                                {[
                                    {
                                        name: "Mariana Costa",
                                        email: "mariana.costa@email.com",
                                        role: adminUserValue.role,
                                        status: adminUserValue.status,
                                    },
                                    {
                                        name: "Lucas Almeida",
                                        email: "lucas.almeida@email.com",
                                        role: "ADMIN",
                                        status: "ACTIVE",
                                    },
                                    {
                                        name: "Carla Mendes",
                                        email: "carla.mendes@email.com",
                                        role: "USER",
                                        status: "INACTIVE",
                                    },
                                ].map((user) => (
                                    <Card key={user.email} variant="interactive" padding="md">
                                        <UserIdentity
                                            name={user.name}
                                            email={user.email}
                                            role={user.role}
                                            status={user.status}
                                            actions={(
                                                <UserActionsMenu
                                                    active={user.status === "ACTIVE"}
                                                    onEdit={() => setSnackbarOpen(true)}
                                                    onResetPassword={() => setSnackbarOpen(true)}
                                                    onToggleStatus={() => {
                                                        if (user.email === adminUserValue.email) {
                                                            setAdminUserValue((current) => ({
                                                                ...current,
                                                                status: current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                                                            }));
                                                        }
                                                    }}
                                                    onDelete={() => setConfirmOpen(true)}
                                                />
                                            )}
                                        />
                                    </Card>
                                ))}
                            </div>

                            <Surface variant="outlined" padding="lg">
                                <div className="mb-6">
                                    <p className="text-overline font-bold uppercase tracking-overline text-primary">
                                        Formulário administrativo
                                    </p>
                                    <h3 className="mt-2 text-section-title font-bold text-foreground">
                                        Editar usuário
                                    </h3>
                                    <p className="mt-1 text-caption text-muted-foreground">
                                        Nome, e-mail, função e acesso são atualizados em um único fluxo previsível.
                                    </p>
                                </div>

                                <UserAdminForm
                                    value={adminUserValue}
                                    onChange={setAdminUserValue}
                                    onSubmit={() => setSnackbarOpen(true)}
                                />
                            </Surface>
                        </div>

                        <Divider label="Permissões por função" />

                        <div className="grid gap-5 lg:grid-cols-2">
                            <Surface variant="subtle" padding="lg">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-card-title font-bold text-foreground">
                                            Usuário
                                        </h3>
                                        <p className="mt-1 text-caption text-muted-foreground">
                                            Acesso aos próprios dados financeiros e configurações pessoais.
                                        </p>
                                    </div>
                                    <UserRoleBadge role="USER" />
                                </div>

                                <PermissionList className="mt-4">
                                    <PermissionItem
                                        title="Movimentações próprias"
                                        description="Cria, edita e remove receitas, despesas e recorrências da própria conta."
                                    />
                                    <PermissionItem
                                        title="Perfil e segurança"
                                        description="Atualiza dados pessoais e senha."
                                    />
                                    <PermissionItem
                                        title="Gestão de usuários"
                                        description="Não visualiza nem altera outras contas."
                                        status="denied"
                                    />
                                </PermissionList>
                            </Surface>

                            <Surface variant="subtle" padding="lg">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-card-title font-bold text-foreground">
                                            Administrador
                                        </h3>
                                        <p className="mt-1 text-caption text-muted-foreground">
                                            Funções financeiras e ferramentas de administração do sistema.
                                        </p>
                                    </div>
                                    <UserRoleBadge role="ADMIN" />
                                </div>

                                <PermissionList className="mt-4">
                                    <PermissionItem
                                        title="Todas as funções financeiras"
                                        description="Mantém o mesmo controle financeiro da conta padrão."
                                    />
                                    <PermissionItem
                                        title="Usuários e permissões"
                                        description="Altera função, status e dados cadastrais de outras contas."
                                    />
                                    <PermissionItem
                                        title="Ações sobre a própria conta"
                                        description="Não pode desativar ou excluir a própria conta durante a sessão."
                                        status="limited"
                                    />
                                </PermissionList>
                            </Surface>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "name",
                                "email",
                                "role",
                                "status",
                                "avatarUrl",
                                "onChange",
                                "onSubmit",
                                "ownAccount",
                                "permissions",
                                "actions",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiErrorWarningLine}
                    eyebrow="Sistema · Estados de página"
                    title="Erros e bloqueios com orientação clara para o usuário"
                    description="Página não encontrada, acesso restrito, falha inesperada e manutenção usam a mesma estrutura. A mensagem muda conforme o contexto, mas a hierarquia, as ações e a identidade permanecem consistentes."
                >
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-card-title font-bold text-foreground">
                                    Prévia interativa
                                </h3>
                                <p className="mt-1 text-caption text-muted-foreground">
                                    No projeto real, cada variação pode ocupar a tela inteira ou ser incorporada a uma área específica.
                                </p>
                            </div>

                            <SegmentedControl
                                value={systemPagePreview}
                                onValueChange={setSystemPagePreview}
                                aria-label="Selecionar página de sistema"
                                options={[
                                    { value: "not-found", label: "404" },
                                    { value: "access-denied", label: "403" },
                                    { value: "error", label: "500" },
                                    { value: "maintenance", label: "Manutenção" },
                                ]}
                            />
                        </div>

                        <SystemPagePreview
                            value={systemPagePreview}
                            onAction={() => setSnackbarOpen(true)}
                        />

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    code: "404",
                                    title: "Não encontrado",
                                    description: "Usada quando uma rota não existe ou um conteúdo foi removido.",
                                },
                                {
                                    code: "403",
                                    title: "Acesso negado",
                                    description: "Explica a restrição e orienta como retornar ou trocar de conta.",
                                },
                                {
                                    code: "500",
                                    title: "Erro inesperado",
                                    description: "Permite tentar novamente sem transmitir perda ou insegurança dos dados.",
                                },
                                {
                                    code: "PAUSA",
                                    title: "Manutenção",
                                    description: "Comunica indisponibilidade planejada e uma possível previsão de retorno.",
                                },
                            ].map((item) => (
                                <Surface key={item.code} variant="subtle" padding="md">
                                    <span className="text-overline font-extrabold uppercase tracking-overline text-primary">
                                        {item.code}
                                    </span>
                                    <h3 className="mt-3 text-card-title font-bold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-caption text-muted-foreground">
                                        {item.description}
                                    </p>
                                </Surface>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                            {[
                                "variant",
                                "code",
                                "title",
                                "description",
                                "primaryAction",
                                "secondaryAction",
                                "embedded",
                                "compact",
                                "estimatedReturn",
                            ].map((property) => (
                                <code
                                    key={property}
                                    className="rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-caption text-primary"
                                >
                                    {property}
                                </code>
                            ))}
                        </div>
                    </div>
                </FoundationSection>


                <FoundationSection
                    icon={RiFontSize2}
                    eyebrow="Tipografia"
                    title="Escala tipográfica"
                    description="A Manrope será usada em toda a aplicação. A escala diferencia títulos, dados, labels e conteúdos auxiliares sem depender de tamanhos excessivos."
                >
                    <div className="grid gap-3">
                        {typographySamples.map(
                            (item) => (
                                <article
                                    key={item.token}
                                    className="
                                        grid gap-4
                                        rounded-xl
                                        border border-border
                                        bg-surface-subtle
                                        p-4
                                        md:grid-cols-[180px_minmax(0,1fr)_170px]
                                        md:items-center
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-body-sm
                                                font-semibold
                                                text-foreground
                                            "
                                        >
                                            {item.name}
                                        </p>

                                        <code
                                            className="
                                                mt-1 block
                                                text-caption
                                                text-muted-foreground
                                            "
                                        >
                                            {item.token}
                                        </code>
                                    </div>

                                    <p
                                        className={`${item.className} min-w-0`}
                                    >
                                        {item.sample}
                                    </p>

                                    <p
                                        className="
                                            numeric-value
                                            text-caption
                                            text-muted-foreground
                                            md:text-right
                                        "
                                    >
                                        {item.specification}
                                    </p>
                                </article>
                            )
                        )}
                    </div>

                    <div
                        className="
                            mt-5 grid gap-4
                            lg:grid-cols-2
                        "
                    >
                        <div
                            className="
                                rounded-xl
                                border border-border
                                bg-background
                                p-5
                            "
                        >
                            <p
                                className="
                                    text-overline
                                    font-bold uppercase
                                    tracking-overline
                                    text-muted-foreground
                                "
                            >
                                Valores financeiros
                            </p>

                            <p
                                className="
                                    numeric-value
                                    mt-3 text-display
                                    font-extrabold
                                    tracking-display
                                    text-foreground
                                "
                            >
                                R$ 28.450,72
                            </p>

                            <p
                                className="
                                    mt-2 text-body-sm
                                    text-muted-foreground
                                "
                            >
                                Os números usam algarismos tabulares para
                                manter alinhamento em cards e tabelas.
                            </p>
                        </div>

                        <div
                            className="
                                rounded-xl
                                border border-border
                                bg-background
                                p-5
                            "
                        >
                            <p
                                className="
                                    text-overline
                                    font-bold uppercase
                                    tracking-overline
                                    text-muted-foreground
                                "
                            >
                                Hierarquia textual
                            </p>

                            <p
                                className="
                                    mt-3 text-section-title
                                    font-bold
                                "
                            >
                                Pagamento recebido
                            </p>

                            <p
                                className="
                                    mt-2 text-body
                                    text-foreground-soft
                                "
                            >
                                Salário referente ao mês de julho.
                            </p>

                            <p
                                className="
                                    mt-1 text-caption
                                    text-muted-foreground
                                "
                            >
                                16 de julho de 2026 · Conta principal
                            </p>
                        </div>
                    </div>
                </FoundationSection>

                <FoundationSection
                    icon={RiPaletteLine}
                    eyebrow="Cores"
                    title="Paleta semântica"
                    description="Os componentes utilizarão nomes funcionais, como primary, surface e danger. Isso mantém o tema claro e escuro consistentes e evita cores soltas em cada página."
                >
                    <div className="grid gap-6">
                        {colorGroups.map(
                            (group) => (
                                <div key={group.title}>
                                    <div className="mb-3">
                                        <h3
                                            className="
                                                text-card-title
                                                font-semibold
                                            "
                                        >
                                            {group.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1 text-caption
                                                text-muted-foreground
                                            "
                                        >
                                            {group.description}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            grid gap-3
                                            sm:grid-cols-2
                                            lg:grid-cols-4
                                            xl:grid-cols-5
                                        "
                                    >
                                        {group.colors.map(
                                            (color) => (
                                                <ColorSwatch
                                                    key={
                                                        color.token
                                                    }
                                                    {...color}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div
                        className="
                            mt-7 rounded-xl
                            border border-border
                            bg-surface-subtle
                            p-5
                        "
                    >
                        <div
                            className="
                                flex flex-col gap-2
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <h3
                                    className="
                                        text-card-title
                                        font-semibold
                                    "
                                >
                                    Paleta controlada para tags
                                </h3>

                                <p
                                    className="
                                        mt-1 text-caption
                                        text-muted-foreground
                                    "
                                >
                                    A mesma paleta será aplicada no seletor,
                                    nas tabelas e nos detalhes da transação.
                                </p>
                            </div>

                            <span
                                className="
                                    text-caption
                                    font-semibold
                                    text-primary
                                "
                            >
                                9 opções acessíveis
                            </span>
                        </div>

                        <div
                            className="
                                mt-5 flex flex-wrap
                                gap-2.5
                            "
                        >
                            {tagColors.map(
                                (tag) => (
                                    <span
                                        key={tag.name}
                                        className="
                                            inline-flex h-7
                                            items-center gap-2
                                            rounded-pill
                                            px-3
                                            text-caption
                                            font-semibold
                                        "
                                        style={{
                                            color: `var(${tag.color})`,
                                            backgroundColor: `var(${tag.muted})`,
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="size-1.5 rounded-full"
                                            style={{
                                                backgroundColor: `var(${tag.color})`,
                                            }}
                                        />

                                        {tag.name}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </FoundationSection>

                <div
                    className="
                        grid gap-section
                        xl:grid-cols-2
                    "
                >
                    <FoundationSection
                        icon={RiRuler2Line}
                        eyebrow="Espaçamento"
                        title="Escala de 4 pixels"
                        description="Espaçamentos previsíveis deixam filtros, tabelas, cards e formulários alinhados em qualquer tamanho de tela."
                    >
                        <div className="grid gap-3">
                            {spacingScale.map(
                                (item) => (
                                    <div
                                        key={item.token}
                                        className="
                                            grid grid-cols-[44px_minmax(0,1fr)_58px]
                                            items-center gap-3
                                        "
                                    >
                                        <code
                                            className="
                                                text-caption
                                                font-semibold
                                                text-muted-foreground
                                            "
                                        >
                                            {item.token}
                                        </code>

                                        <div
                                            className="
                                                flex h-8
                                                items-center
                                                rounded-md
                                                bg-surface-subtle
                                                px-2
                                            "
                                        >
                                            <div
                                                className="h-3 rounded-pill bg-primary"
                                                style={{
                                                    width: `${Math.min(
                                                        item.pixels *
                                                            4,
                                                        100
                                                    )}%`,
                                                    minWidth: `${item.pixels}px`,
                                                }}
                                            />
                                        </div>

                                        <span
                                            className="
                                                numeric-value
                                                text-right
                                                text-caption
                                                text-muted-foreground
                                            "
                                        >
                                            {item.pixels}px
                                        </span>
                                    </div>
                                )
                            )}
                        </div>

                        <div
                            className="
                                mt-6 grid gap-3
                                sm:grid-cols-3
                            "
                        >
                            {[
                                {
                                    label: "Página",
                                    token: "px-page",
                                    value:
                                        "16 / 24 / 32 px",
                                },
                                {
                                    label: "Seção",
                                    token: "gap-section",
                                    value:
                                        "24 / 28 / 32 px",
                                },
                                {
                                    label: "Card",
                                    token: "p-card",
                                    value:
                                        "16 / 20 / 24 px",
                                },
                            ].map((item) => (
                                <div
                                    key={item.token}
                                    className="
                                        rounded-xl
                                        border border-border
                                        bg-background
                                        p-4
                                    "
                                >
                                    <p
                                        className="
                                            text-body-sm
                                            font-semibold
                                        "
                                    >
                                        {item.label}
                                    </p>

                                    <code
                                        className="
                                            mt-2 block
                                            text-caption
                                            text-primary
                                        "
                                    >
                                        {item.token}
                                    </code>

                                    <p
                                        className="
                                            numeric-value
                                            mt-1 text-caption
                                            text-muted-foreground
                                        "
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </FoundationSection>

                    <FoundationSection
                        icon={RiLayoutGridLine}
                        eyebrow="Raios"
                        title="Arredondamento controlado"
                        description="Raios menores em controles e tabelas; raios maiores somente em superfícies de destaque e modais."
                    >
                        <div
                            className="
                                grid grid-cols-2
                                gap-4
                                sm:grid-cols-3
                            "
                        >
                            {radiusScale.map(
                                (radius) => (
                                    <article
                                        key={radius.token}
                                        className="
                                            rounded-xl
                                            border border-border
                                            bg-background
                                            p-4
                                        "
                                    >
                                        <div
                                            aria-hidden="true"
                                            className="
                                                h-20 border
                                                border-primary/20
                                                bg-primary-muted
                                            "
                                            style={{
                                                borderRadius: `var(${radius.token})`,
                                            }}
                                        />

                                        <div
                                            className="
                                                mt-3 flex
                                                items-center
                                                justify-between
                                                gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    text-body-sm
                                                    font-semibold
                                                "
                                            >
                                                {radius.name}
                                            </span>

                                            <span
                                                className="
                                                    numeric-value
                                                    text-caption
                                                    text-muted-foreground
                                                "
                                            >
                                                {radius.value}
                                            </span>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    </FoundationSection>
                </div>

                <FoundationSection
                    icon={RiStackLine}
                    eyebrow="Elevação"
                    title="Sombras discretas e funcionais"
                    description="Cards comuns dependerão principalmente de bordas. Sombras mais fortes serão reservadas para elementos realmente elevados, como dropdowns, date pickers e modais."
                >
                    <div
                        className="
                            grid gap-4
                            sm:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {shadows.map(
                            (shadow) => (
                                <article
                                    key={shadow.token}
                                    className="
                                        flex min-h-36
                                        flex-col
                                        justify-end
                                        rounded-xl
                                        border border-border-subtle
                                        bg-surface-elevated
                                        p-5
                                    "
                                    style={{
                                        boxShadow: `var(${shadow.token})`,
                                    }}
                                >
                                    <p
                                        className="
                                            text-card-title
                                            font-semibold
                                        "
                                    >
                                        {shadow.name}
                                    </p>

                                    <p
                                        className="
                                            mt-1 text-caption
                                            text-muted-foreground
                                        "
                                    >
                                        {shadow.usage}
                                    </p>

                                    <code
                                        className="
                                            mt-3 text-caption
                                            text-primary
                                        "
                                    >
                                        {shadow.token}
                                    </code>
                                </article>
                            )
                        )}
                    </div>
                </FoundationSection>

                <FoundationSection
                    icon={RiContrastDrop2Line}
                    eyebrow="Direção"
                    title="Princípios que orientarão os componentes"
                    description="Estes critérios serão usados para decidir a aparência e o comportamento de botões, campos, tabelas, tags, modais e demais componentes."
                >
                    <div
                        className="
                            grid gap-4
                            md:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        {principles.map(
                            (principle) => (
                                <article
                                    key={principle.title}
                                    className="
                                        rounded-xl
                                        border border-border
                                        bg-surface-subtle
                                        p-5
                                    "
                                >
                                    <span
                                        className="
                                            flex size-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-primary-muted
                                            text-primary
                                        "
                                    >
                                        <RiCheckLine
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <h3
                                        className="
                                            mt-4 text-card-title
                                            font-semibold
                                        "
                                    >
                                        {principle.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-2 text-body-sm
                                            text-muted-foreground
                                        "
                                    >
                                        {principle.description}
                                    </p>
                                </article>
                            )
                        )}
                    </div>
                </FoundationSection>
            </div>

            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Nova categoria"
                description="Crie uma categoria para organizar suas movimentações."
                icon={RiPaletteLine}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            leadingIcon={<RiSave3Line size={18} aria-hidden="true" />}
                            onClick={() => {
                                setModalOpen(false);
                                setSnackbarOpen(true);
                            }}
                        >
                            Salvar categoria
                        </Button>
                    </>
                }
            >
                <div className="grid gap-5">
                    <FormField label="Nome da categoria" required>
                        <Input placeholder="Ex.: Moradia" />
                    </FormField>

                    <FormField
                        label="Descrição"
                        helperText="Uma descrição curta ajuda a identificar o uso da categoria."
                    >
                        <TextArea rows={3} placeholder="Descreva quando esta categoria deve ser utilizada." />
                    </FormField>
                </div>
            </Modal>

            <Drawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                title="Filtrar movimentações"
                description="Refine os resultados sem perder o contexto da página."
                icon={RiFilter3Line}
                position="right"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                            Limpar
                        </Button>
                        <Button onClick={() => setDrawerOpen(false)}>
                            Aplicar filtros
                        </Button>
                    </>
                }
            >
                <div className="grid gap-5">
                    <FormField label="Tipo de movimentação">
                        <Select defaultValue="all">
                            <option value="all">Todas</option>
                            <option value="income">Receitas</option>
                            <option value="expense">Despesas</option>
                        </Select>
                    </FormField>

                    <FormField label="Pesquisar por descrição">
                        <SearchInput placeholder="Ex.: mercado" />
                    </FormField>

                    <Divider />

                    <Checkbox
                        defaultChecked
                        label="Incluir recorrentes"
                        description="Exibe movimentações automáticas no resultado."
                    />

                    <Checkbox
                        label="Somente pendentes"
                        description="Oculta transações já confirmadas."
                    />
                </div>
            </Drawer>

            <Drawer
                open={transactionFiltersOpen}
                onOpenChange={setTransactionFiltersOpen}
                title="Filtros avançados"
                description="Refine as movimentações sem perder o período e a pesquisa atual."
                icon={RiFilter3Line}
                position="right"
                size="lg"
            >
                <TransactionFilters
                    value={transactionOperationFilters}
                    onChange={setTransactionOperationFilters}
                    onApply={() => {
                        setTransactionFiltersOpen(false);
                        setSnackbarOpen(true);
                    }}
                    onClear={() => setSnackbarOpen(true)}
                    tagOptions={designTags}
                    selectedTagOptions={designTags.filter((tag) =>
                        transactionOperationFilters.tagIds.includes(tag.id)
                    )}
                    mode={transactionView}
                />
            </Drawer>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Excluir esta transação?"
                description="Esta ação remove o lançamento do histórico e não poderá ser desfeita."
                confirmLabel="Excluir transação"
                onConfirm={() => {
                    setConfirmOpen(false);
                    setSnackbarOpen(true);
                }}
            >
                <Alert variant="warning" title="Antes de continuar">
                    Transações recorrentes futuras não serão removidas por esta ação.
                </Alert>
            </ConfirmDialog>

            <Snackbar
                open={snackbarOpen}
                onOpenChange={setSnackbarOpen}
                variant="success"
                title="Operação concluída"
                description="O exemplo foi atualizado com sucesso."
                duration={4500}
                action={
                    <Button variant="ghost" size="sm">
                        Desfazer
                    </Button>
                }
            />

        </div>
    );
}

export default DesignSystem;
