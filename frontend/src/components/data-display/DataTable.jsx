import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { cn } from "../../lib/cn.js";

function DataTable({ columns, data, emptyMessage = "Nenhum registro encontrado.", className }) {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className={cn("overflow-hidden rounded-card-sm border border-border bg-surface", className)}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-[0.08em] text-subtle-foreground">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="border-b border-border px-4 py-3">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-raised">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="max-w-80 px-4 py-3 text-foreground">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-subtle-foreground">{emptyMessage}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
