import React, { useState } from 'react';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { CritTable, CritRow, CritCell, CritColumn } from './types';
import EditModal from './ModalCellEditor';

const TableEditor: React.FC<{ table: CritTable; onSave: (updatedTable: CritTable) => void; }> = ({ table, onSave }) => {
  const [rows, setRows] = useState<CritRow[]>(table.rows);
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; column: CritColumn; data: CritCell | undefined } | null>(null);

  const columns = React.useMemo<ColumnDef<CritRow>[]>(
    () => [
      { header: 'Lower', accessorKey: 'lower' },
      { header: 'Upper', accessorKey: 'upper' },
      {
        header: 'A', accessorKey: 'A', cell: info => (
          <div>
            <div>{info.getValue<CritCell>().text}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '4px 0' }} />
            <div>{JSON.stringify(info.getValue<CritCell>().metadata)}</div>
          </div>
        )
      },
      {
        header: 'B', accessorKey: 'B', cell: info => (
          <div>
            <div>{info.getValue<CritCell>().text}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '4px 0' }} />
            <div>{JSON.stringify(info.getValue<CritCell>().metadata)}</div>
          </div>
        )
      },
      {
        header: 'C', accessorKey: 'C', cell: info => (
          <div>
            <div>{info.getValue<CritCell>().text}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '4px 0' }} />
            <div>{JSON.stringify(info.getValue<CritCell>().metadata)}</div>
          </div>
        )
      },
      {
        header: 'D', accessorKey: 'D', cell: info => (
          <div>
            <div>{info.getValue<CritCell>().text}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '4px 0' }} />
            <div>{JSON.stringify(info.getValue<CritCell>().metadata)}</div>
          </div>
        )
      },
      {
        header: 'E', accessorKey: 'E', cell: info => (
          <div>
            <div>{info.getValue<CritCell>().text}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '4px 0' }} />
            <div>{JSON.stringify(info.getValue<CritCell>().metadata)}</div>
          </div>
        )
      },
    ],
    []
  );

  const reactTableInstance = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCellClick = (rowIndex: number, column: CritColumn) => {
    setSelectedCell({ rowIndex, column, data: rows[rowIndex][column] || { text: '', metadata: [] } });
  };

  const handleSaveCell = (rowIndex: number, column: CritColumn, updatedData: CritCell) => {
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
                    onClick={() => handleCellClick(i, cell.column.id as CritColumn)}
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
          cellData={{ ...selectedCell, data: selectedCell.data || { text: '', metadata: [] } }}
          onSave={handleSaveCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 900,
    margin: '2rem auto',
    fontFamily: 'Arial, sans-serif',
    padding: '1rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  formContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  mainButtonHover: {
    backgroundColor: '#0056b3',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  actionButton: {
    marginRight: '0.5rem',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  actionButtonHover: {
    backgroundColor: '#218838',
  },
  editorContainer: {
    margin: '2rem 0',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  },
  editorTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
  },
  saveButton: {
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  saveButtonHover: {
    backgroundColor: '#0056b3',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  metadataRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    alignItems: 'center',
  },
  select: {
    flex: '0 1 80px',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
  },
  tableCell: {
    borderBottom: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
  },
  metadataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
  },
  tableCellLabel: {
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
};

export default TableEditor;