
// backend/utils/generateId.ts

export const generateIdFinance = (): string => {
    const id = Math.floor(100000 + Math.random() * 900000);
    return `FI${id.toString()}`;
}
