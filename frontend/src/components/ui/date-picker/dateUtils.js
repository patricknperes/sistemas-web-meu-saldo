const MONTHS_LONG = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

const MONTHS_SHORT = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
];

const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];

function pad(value) {
    return String(value).padStart(2, "0");
}

function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
}

function parseISODate(value) {
    if (!value || typeof value !== "string") {
        return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function formatISODate(date) {
    if (!isValidDate(date)) {
        return "";
    }

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseMonthValue(value) {
    if (!value || typeof value !== "string") {
        return null;
    }

    const match = /^(\d{4})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (month < 1 || month > 12) {
        return null;
    }

    return {
        year,
        month,
        date: new Date(year, month - 1, 1),
    };
}

function formatMonthValue(year, month) {
    return `${year}-${pad(month)}`;
}

function formatDateLabel(value, options = {}) {
    const date = typeof value === "string" ? parseISODate(value) : value;

    if (!isValidDate(date)) {
        return "";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: options.longMonth ? "long" : "2-digit",
        year: "numeric",
    }).format(date);
}

function formatMonthYearLabel(value) {
    const parsed = typeof value === "string" ? parseMonthValue(value) : value;

    if (!parsed) {
        return "";
    }

    return `${MONTHS_LONG[parsed.month - 1]} de ${parsed.year}`;
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarDays(monthDate) {
    const firstDay = startOfMonth(monthDate);
    const gridStart = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        1 - firstDay.getDay()
    );

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(
            gridStart.getFullYear(),
            gridStart.getMonth(),
            gridStart.getDate() + index
        );

        return {
            date,
            value: formatISODate(date),
            outside: date.getMonth() !== monthDate.getMonth(),
        };
    });
}

function compareDates(left, right) {
    const leftDate = typeof left === "string" ? parseISODate(left) : left;
    const rightDate = typeof right === "string" ? parseISODate(right) : right;

    if (!isValidDate(leftDate) || !isValidDate(rightDate)) {
        return 0;
    }

    const leftTime = new Date(
        leftDate.getFullYear(),
        leftDate.getMonth(),
        leftDate.getDate()
    ).getTime();
    const rightTime = new Date(
        rightDate.getFullYear(),
        rightDate.getMonth(),
        rightDate.getDate()
    ).getTime();

    return Math.sign(leftTime - rightTime);
}

function isDateUnavailable(value, { min, max, isDateDisabled } = {}) {
    const date = typeof value === "string" ? parseISODate(value) : value;

    if (!isValidDate(date)) {
        return true;
    }

    if (min && compareDates(date, min) < 0) {
        return true;
    }

    if (max && compareDates(date, max) > 0) {
        return true;
    }

    return Boolean(isDateDisabled?.(date));
}

function isSameDay(left, right) {
    if (!isValidDate(left) || !isValidDate(right)) {
        return false;
    }

    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    );
}

function isSameMonth(left, right) {
    if (!isValidDate(left) || !isValidDate(right)) {
        return false;
    }

    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth()
    );
}

export {
    MONTHS_LONG,
    MONTHS_SHORT,
    WEEKDAYS_SHORT,
    addMonths,
    buildCalendarDays,
    compareDates,
    formatDateLabel,
    formatISODate,
    formatMonthValue,
    formatMonthYearLabel,
    isDateUnavailable,
    isSameDay,
    isSameMonth,
    isValidDate,
    parseISODate,
    parseMonthValue,
    startOfMonth,
};
