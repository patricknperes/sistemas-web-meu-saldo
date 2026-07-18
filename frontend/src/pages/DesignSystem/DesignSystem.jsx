import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    Bell,
    CalendarDays,
    ChartNoAxesColumnIncreasing,
    Check,
    ChevronRight,
    Filter,
    Info,
    LayoutDashboard,
    Mail,
    Menu,
    MoreHorizontal,
    Palette,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UserRound,
    Users,
    WalletCards,
    X,
} from "lucide-react";

import LibraryShowcase from "./LibraryShowcase.jsx";

import PageContainer from "../../components/layout/PageContainer.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import {
    Badge,
    BrandMark,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Input,
} from "../../components/ui/index.js";

const colorGroups = [
    {
        title: "Fundação",
        description: "Cores utilizadas nas superfícies e estruturas principais.",
        colors: [
            ["Background", "bg-background", "#F5F7FB / #070B14"],
            ["Surface", "bg-surface", "#FFFFFF / #0D1422"],
            ["Surface raised", "bg-surface-raised", "#F9FAFC / #121B2C"],
            ["Surface muted", "bg-surface-muted", "#EEF2F7 / #182337"],
        ],
    },
    {
        title: "Identidade",
        description: "Cores responsáveis pela identidade visual do Meu Saldo.",
        colors: [
            ["Primary", "bg-primary", "#1E3A8A / #6EA8FF"],
            ["Accent", "bg-accent", "#2563EB / #60A5FA"],
            ["Secondary", "bg-secondary", "#0F4C81 / #38BDF8"],
            ["Border", "bg-border-strong", "#C7D0DE / 14% branco"],
        ],
    },
    {
        title: "Estados",
        description: "Cores semânticas reservadas para feedbacks e indicadores.",
        colors: [
            ["Success", "bg-success", "#179B62 / #4ADE80"],
            ["Danger", "bg-danger", "#D92D20 / #FF6B6B"],
            ["Warning", "bg-warning", "#DC6803 / #FDB022"],
            ["Info", "bg-info", "#1570EF / #53B1FD"],
        ],
    },
];

const spacingTokens = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
const chartValues = [42, 58, 47, 72, 64, 86, 78, 92, 70, 84, 96, 88];

const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: ArrowUp, label: "Receitas" },
    { icon: ArrowDown, label: "Despesas" },
    { icon: CalendarDays, label: "Histórico" },
    { icon: Users, label: "Usuários" },
];

const structureItems = [
    {
        title: "AppShell",
        description: "Estrutura principal que reúne sidebar, topbar e conteúdo.",
    },
    {
        title: "Sidebar",
        description: "Navegação expansível no desktop e drawer no mobile.",
    },
    {
        title: "Topbar",
        description: "Contexto da página, tema, perfil e ações globais.",
    },
    {
        title: "PageHeader",
        description: "Título, descrição, contexto e ações principais da tela.",
    },
    {
        title: "PageToolbar",
        description: "Pesquisa, filtros, período e ações relacionadas à listagem.",
    },
    {
        title: "PageSection",
        description: "Agrupamento semântico de conteúdos relacionados.",
    },
    {
        title: "PageGrid",
        description: "Grid responsivo para métricas, gráficos e informações.",
    },
    {
        title: "Responsive states",
        description: "Adaptação estrutural para desktop, tablet e mobile.",
    },
];

function SectionHeader({ eyebrow, title, description, action }) {
    return (
        <header className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                        {eyebrow}
                    </p>
                )}

                <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}

function TokenSwatch({ name, className, value }) {
    return (
        <div className="flex min-w-0 items-center gap-3 rounded-control border border-border bg-surface-raised p-3">
            <span
                className={`size-10 shrink-0 rounded-[10px] border border-black/5 shadow-xs ${className}`}
            />

            <span className="min-w-0">
                <strong className="block truncate text-sm text-foreground">
                    {name}
                </strong>

                <span className="block truncate text-xs text-subtle-foreground">
                    {value}
                </span>
            </span>
        </div>
    );
}

