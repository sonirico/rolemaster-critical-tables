import { useState, useEffect } from 'react';
import { slugify } from './utils';
import { getTables, saveTables, addTable, deleteTable, updateTable } from './RepositoryTable';
import { CritTable } from './types';
import { getDefaultTableSchema } from './defaultTableSchema';
import { styles } from './styles';
import TableEditor from './TableEditor';
import ModalTableDelete from './ModalTableDelete';
import ModalImportJson from './ModalImportJson'; // Import the new modal component
import ModalJsonEditor from './ModalJsonEditor'; // Import the new modal component

function App() {
  const [critTables, setCritTables] = useState<CritTable[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [tableToDelete, setTableToDelete] = useState<CritTable | null>(null);
  const [newTableName, setNewTableName] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showJsonEditorModal, setShowJsonEditorModal] = useState<boolean>(false);
  const [tableToEditAsJson, setTableToEditAsJson] = useState<CritTable | null>(null);

  useEffect(() => {
    const tables = getTables();
    console.log('Datos recuperados de localStorage:', tables);
    setCritTables(tables);
  }, []);

  useEffect(() => {
    if (critTables.length > 0) {
      console.log('Guardando datos en localStorage:', critTables);
      saveTables(critTables);
    }
  }, [critTables]);

  const handleCreate = (): void => {
    if (!newTableName.trim()) return;
    const newTable: CritTable = {
      id: Date.now(),
      name: newTableName.trim(),
      filename: slugify(newTableName) + '.json',
      rows: getDefaultTableSchema()
    };
    const updatedTables = addTable(newTable);
    setCritTables(updatedTables);
    setNewTableName('');
  };

  const requestDelete = (table: CritTable): void => {
    setTableToDelete(table);
    setShowDeleteModal(true);
  };

  const confirmDelete = (): void => {
    if (tableToDelete) {
      const updatedTables = deleteTable(tableToDelete.id);
      setCritTables(updatedTables);
    }
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  const cancelDelete = (): void => {
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  const handleClone = (table: CritTable): void => {
    const cloned: CritTable = {
      ...table,
      id: Date.now(),
      name: table.name + ' (copia)'
    };
    const updatedTables = addTable(cloned);
    setCritTables(updatedTables);
  };

  const [editingTable, setEditingTable] = useState<CritTable | null>(null);

  const handleEdit = (table: CritTable): void => {
    setEditingTable(table);
  };

  const handleSaveTable = (updatedTable: CritTable): void => {
    const updatedTables = updateTable(updatedTable);
    setCritTables(updatedTables);
    setEditingTable(null);
  };

  const exportTableToJson = (table: CritTable) => {
    const dataStr = JSON.stringify(table, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${table.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (json: string): void => {
    try {
      const importedTable: CritTable = JSON.parse(json);
      const updatedTables = addTable(importedTable);
      setCritTables(updatedTables);
      setShowImportModal(false);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleEditAsJson = (table: CritTable): void => {
    setTableToEditAsJson(table);
    setShowJsonEditorModal(true);
  };

  const handleUpdateTableFromJson = (updatedTable: CritTable): void => {
    const updatedTables = updateTable(updatedTable);
    setCritTables(updatedTables);
    setShowJsonEditorModal(false);
    setTableToEditAsJson(null);
  };

  return (
    <>
      <div style={styles.container}>
        <h1>Catálogo de Tablas de Críticos</h1>

        <div style={styles.formContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nombre de nueva tabla"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <button style={styles.button} onClick={handleCreate}>
            Crear
          </button>
          <button style={styles.button} onClick={() => setShowImportModal(true)}>
            Importar desde JSON
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {critTables.map((table) => (
              <tr key={table.id}>
                <td style={styles.tableCell}>{table.name}</td>
                <td style={styles.tableCell}>
                  <button style={styles.actionButton} onClick={() => handleEdit(table)}>
                    Editar
                  </button>
                  <button style={styles.actionButton} onClick={() => handleClone(table)}>
                    Clonar
                  </button>
                  <button
                    style={{ ...styles.actionButton }}
                    onClick={() => requestDelete(table)}
                  >
                    Eliminar
                  </button>
                  <button
                    style={{ ...styles.actionButton }}
                    onClick={() => exportTableToJson(table)}
                  >
                    Exportar
                  </button>
                  <button
                    style={{ ...styles.actionButton }}
                    onClick={() => handleEditAsJson(table)}
                  >
                    Editar como JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div>
        {showDeleteModal && tableToDelete && (
          <ModalTableDelete
            tableName={tableToDelete.name}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        {editingTable && (
          <TableEditor
            table={editingTable}
            onSave={handleSaveTable}
          />
        )}
        {showImportModal && (
          <ModalImportJson
            onImport={handleImport}
            onClose={() => setShowImportModal(false)}
          />
        )}
        {showJsonEditorModal && tableToEditAsJson && (
          <ModalJsonEditor
            table={tableToEditAsJson}
            onUpdate={handleUpdateTableFromJson}
            onClose={() => setShowJsonEditorModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;