import React, { useState } from 'react';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { CritTable, CritRow, CritCell, CritColumn } from './types';
import EditModal from './ModalCellEditor';
import { updateTable } from './RepositoryTable';

const TableEditor: React.FC<{ table: CritTable; onSave: (updatedTable: CritTable) => void; }> = ({ table, onSave }) => {
  const [rows, setRows] = useState<CritRow[]>(table.rows);
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; column: CritColumn; data: CritCell | undefined } | null>(null);

  const handleSaveNumberCell = (rowIndex: number, column: 'lower' | 'upper', updatedValue: number) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][column] = updatedValue;
    setRows(updatedRows);
    const updatedTable = { ...table, rows: updatedRows };
    updateTable(updatedTable);
  };

  const handleSaveCritCell = (rowIndex: number, column: CritColumn, updatedData: CritCell) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][column] = updatedData;
    setRows(updatedRows);
    setSelectedCell(null);
    const updatedTable = { ...table, rows: updatedRows };
    updateTable(updatedTable);
  };

  const NumberCell: React.FC<{ value: number; rowIndex: number; column: 'lower' | 'upper' }> = ({ value, rowIndex, column }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleBlur = () => {
      handleSaveNumberCell(rowIndex, column, inputValue);
      setIsEditing(false);
    };

    return isEditing ? (
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(Number(e.target.value))}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <div onClick={() => setIsEditing(true)}>{value}</div>
    );
  };

  const columns = React.useMemo<ColumnDef<CritRow>[]>(
    () => [
      {
        header: 'Lower',
        accessorKey: 'lower',
        cell: info => <NumberCell value={info.getValue<number>()} rowIndex={info.row.index} column="lower" />
      },
      {
        header: 'Upper',
        accessorKey: 'upper',
        cell: info => <NumberCell value={info.getValue<number>()} rowIndex={info.row.index} column="upper" />
      },
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

  const handleSave = () => {
    onSave({ ...table, rows });
    updateTable({ ...table, rows });
  };

  return (
    <div style={styles.editorContainer}>
      <h2>Editando tabla: {table.name}</h2>
      <table style={styles.editorTable}>
        <thead>
          {reactTableInstance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(column => {
                let extraStyles = {};
                switch (column.id) {
                  case 'lower':
                  case 'upper':
                    extraStyles = { width: '100px' };
                    break;
                  default:
                    extraStyles = {};
                }

                return (
                  <th key={column.id} style={{ ...styles.tableHeader, ...extraStyles }}>
                    {flexRender(column.column.columnDef.header, column.getContext())}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {reactTableInstance.getRowModel().rows.map((row, i) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const colId = cell.column.id;
                  if (colId === 'lower' || colId === 'upper') {
                    return (
                      <td key={cell.id} style={styles.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  }
                  return (
                    <td
                      key={cell.id}
                      style={styles.tableCell}
                      onClick={() => handleCellClick(i, colId as CritColumn)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button style={styles.saveButton} onClick={handleSave}>Guardar Tabla</button>
      {
        selectedCell && (
          <EditModal
            cellData={{ ...selectedCell, data: selectedCell.data || { text: '', metadata: [] } }}
            onSave={handleSaveCritCell}
            onClose={() => setSelectedCell(null)}
          />
        )
      }
    </div >
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
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
};

export default TableEditor;