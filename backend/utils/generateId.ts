// backend/utils/generateId.ts

export const generateIdFinance = (): string => {
    const prefix = 'FIN';
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
};

export const admissionNumberGenerator = (): string => {
    const prefix = 'STD';
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
};