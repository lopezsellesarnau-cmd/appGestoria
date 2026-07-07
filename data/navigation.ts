export interface NavSection {
	label: string;
	href: string;
}

export const NAV_SECTIONS: NavSection[] = [
	{ label: "Dashboard", href: "/" },
	{ label: "Comunidades", href: "/comunidades" },
	{ label: "Propietarios", href: "/propietarios" },
	{ label: "Recibos", href: "/recibos" },
	{ label: "Proveedores", href: "/proveedores" },
	{ label: "Deudores", href: "/deudores" },
	{ label: "Incidencias", href: "/incidencias" },
	{ label: "Contactos", href: "/contactos" },
];
