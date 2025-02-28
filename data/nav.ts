interface NavItem {
    path: string;
    title: string;
}

export const navItems: NavItem[] = [
    { path: "/", title: "General" },
    { path: "product", title: "Producto" },
    { path: "consumer", title: "Consumidor" },
    { path: "sampling", title: "Sampling" },
    { path: "sales", title: "Ventas" },
];
