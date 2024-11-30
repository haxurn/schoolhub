// backend/enums/contractTypeEnum.ts

import { db } from '../config/dbConfig';

const createContractTypeEnum = async () => {
    try {
        const result = await db.execute(`
            SELECT 1 FROM pg_type WHERE typname = 'contract_type';
        `);

        if (result.rowCount === 0) {
            await db.execute(`
                CREATE TYPE contract_type AS ENUM (
                    'Permanent', 'Temporary'
                );
            `);
            console.log('✔️ ContractType enum created successfully');
        } else {
            console.log('✔️ ContractType enum already exists');
        }
    } catch (error) {
        console.error('❌ Error creating ContractType enum:', error);
    }
};

export default createContractTypeEnum;
