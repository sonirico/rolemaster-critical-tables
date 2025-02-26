import { CritTable } from './types';

const STORAGE_KEY = 'critTables';

export const getTables = (): CritTable[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveTables = (tables: CritTable[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
};

export const addTable = (table: CritTable): CritTable[] => {
    const tables = getTables();
    const updatedTables = [...tables, table];
    saveTables(updatedTables);
    return updatedTables;
};

export const deleteTable = (id: number): CritTable[] => {
    const tables = getTables();
    const updatedTables = tables.filter(table => table.id !== id);
    saveTables(updatedTables);
    return updatedTables;
};

export const updateTable = (updatedTable: CritTable): CritTable[] => {
    const tables = getTables();
    const updatedTables = tables.map(table => table.id === updatedTable.id ? updatedTable : table);
    saveTables(updatedTables);
    return updatedTables;
};
