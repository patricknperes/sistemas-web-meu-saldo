import {
    ArrowDown,
    ArrowUp,
    ChartNoAxesColumnIncreasing,
    Check,
    Info,
    Mail,
    Palette,
    Search,
    Sparkles,
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
        colors: [
            ["Background", "bg-background", "#F4F7FA / #07090D"],
            ["Surface", "bg-surface", "#FFFFFF / #10141B"],
            ["Surface raised", "bg-surface-raised", "#F8FAFC / #151A23"],
            ["Surface muted", "bg-surface-muted", "#EEF2F6 / #1B222D"],
        ],
    },
    {
        title: "Identidade",
        colors: [
            ["Primary", "bg-primary", "#0F766E / #2DD4BF"],
            ["Accent", "bg-accent", "#0891B2 / #22D3EE"],
            ["Secondary", "bg-secondary", "#6D5DFB / #8B7CFF"],
            ["Border", "bg-border-strong", "#C7D0DA / 14% branco"],
        ],
    },
    {
        title: "Estados",
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

function TokenSwatch({ name, className, value }) {
    return (
        <div className="flex min-w-0 items-center gap-3 rounded-control border border-border bg-surface-raised p-3">
            <span className={`size-10 shrink-0 rounded-[10px] border border-black/5 shadow-xs ${className}`} />
            <span className="min-w-0">
                <strong className="block truncate text-sm text-foreground">{name}</strong>
                <span className="block truncate text-xs text-subtle-foreground">{value}</span>
            </span>
        </div>
    );
}

function MetricPreview({ icon: Icon, label, value, change, variant }) {
    const positive = variant !== "expense";

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-5 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                    <span className={`flex size-10 items-center justify-center rounded-control ${positive ? "bg-success-muted text-success" : "bg-danger-muted text-danger"}`}>
                        <Icon size={20} aria-hidden="true" />
                    </span>
                    <Badge variant={positive ? "success" : "danger"}>
                        {positive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                        {change}
                    </Badge>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">{label}</p>
                <strong className="money-nums mt-1 block text-2xl font-bold tracking-[-0.035em] text-foreground">
                    {value}
                </strong>
            </CardContent>
        </Card>
    );
}

function DesignSystem() {
    return (
        <div className="page-grid-background min-h-full">
            <PageContainer className="space-y-8 py-6 sm:py-8 lg:py-10">
                <PageHeader
                    eyebrow="Etapas 1 e 2 · Fundação visual e técnica"
                    title="Design System Aqua Graphite"
                    description="Biblioteca visual inicial do Meu Saldo. Esta página valida tokens, tipografia, espaçamento, superfícies e componentes básicos antes da reescrita das telas funcionais."
                    actions={
                        <>
                            <Badge variant="primary" className="h-9 px-3">
                                <Sparkles size={15} aria-hidden="true" />
                                Versão 2.0
                            </Badge>
                            <Button variant="secondary" size="sm">
                                <Palette size={17} aria-hidden="true" />
                                Aqua Graphite
                            </Button>
                        </>
                    }
                />

                <section className="relative overflow-hidden rounded-dialog border border-border bg-surface p-6 shadow-card sm:p-8 lg:p-10">
                    <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
                    <div aria-hidden="true" className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-secondary/10 blur-3xl" />

                    <div className="relative grid min-w-0 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div className="min-w-0">
                            <BrandMark />
                            <Badge variant="secondary" className="mt-8">Minimalismo financeiro</Badge>
                            <h2 className="text-balance mt-4 max-w-2xl text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
                                Uma interface silenciosa para decisões financeiras mais claras.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Alto contraste, respiro controlado, dados com números tabulares e cores semânticas. O efeito glass aparece somente em camadas elevadas, sem comprometer a leitura.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button>
                                    <WalletCards size={18} aria-hidden="true" />
                                    Ação principal
                                </Button>
                                <Button variant="secondary">Ação secundária</Button>
                                <Button variant="ghost">Ação discreta</Button>
                            </div>
                        </div>

                        <div className="glass-panel min-w-0 rounded-card p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-subtle-foreground">Saldo disponível</p>
                                    <strong className="money-nums mt-2 block truncate text-3xl font-bold tracking-[-0.04em] text-foreground">R$ 12.480,35</strong>
                                </div>
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary">
                                    <ChartNoAxesColumnIncreasing size={22} aria-hidden="true" />
                                </span>
                            </div>

                            <div className="mt-6 flex h-40 items-end gap-2 rounded-card-sm border border-border bg-surface/65 p-4">
                                {chartValues.map((value, index) => (
                                    <span
                                        key={`${value}-${index}`}
                                        className="min-w-0 flex-1 rounded-t-md bg-primary/80 transition hover:bg-primary"
                                        style={{ height: `${value}%` }}
                                        title={`${value}%`}
                                    />
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-subtle-foreground">
                                <span>Jan</span>
                                <span>Fluxo dos últimos 12 meses</span>
                                <span>Dez</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="colors-title">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Tokens</p>
                            <h2 id="colors-title" className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Paleta semântica</h2>
                        </div>
                        <span className="text-xs text-subtle-foreground">Light / Dark</span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                        {colorGroups.map((group) => (
                            <Card key={group.title}>
                                <CardHeader className="pb-3">
                                    <h3 className="font-bold text-foreground">{group.title}</h3>
                                </CardHeader>
                                <CardContent className="grid gap-2">
                                    {group.colors.map(([name, className, value]) => (
                                        <TokenSwatch key={name} name={name} className={className} value={value} />
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <CardHeader>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Tipografia</p>
                            <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Inter Variable</h2>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <span className="text-xs text-subtle-foreground">Display · 40/44</span>
                                <p className="mt-1 text-4xl font-bold tracking-[-0.045em] text-foreground">Controle seu dinheiro.</p>
                            </div>
                            <div>
                                <span className="text-xs text-subtle-foreground">Título · 24/32</span>
                                <p className="mt-1 text-2xl font-bold tracking-[-0.035em] text-foreground">Visão geral de julho</p>
                            </div>
                            <div>
                                <span className="text-xs text-subtle-foreground">Corpo · 16/24</span>
                                <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">Informações financeiras com hierarquia clara e densidade confortável para leitura contínua.</p>
                            </div>
                            <div>
                                <span className="text-xs text-subtle-foreground">Valores · números tabulares</span>
                                <p className="money-nums mt-1 text-2xl font-semibold text-foreground">R$ 1.234,56 · R$ 98.765,43</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Espaçamento</p>
                            <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Grid de 4 pontos</h2>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {spacingTokens.map((size) => (
                                <div key={size} className="flex items-center gap-4">
                                    <span className="money-nums w-10 shrink-0 text-right text-xs text-subtle-foreground">{size}</span>
                                    <span className="h-3 rounded-full bg-primary" style={{ width: `${Math.max(16, size * 3)}px` }} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section aria-labelledby="components-title">
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Componentes atômicos</p>
                        <h2 id="components-title" className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Primeira camada da biblioteca</h2>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-foreground">Botões e ações</h3>
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
                                    <IconButton aria-label="Pesquisar"><Search size={18} /></IconButton>
                                    <IconButton aria-label="Informações" variant="ghost"><Info size={19} /></IconButton>
                                    <Button size="sm">Pequeno</Button>
                                    <Button size="md">Médio</Button>
                                    <Button size="lg">Grande</Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>Neutro</Badge>
                                    <Badge variant="primary">Principal</Badge>
                                    <Badge variant="success"><Check size={13} /> Sucesso</Badge>
                                    <Badge variant="danger"><X size={13} /> Erro</Badge>
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
                                <Input label="E-mail" placeholder="voce@exemplo.com" leadingIcon={Mail} hint="Usado para acessar sua conta." />
                                <Input label="Pesquisar" placeholder="Descrição ou categoria" leadingIcon={Search} />
                                <Input label="Campo inválido" defaultValue="Valor incorreto" error="Revise esta informação." />
                                <Input label="Campo desabilitado" defaultValue="Não editável" disabled />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section aria-labelledby="cards-title">
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Padrões financeiros</p>
                        <h2 id="cards-title" className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Cards preparados para o Dashboard</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricPreview icon={WalletCards} label="Saldo atual" value="R$ 8.420,50" change="12,4%" />
                        <MetricPreview icon={ArrowUp} label="Receitas" value="R$ 5.200,00" change="8,1%" />
                        <MetricPreview icon={ArrowDown} label="Despesas" value="R$ 2.450,80" change="3,2%" variant="expense" />
                        <MetricPreview icon={ChartNoAxesColumnIncreasing} label="Economia" value="R$ 2.749,20" change="18,5%" />
                    </div>
                </section>

                <LibraryShowcase />

                <Card className="border-primary/20 bg-primary-soft/45">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="min-w-0">
                            <Badge variant="primary">Fundação concluída</Badge>
                            <h2 className="mt-3 text-lg font-bold text-foreground">A base visual e o ecossistema técnico estão prontos para iniciar a reescrita das telas.</h2>
                            <p className="mt-1 text-sm text-muted-foreground">As telas antigas continuam disponíveis enquanto a migração acontece de forma progressiva e segura.</p>
                        </div>
                        <Button variant="secondary" className="self-start sm:self-auto">Etapa 2 validada</Button>
                    </CardContent>
                </Card>
            </PageContainer>
        </div>
    );
}

export default DesignSystem;