function MetricPreview({ icon: Icon, label, value, change, variant = "success" }) {
    const isDanger = variant === "danger";

    return (
        <Card className="min-w-0 overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-control ${isDanger
                                ? "bg-danger-muted text-danger"
                                : "bg-success-muted text-success"
                            }`}
                    >
                        <Icon aria-hidden="true" className="size-5" />
                    </span>

                    <Badge variant={isDanger ? "danger" : "success"}>
                        {isDanger ? (
                            <ArrowDown aria-hidden="true" className="size-3.5" />
                        ) : (
                            <ArrowUp aria-hidden="true" className="size-3.5" />
                        )}
                        {change}
                    </Badge>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">{label}</p>

                <strong className="money-nums mt-1 block truncate text-2xl font-bold tracking-[-0.035em] text-foreground">
                    {value}
                </strong>
            </CardContent>
        </Card>
    );
}

function DesktopShellPreview() {
    return (
        <div className="overflow-hidden rounded-card border border-border bg-background shadow-card">
            <div className="grid min-h-[480px] grid-cols-[210px_minmax(0,1fr)]">
                <aside className="flex min-w-0 flex-col border-r border-border bg-surface p-4">
                    <BrandMark />

                    <nav className="mt-7 space-y-1.5">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className={`flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-semibold ${item.active
                                            ? "bg-primary-soft text-primary"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    <Icon aria-hidden="true" className="size-4.5 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-border pt-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                PP
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    Patrick Peres
                                </p>
                                <p className="truncate text-xs text-subtle-foreground">
                                    Administrador
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-col">
                    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-5">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                Dashboard
                            </p>
                            <p className="truncate text-xs text-subtle-foreground">
                                Visão geral financeira
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <IconButton variant="ghost" aria-label="Notificações">
                                <Bell className="size-4.5" />
                            </IconButton>

                            <IconButton variant="ghost" aria-label="Configurações">
                                <Settings className="size-4.5" />
                            </IconButton>
                        </div>
                    </header>

                    <main className="min-w-0 flex-1 space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <Badge variant="primary">Julho de 2026</Badge>
                                <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                                    Visão geral
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Acompanhe o desempenho financeiro do período.
                                </p>
                            </div>

                            <Button size="sm">
                                <Plus className="size-4" />
                                Novo lançamento
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                ["Saldo", "R$ 8.420,50"],
                                ["Receitas", "R$ 5.200,00"],
                                ["Despesas", "R$ 2.450,80"],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="min-w-0 rounded-card-sm border border-border bg-surface p-4"
                                >
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <strong className="money-nums mt-1 block truncate text-base text-foreground">
                                        {value}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="grid min-w-0 grid-cols-[1.4fr_0.6fr] gap-3">
                            <div className="min-h-48 rounded-card-sm border border-border bg-surface p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-foreground">
                                        Fluxo financeiro
                                    </p>
                                    <MoreHorizontal className="size-4 text-subtle-foreground" />
                                </div>

                                <div className="mt-5 flex h-28 items-end gap-2">
                                    {chartValues.slice(0, 8).map((value, index) => (
                                        <span
                                            key={`${value}-${index}`}
                                            className="min-w-0 flex-1 rounded-t bg-primary/75"
                                            style={{ height: `${value}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-card-sm border border-border bg-surface p-4">
                                <p className="text-sm font-bold text-foreground">Resumo</p>
                                <div className="mt-4 space-y-3">
                                    <div className="h-10 rounded-control bg-surface-muted" />
                                    <div className="h-10 rounded-control bg-surface-muted" />
                                    <div className="h-10 rounded-control bg-surface-muted" />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function MobileShellPreview() {
    return (
        <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[24px] border border-border bg-background shadow-card">
            <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4">
                <IconButton variant="ghost" aria-label="Abrir menu">
                    <Menu className="size-5" />
                </IconButton>

                <BrandMark compact />

                <IconButton variant="ghost" aria-label="Abrir perfil">
                    <UserRound className="size-5" />
                </IconButton>
            </header>

            <main className="space-y-4 p-4">
                <div>
                    <Badge variant="primary">Julho de 2026</Badge>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                        Visão geral
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        Acompanhe suas movimentações.
                    </p>
                </div>

                <Button className="w-full">
                    <Plus className="size-4" />
                    Novo lançamento
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-card-sm border border-border bg-surface p-3">
                        <p className="text-xs text-muted-foreground">Receitas</p>
                        <strong className="money-nums mt-1 block truncate text-sm text-success">
                            R$ 5.200,00
                        </strong>
                    </div>

                    <div className="rounded-card-sm border border-border bg-surface p-3">
                        <p className="text-xs text-muted-foreground">Despesas</p>
                        <strong className="money-nums mt-1 block truncate text-sm text-danger">
                            R$ 2.450,80
                        </strong>
                    </div>
                </div>

                <div className="rounded-card border border-border bg-surface p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">Saldo atual</p>
                        <TrendingUp className="size-4 text-success" />
                    </div>

                    <strong className="money-nums mt-2 block text-2xl text-foreground">
                        R$ 8.420,50
                    </strong>

                    <div className="mt-4 flex h-24 items-end gap-1.5">
                        {chartValues.slice(0, 7).map((value, index) => (
                            <span
                                key={`${value}-${index}`}
                                className="min-w-0 flex-1 rounded-t bg-primary/75"
                                style={{ height: `${value}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="rounded-card border border-border bg-surface">
                    {["Salário", "Supermercado", "Assinatura"].map((item, index) => (
                        <div
                            key={item}
                            className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {item}
                                </p>
                                <p className="mt-0.5 text-xs text-subtle-foreground">
                                    {index === 0 ? "Receita" : "Despesa"}
                                </p>
                            </div>

                            <ChevronRight className="size-4 shrink-0 text-subtle-foreground" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

function StatePreview({ icon: Icon, title, description, tone = "neutral" }) {
    const toneClasses = {
        neutral: "bg-surface-muted text-subtle-foreground",
        primary: "bg-primary-soft text-primary",
        danger: "bg-danger-muted text-danger",
    };

    return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-card-sm border border-border bg-surface px-5 py-7 text-center">
            <span
                className={`flex size-11 items-center justify-center rounded-control ${toneClasses[tone] ?? toneClasses.neutral
                    }`}
            >
                <Icon aria-hidden="true" className="size-5" />
            </span>

            <h3 className="mt-3 text-sm font-bold text-foreground">{title}</h3>

            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

function DesignSystem() {
    return (
        <div className="page-grid-background min-h-full">
            <PageContainer className="space-y-10 py-6 sm:py-8 lg:py-10">
                <PageHeader
                    eyebrow="Etapa 09 · Estrutura da aplicação"
                    title="Design System do Meu Saldo"
                    description="Biblioteca visual, estrutural e funcional utilizada para manter todas as páginas do sistema consistentes no desktop, tablet e mobile."
                    actions={
                        <>
                            <Badge variant="primary" className="h-9 px-3">
                                <Sparkles aria-hidden="true" className="size-4" />
                                Etapa 09
                            </Badge>

                            <Button variant="secondary" size="sm">
                                <Palette aria-hidden="true" className="size-4" />
                                Midnight Blue
                            </Button>
                        </>
                    }
                />

                <section className="relative overflow-hidden rounded-dialog border border-border bg-surface p-6 shadow-card sm:p-8 lg:p-10">
                    <div
                        aria-hidden="true"
                        className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-secondary/10 blur-3xl"
                    />

                    <div className="relative grid min-w-0 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div className="min-w-0">
                            <BrandMark />

                            <Badge variant="secondary" className="mt-8">
                                Fundação visual e estrutural
                            </Badge>

                            <h2 className="text-balance mt-4 max-w-2xl text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
                                Uma única linguagem para todas as telas do sistema.
                            </h2>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                A Etapa 09 consolida tokens, componentes, estruturas de página e padrões responsivos para impedir diferenças visuais entre dashboard, histórico, receitas, despesas, perfil e administração.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button>
                                    <WalletCards aria-hidden="true" className="size-4.5" />
                                    Ação principal
                                </Button>

                                <Button variant="secondary">Ação secundária</Button>
                                <Button variant="ghost">Ação discreta</Button>
                            </div>
                        </div>

                        <div className="glass-panel min-w-0 rounded-card p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-subtle-foreground">
                                        Saldo disponível
                                    </p>

                                    <strong className="money-nums mt-2 block truncate text-3xl font-bold tracking-[-0.04em] text-foreground">
                                        R$ 12.480,35
                                    </strong>
                                </div>

                                <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary">
                                    <ChartNoAxesColumnIncreasing
                                        aria-hidden="true"
                                        className="size-[22px]"
                                    />
                                </span>
                            </div>

                            <div className="mt-6 flex h-40 items-end gap-2 rounded-card-sm border border-border bg-surface/65 p-4">
                                {chartValues.map((value, index) => (
                                    <span
                                        key={`${value}-${index}`}
                                        className="min-w-0 flex-1 rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                                        style={{ height: `${value}%` }}
                                        title={`${value}%`}
                                    />
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-subtle-foreground">
                                <span>Jan</span>
                                <span className="truncate">Fluxo dos últimos 12 meses</span>
                                <span>Dez</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="structure-title">
                    <SectionHeader
                        eyebrow="Estrutura"
                        title="Arquitetura visual da aplicação"
                        description="Blocos responsáveis por organizar todas as páginas e manter o mesmo comportamento estrutural."
                        action={<Badge variant="info">8 padrões</Badge>}
                    />

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {structureItems.map((item, index) => (
                            <Card key={item.title} className="min-w-0">
                                <CardContent className="p-4 sm:p-5">
                                    <span className="flex size-8 items-center justify-center rounded-control bg-primary-soft text-xs font-bold text-primary">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <h3 className="mt-4 text-sm font-bold text-foreground">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="responsive-title">
                    <SectionHeader
                        eyebrow="Responsividade"
                        title="AppShell no desktop e no mobile"
                        description="A estrutura muda conforme o espaço disponível, sem duplicar ações ou criar rolagem lateral."
                    />

                    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="min-w-0">
                            <DesktopShellPreview />
                        </div>

                        <div className="min-w-0">
                            <MobileShellPreview />
                        </div>
                    </div>
                </section>

                <section aria-labelledby="colors-title">
                    <SectionHeader
                        eyebrow="Tokens"
                        title="Paleta semântica"
                        description="As páginas devem utilizar os tokens semânticos, evitando cores fixas fora dos casos de identidade da marca."
                        action={
                            <span className="text-xs text-subtle-foreground">
                                Light / Dark
                            </span>
                        }
                    />

                    <div className="grid gap-4 xl:grid-cols-3">
                        {colorGroups.map((group) => (
                            <Card key={group.title}>
                                <CardHeader className="pb-3">
                                    <h3 className="font-bold text-foreground">{group.title}</h3>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {group.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="grid gap-2">
                                    {group.colors.map(([name, className, value]) => (
                                        <TokenSwatch
                                            key={name}
                                            name={name}
                                            className={className}
                                            value={value}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <CardHeader>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                                Tipografia
                            </p>
                            <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">
                                Hierarquia textual
                            </h2>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <span className="text-xs text-subtle-foreground">
                                    Display · 40/44
                                </span>
                                <p className="mt-1 text-4xl font-bold tracking-[-0.045em] text-foreground">
                                    Controle seu dinheiro.
                                </p>
                            </div>

                            <div>
                                <span className="text-xs text-subtle-foreground">
                                    Título · 24/32
                                </span>
                                <p className="mt-1 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                    Visão geral de julho
                                </p>
                            </div>

                            <div>
                                <span className="text-xs text-subtle-foreground">
                                    Corpo · 16/24
                                </span>
                                <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">
                                    Informações financeiras com hierarquia clara e densidade confortável para leitura contínua.
                                </p>
                            </div>

                            <div>
                                <span className="text-xs text-subtle-foreground">
                                    Valores · números tabulares
                                </span>
                                <p className="money-nums mt-1 text-2xl font-semibold text-foreground">
                                    R$ 1.234,56 · R$ 98.765,43
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                                Espaçamento
                            </p>
                            <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">
                                Grid de 4 pontos
                            </h2>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {spacingTokens.map((size) => (
                                <div key={size} className="flex min-w-0 items-center gap-4">
                                    <span className="money-nums w-10 shrink-0 text-right text-xs text-subtle-foreground">
                                        {size}
                                    </span>

                                    <span
                                        className="h-3 max-w-full rounded-full bg-primary"
                                        style={{ width: `${Math.max(16, size * 3)}px` }}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section aria-labelledby="components-title">
                    <SectionHeader
                        eyebrow="Componentes atômicos"
                        title="Controles básicos da interface"
                        description="Elementos reutilizados em formulários, filtros, modais, listas e páginas administrativas."
                    />

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-foreground">
                                    Botões, ações e badges
                                </h3>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="primary">Principal</Button>
                                    <Button variant="secondary">Secundário</Button>
                                    <Button variant="soft">Suave</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="danger">Excluir</Button>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <IconButton aria-label="Pesquisar">
                                        <Search className="size-[18px]" />
                                    </IconButton>

                                    <IconButton aria-label="Informações" variant="ghost">
                                        <Info className="size-[19px]" />
                                    </IconButton>

                                    <Button size="sm">Pequeno</Button>
                                    <Button size="md">Médio</Button>
                                    <Button size="lg">Grande</Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge>Neutro</Badge>
                                    <Badge variant="primary">Principal</Badge>

                                    <Badge variant="success">
                                        <Check className="size-3.5" />
                                        Sucesso
                                    </Badge>

                                    <Badge variant="danger">
                                        <X className="size-3.5" />
                                        Erro
                                    </Badge>

                                    <Badge variant="warning">Aviso</Badge>
                                    <Badge variant="info">Informação</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-foreground">Campos e estados</h3>
                            </CardHeader>

                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="E-mail"
                                    placeholder="voce@exemplo.com"
                                    leadingIcon={Mail}
                                    hint="Usado para acessar sua conta."
                                />

                                <Input
                                    label="Pesquisar"
                                    placeholder="Descrição ou categoria"
                                    leadingIcon={Search}
                                />

                                <Input
                                    label="Campo inválido"
                                    defaultValue="Valor incorreto"
                                    error="Revise esta informação."
                                />

                                <Input
                                    label="Campo desabilitado"
                                    defaultValue="Não editável"
                                    disabled
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section aria-labelledby="toolbar-title">
                    <SectionHeader
                        eyebrow="PageToolbar"
                        title="Pesquisa, filtros e ações"
                        description="A toolbar deve ser compacta, adaptável e não pode criar rolagem lateral no mobile."
                    />

                    <Card>
                        <CardContent className="p-4 sm:p-5">
                            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
                                <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                                    <Input
                                        aria-label="Pesquisar movimentações"
                                        placeholder="Pesquisar movimentações"
                                        leadingIcon={Search}
                                    />
                                </div>

                                <Button variant="secondary" className="w-full justify-between">
                                    <CalendarDays className="size-4" />
                                    Julho de 2026
                                    <ChevronRight className="size-4" />
                                </Button>

                                <Button variant="secondary" className="w-full">
                                    <Filter className="size-4" />
                                    Filtrar
                                </Button>

                                <Button className="w-full whitespace-nowrap lg:w-auto">
                                    <Plus className="size-4" />
                                    Novo
                                </Button>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="primary">
                                    Julho
                                    <X className="size-3.5" />
                                </Badge>

                                <Badge variant="secondary">
                                    Receitas
                                    <X className="size-3.5" />
                                </Badge>

                                <Button variant="ghost" size="sm">
                                    Limpar filtros
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section aria-labelledby="cards-title">
                    <SectionHeader
                        eyebrow="Padrões financeiros"
                        title="Cards preparados para o Dashboard"
                        description="Métricas financeiras devem manter o mesmo alinhamento, tipografia e comportamento responsivo."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricPreview
                            icon={WalletCards}
                            label="Saldo atual"
                            value="R$ 8.420,50"
                            change="12,4%"
                        />

                        <MetricPreview
                            icon={ArrowUp}
                            label="Receitas"
                            value="R$ 5.200,00"
                            change="8,1%"
                        />

                        <MetricPreview
                            icon={ArrowDown}
                            label="Despesas"
                            value="R$ 2.450,80"
                            change="3,2%"
                            variant="danger"
                        />

                        <MetricPreview
                            icon={BarChart3}
                            label="Economia"
                            value="R$ 2.749,20"
                            change="18,5%"
                        />
                    </div>
                </section>

                <section aria-labelledby="states-title">
                    <SectionHeader
                        eyebrow="Feedback"
                        title="Estados das páginas e componentes"
                        description="Carregamento, ausência de dados e erros precisam seguir o mesmo padrão em todo o sistema."
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                        <StatePreview
                            icon={ChartNoAxesColumnIncreasing}
                            title="Nenhum dado encontrado"
                            description="O estado vazio permanece centralizado dentro da área disponível."
                        />

                        <StatePreview
                            icon={Sparkles}
                            title="Carregando informações"
                            description="Skeletons preservam a estrutura e evitam mudanças bruscas no layout."
                            tone="primary"
                        />

                        <StatePreview
                            icon={AlertTriangle}
                            title="Não foi possível carregar"
                            description="A mensagem explica o problema e oferece uma ação clara para tentar novamente."
                            tone="danger"
                        />
                    </div>
                </section>

                <section aria-labelledby="library-title">
                    <SectionHeader
                        eyebrow="Biblioteca completa"
                        title="Todos os componentes do sistema"
                        description="Catálogo central com componentes, variações, estados e padrões reutilizados pelas funcionalidades do Meu Saldo."
                        action={
                            <Badge variant="success">
                                <Check className="size-3.5" />
                                Integrado
                            </Badge>
                        }
                    />

                    <LibraryShowcase />
                </section>

                <Card className="border-primary/20 bg-primary-soft/45">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="min-w-0">
                            <Badge variant="primary">Etapa 09 concluída</Badge>

                            <h2 className="mt-3 text-lg font-bold text-foreground">
                                A estrutura da aplicação agora faz parte do Design System.
                            </h2>

                            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                                Sidebar, topbar, cabeçalhos, toolbars, grids, cards, formulários, estados e padrões responsivos passam a seguir uma única referência visual.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            className="self-start whitespace-nowrap sm:self-auto"
                        >
                            <ShieldCheck className="size-4" />
                            Fundação validada
                        </Button>
                    </CardContent>
                </Card>
            </PageContainer>
        </div>
    );
}

export default DesignSystem;