"use client";

import {
    createContext,
    useContext,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { EmptyState } from "./EmptyState";

type ListLayout = "stack" | "grid" | "inline";
type ListGap = "sm" | "md" | "lg";
type ListItemTone = "default" | "muted" | "completed" | "selected";

type ListContextValue = {
    stagger: number;
    animateItems: boolean;
};

// Keep staggered item behavior coordinated across list layouts without threading timing props everywhere.
const ListContext = createContext<ListContextValue>({
    stagger: 0,
    animateItems: true,
});

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function useListContext() {
    return useContext(ListContext);
}

const gapClasses: Record<ListGap, string> = {
    sm: "gap-2",
    md: "gap-3 md:gap-4",
    lg: "gap-5 md:gap-6",
};

const layoutClasses: Record<ListLayout, string> = {
    stack: "grid grid-cols-1",
    grid: "grid grid-cols-1",
    inline: "flex flex-wrap items-start",
};

const toneClasses: Record<ListItemTone, string> = {
    default: "",
    muted: "opacity-75",
    completed: "opacity-75 scale-[0.99] grayscale-[0.15]",
    selected: "ring-1 ring-accent/30 bg-accent/5",
};

// Root-level concerns live here so item animation cadence stays consistent
// across stack and grid list surfaces.
type ListRootProps = {
    children: ReactNode;
    className?: string;
    stagger?: number;
    animateItems?: boolean;
    density?: "default" | "compact";
};

function Root({
    children,
    className,
    stagger = 60,
    animateItems = true,
    density = "default",
}: ListRootProps) {
    return (
        <ListContext.Provider value={{ stagger, animateItems }}>
            <div className={cx(density === "compact" ? "space-y-4" : "space-y-6", className)}>{children}</div>
        </ListContext.Provider>
    );
}

type ListHeaderProps = {
    children?: ReactNode;
    className?: string;
};

function Header({ children, className }: ListHeaderProps) {
    return <section className={cx("space-y-5", className)}>{children}</section>;
}

// Header subcomponents stay intentionally small so list screens share one
// canonical header vocabulary without forcing identical composition.
function Intro({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cx("flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}
            {...props}
        />
    );
}

function Heading({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx("max-w-2xl", className)} {...props} />;
}

function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cx("text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground", className)}
            {...props}
        />
    );
}

function Title({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cx("mt-2 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl", className)}
            {...props}
        />
    );
}

function Description({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cx("mt-2 text-sm leading-6 text-muted-foreground", className)}
            {...props}
        />
    );
}

function Actions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx("flex flex-wrap items-center gap-3", className)} {...props} />;
}

function Toolbar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx("space-y-4", className)} {...props} />;
}

type ListContentProps = {
    children: ReactNode;
    className?: string;
    layout?: ListLayout;
    gap?: ListGap;
    columns?: 1 | 2 | 3;
};

// `columns` owns the shared grid density presets for list surfaces.
function Content({
    children,
    className,
    layout = "stack",
    gap = "md",
    columns,
}: ListContentProps) {
    const responsiveGridClass = layout === "grid"
        ? columns === 3
            ? "md:grid-cols-2 xl:grid-cols-3"
            : columns === 1
                ? "grid-cols-1"
                : "xl:grid-cols-2"
        : "";

    return (
        <div className={cx(layoutClasses[layout], responsiveGridClass, gapClasses[gap], className)}>
            {children}
        </div>
    );
}

type ListItemProps = {
    children: ReactNode;
    className?: string;
    index?: number;
    tone?: ListItemTone;
    animate?: boolean;
};

// Item wrappers own stagger/tone behavior so screens can focus on row content
// instead of repeating transition and animation plumbing.
function Item({
    children,
    className,
    index = 0,
    tone = "default",
    animate,
}: ListItemProps) {
    const { stagger, animateItems } = useListContext();
    const shouldAnimate = animate ?? animateItems;
    const style: CSSProperties | undefined = shouldAnimate
        ? { animationDelay: `${index * stagger}ms` }
        : undefined;

    return (
        <div
            className={cx(
                shouldAnimate && "animate-slide-up",
                "h-full transition-all duration-500",
                toneClasses[tone],
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
}

type ListStateProps = {
    children: ReactNode;
    className?: string;
};

// `State` is the neutral shell behind loading and compact inline states.
function State({ children, className }: ListStateProps) {
    return (
        <div className={cx("flex flex-col items-center justify-center py-16 text-center", className)}>
            {children}
        </div>
    );
}

type ListLoadingProps = {
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
    icon?: LucideIcon;
};

function Loading({
    title = "Loading...",
    description,
    className,
    icon: Icon = Loader2,
}: ListLoadingProps) {
    return (
        <State className={cx("gap-4 text-muted-foreground", className)}>
            <Icon className="h-7 w-7 animate-spin text-accent" />
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/85">{title}</p>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
        </State>
    );
}

type ListEmptyProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
};

function Empty({ icon, title, description, action, className }: ListEmptyProps) {
    return (
        <div className={className}>
            <EmptyState
                icon={icon}
                title={title}
                description={description}
                action={action}
            />
        </div>
    );
}

type ListErrorProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
};

function Error({ icon, title, description, action, className }: ListErrorProps) {
    return (
        <div className={className}>
            <EmptyState
                icon={icon}
                title={title}
                description={description}
                action={action}
            />
        </div>
    );
}

// Export the compound surface as a single namespace so list anatomy stays discoverable at call sites.
export const List = {
    Root,
    Header,
    Intro,
    Heading,
    Eyebrow,
    Title,
    Description,
    Actions,
    Toolbar,
    Content,
    Item,
    State,
    Loading,
    Empty,
    Error,
};
