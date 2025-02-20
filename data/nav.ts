interface NavItem {
    path: string;
    title: string;
}

export const navItems: NavItem[] = [
    { path: "/", title: "General" },
    { path: "/product-info", title: "Producto" },
    { path: "/consumer", title: "Consumidor" },
    { path: "/sales", title: "Ventas" },
    { path: "/sales-by-product", title: "Ventas por producto" },
    { path: "/ambassadors", title: "Embajadoras" },
];
