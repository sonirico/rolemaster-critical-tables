
export const slugify = (x: string): string => x.normalize("NFD") // Normaliza caracteres con tilde
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Sustituye todo lo que no sea alfanumérico por "_"
    .replace(/^_+|_+$/g, ""); // Elimina "_" al inicio o final
