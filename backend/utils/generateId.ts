// backend/utils/generateId.ts

export const generateId = (): string => {
    const id = Math.floor(10000000 + Math.random() * 90000000);
    return id.toString();
}