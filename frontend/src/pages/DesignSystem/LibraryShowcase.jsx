import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

import ChartContainer from "../../components/charts/ChartContainer.jsx";
import DataTable from "../../components/data-display/DataTable.jsx";
import Combobox from "../../components/forms/Combobox.jsx";
import CurrencyField from "../../components/forms/CurrencyField.jsx";
import DatePicker from "../../components/forms/DatePicker.jsx";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/index.js";

const chartData = [
    { month: "Jan", balance: 3200 },
    { month: "Fev", balance: 4100 },
    { month: "Mar", balance: 3800 },
    { month: "Abr", balance: 5200 },
    { month: "Mai", balance: 6100 },
    { month: "Jun", balance: 7450 },
];

const tableData = [
    { description: "Salário", category: "Trabalho", amount: "R$ 4.200,00" },
    { description: "Supermercado", category: "Alimentação", amount: "- R$ 458,90" },
    { description: "Internet", category: "Moradia", amount: "- R$ 119,90" },
];

const formSchema = z.object({
    description: z.string().trim().min(2, "Informe ao menos dois caracteres.").max(80, "Use no máximo 80 caracteres."),
});

function FormFoundationDemo() {
    const [message, setMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { description: "" },
    });

    return (
        <form className="mt-6 space-y-3" onSubmit={handleSubmit(({ description }) => setMessage(`Validado: ${description}`))}>
            <Input
                label="Descrição com schema"
                placeholder="Ex.: Salário mensal"
                error={errors.description?.message}
                {...register("description")}
            />
            <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" size="sm">Validar formulário</Button>
                {message && <span className="text-xs font-semibold text-success">{message}</span>}
            </div>
        </form>
    );
}

function LibraryShowcase() {
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState("food");
    const [comboboxValue, setComboboxValue] = useState("home");
    const columns = useMemo(() => [
        { accessorKey: "description", header: "Descrição", cell: ({ getValue }) => <span className="block truncate font-semibold">{getValue()}</span> },
        { accessorKey: "category", header: "Categoria" },
        { accessorKey: "amount", header: "Valor", cell: ({ getValue }) => <span className="money-nums font-semibold">{getValue()}</span> },
    ], []);

    return (
        <section aria-labelledby="libraries-title" className="space-y-4">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Etapa 2 · Ecossistema</p>
                <h2 id="libraries-title" className="mt-1 text-xl font-bold tracking-[-0.025em] text-foreground">Primitivos headless e dados interativos</h2>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Radix UI, CMDK, TanStack, Recharts, DayPicker e React Number Format encapsulados pela biblioteca interna.</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader><h3 className="font-bold text-foreground">Controles customizados</h3></CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Alimentação</SelectItem>
                                <SelectItem value="home">Moradia</SelectItem>
                                <SelectItem value="transport">Transporte</SelectItem>
                            </SelectContent>
                        </Select>
                        <Combobox
                            value={comboboxValue}
                            onChange={setComboboxValue}
                            options={[{ value: "home", label: "Casa" }, { value: "health", label: "Saúde" }, { value: "education", label: "Educação" }]}
                        />
                        <CurrencyField label="Valor" defaultValue={1900} />
                        <div>
                            <span className="mb-2 block text-sm font-semibold text-foreground">Data</span>
                            <DatePicker value={date} onChange={setDate} />
                        </div>
                        <label className="flex items-center gap-3 text-sm font-medium text-foreground"><Switch defaultChecked /> Transação recorrente</label>
                        <label className="flex items-center gap-3 text-sm font-medium text-foreground"><Checkbox defaultChecked /> Incluir no resumo</label>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><h3 className="font-bold text-foreground">Tabs e modal acessível</h3></CardHeader>
                    <CardContent>
                        <Tabs defaultValue="income">
                            <TabsList>
                                <TabsTrigger value="income">Receitas</TabsTrigger>
                                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                            </TabsList>
                            <TabsContent value="income"><p className="text-sm text-muted-foreground">Componentes controlam foco, teclado e estados ARIA sem impor aparência.</p></TabsContent>
                            <TabsContent value="expenses"><p className="text-sm text-muted-foreground">A mesma fundação será reutilizada em filtros e formulários.</p></TabsContent>
                        </Tabs>
                        <FormFoundationDemo />
                        <Dialog>
                            <DialogTrigger asChild><Button className="mt-6">Abrir modal</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Novo lançamento</DialogTitle>
                                    <DialogDescription>Exemplo da fundação acessível preparada para os formulários da próxima etapa.</DialogDescription>
                                </DialogHeader>
                                <CurrencyField label="Valor da transação" defaultValue={250} />
                                <DialogFooter>
                                    <Button variant="secondary">Cancelar</Button>
                                    <Button>Salvar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>

            <ChartContainer title="Evolução do saldo" description="Componente responsivo baseado em Recharts.">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--app-primary)" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="var(--app-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--app-border)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--app-subtle-foreground)", fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ background: "var(--app-surface-raised)", border: "1px solid var(--app-border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="balance" stroke="var(--app-primary)" strokeWidth={2.5} fill="url(#balanceGradient)" />
                </AreaChart>
            </ChartContainer>

            <DataTable columns={columns} data={tableData} />
        </section>
    );
}

export default LibraryShowcase;
