import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { slugify } from './utils';
import { getTables, saveTables, addTable, deleteTable, updateTable } from './tableRepository';
import { CritTable, CritRow, CritCell } from './types';
import { getDefaultTableSchema } from './defaultTableSchema';

function App() {
  const [critTables, setCritTables] = useState<CritTable[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [tableToDelete, setTableToDelete] = useState<CritTable | null>(null);
  const [newTableName, setNewTableName] = useState<string>('');

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

  return (
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
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {critTables.map((table) => (
            <tr key={table.id}>
              <td>{table.name}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && tableToDelete && (
        <DeleteModal
          tableName={tableToDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {editingTable && (
        <CritTableEditor
          table={editingTable}
          onSave={handleSaveTable}
        />
      )}
    </div>
  );
}

interface DeleteModalProps {
  tableName: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ tableName, onConfirm, onCancel }: DeleteModalProps) {
  return ReactDOM.createPortal(
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Confirmar Eliminación</h2>
        <p>¿Seguro que deseas eliminar la tabla "{tableName}"?</p>
        <div style={modalStyles.btnRow}>
          <button style={modalStyles.button} onClick={onConfirm}>
            Sí, eliminar
          </button>
          <button style={modalStyles.button} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

const CritTableEditor: React.FC<{ table: CritTable; onSave: (updatedTable: CritTable) => void; }> = ({ table, onSave }) => {
  const [rows, setRows] = useState<CritRow[]>(table.rows);
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; column: 'A' | 'B' | 'C' | 'D' | 'E'; data: CritCell } | null>(null);

  const columns = React.useMemo<ColumnDef<CritRow>[]>(
    () => [
      { header: 'Lower', accessorKey: 'lower' },
      { header: 'Upper', accessorKey: 'upper' },
      { header: 'A', accessorKey: 'A' },
      { header: 'B', accessorKey: 'B' },
      { header: 'C', accessorKey: 'C' },
      { header: 'D', accessorKey: 'D' },
      { header: 'E', accessorKey: 'E' },
    ],
    []
  );

  const reactTableInstance = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCellClick = (rowIndex: number, column: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setSelectedCell({ rowIndex, column, data: rows[rowIndex][column] || { text: '', metadata: [] } });
  };

  const handleSaveCell = (rowIndex: number, column: 'A' | 'B' | 'C' | 'D' | 'E', updatedData: CritCell) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][column] = updatedData;
    setRows(updatedRows);
    setSelectedCell(null);
  };

  const handleSave = () => {
    onSave({ ...table, rows });
  };

  return (
    <div style={styles.editorContainer}>
      <h2>Editar Tabla: {table.name}</h2>
      <table style={styles.editorTable}>
        <thead>
          {reactTableInstance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th key={column.id} style={styles.tableHeader}>
                  {flexRender(column.column.columnDef.header, column.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {reactTableInstance.getRowModel().rows.map((row, i) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={styles.tableCell}
                    onClick={() => handleCellClick(i, cell.column.id as 'A' | 'B' | 'C' | 'D' | 'E')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button style={styles.saveButton} onClick={handleSave}>Guardar Tabla</button>
      {selectedCell && (
        <EditModal
          cellData={selectedCell}
          onSave={handleSaveCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
};

interface EditModalProps {
  cellData: { rowIndex: number; column: 'A' | 'B' | 'C' | 'D' | 'E'; data: CritCell };
  onSave: (rowIndex: number, column: 'A' | 'B' | 'C' | 'D' | 'E', updatedData: CritCell) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ cellData, onSave, onClose }) => {
  const [text, setText] = useState(cellData.data.text || '');
  const [metadata, setMetadata] = useState(cellData.data.metadata || []);

  const handleSave = () => {
    onSave(cellData.rowIndex, cellData.column, { text, metadata });
  };

  const addMetadata = () => {
    setMetadata([...metadata, { DESC: '' }]);
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3>Editar Celda</h3>
        <textarea style={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} />
        <h4>Metadatos</h4>
        {metadata.map((meta, index) => (
          <div key={index} style={styles.metadataRow}>
            <select style={styles.select} onChange={(e) => {
              const updatedMetadata = [...metadata];
              updatedMetadata[index] = { [e.target.value]: '' };
              setMetadata(updatedMetadata);
            }}>
              <option value="DESC">DESC</option>
              <option value="HP">HP</option>
              <option value="STUN">STUN</option>
            </select>
            <input
              type="text"
              placeholder="Valor"
              value={Object.values(meta)[0] || ''}
              onChange={(e) => {
                const updatedMetadata = [...metadata];
                const key = Object.keys(meta)[0];
                updatedMetadata[index] = { [key]: e.target.value };
                setMetadata(updatedMetadata);
              }}
              style={styles.input}
            />
          </div>
        ))}
        <button style={styles.button} onClick={addMetadata}>Añadir Metadato</button>
        <button style={styles.button} onClick={handleSave}>Guardar</button>
        <button style={styles.button} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 700,
    margin: '2rem auto',
    fontFamily: 'sans-serif'
  },
  formContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem'
  },
  button: {
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
    border: '1px solid #ddd',
  },
  actionButton: {
    marginRight: '0.5rem',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer'
  },
  editorContainer: {
    margin: '2rem 0',
  },
  editorTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
  },
  saveButton: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '1rem',
  },
  metadataRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  select: {
    flex: 1,
  },
  input: {
    flex: 2,
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left',
  },
  tableCell: {
    borderBottom: '1px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left',
  },
}

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    padding: '2rem',
    maxWidth: 400,
    width: '80%'
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  }
}

export default App

