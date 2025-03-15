import { CritTable } from './types';

const STORAGE_KEY = 'critTables';

export const getTables = (): CritTable[] => {
    const storedTables = localStorage.getItem(STORAGE_KEY);
    return storedTables ? JSON.parse(storedTables) : [];
};

export const saveTables = (tables: CritTable[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
};

export const addTable = (table: CritTable): CritTable[] => {
    const tables = getTables();
    tables.push(table);
    saveTables(tables);
    return tables;
};

export const updateTable = (updatedTable: CritTable): CritTable[] => {
    const tables = getTables();
    const index = tables.findIndex(t => t.id === updatedTable.id);
    if (index !== -1) {
        tables[index] = updatedTable;
        saveTables(tables);
    }
    return tables;
};

export const deleteTable = (id: number): CritTable[] => {
    let tables = getTables();
    tables = tables.filter(t => t.id !== id);
    saveTables(tables);
    return tables;
};

// Add an event dispatcher for cross-component communication
const eventListeners: Record<string, Function[]> = {};

export const addTableUpdateListener = (callback: Function) => {
    if (!eventListeners['tableUpdate']) {
        eventListeners['tableUpdate'] = [];
    }
    eventListeners['tableUpdate'].push(callback);
};

export const removeTableUpdateListener = (callback: Function) => {
    if (eventListeners['tableUpdate']) {
        eventListeners['tableUpdate'] = eventListeners['tableUpdate'].filter(cb => cb !== callback);
    }
};

export const notifyTableUpdate = (tables: CritTable[]) => {
    if (eventListeners['tableUpdate']) {
        eventListeners['tableUpdate'].forEach(callback => callback(tables));
    }
};

// Modify updateTable to also notify listeners
export const updateTableWithNotification = (updatedTable: CritTable): CritTable[] => {
    const tables = updateTable(updatedTable);
    notifyTableUpdate(tables);
    return tables;
};
