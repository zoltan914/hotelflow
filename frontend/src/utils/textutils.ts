
export const normalize = (text: string): string =>
    text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/^(dr\.|dr|ifj\.|ifj)\s+/i, '')
        .trim();