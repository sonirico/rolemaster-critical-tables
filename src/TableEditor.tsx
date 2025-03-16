import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { CritTable, CritRow, CritCell, CritColumn } from './types';
import EditModal from './ModalCellEditor';
import { updateTable } from './RepositoryTable';
import EffectIcons from './EffectIcons'; // Importamos el nuevo componente

const TableContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 100px repeat(5, 1fr); // Ajustamos el tamaño de las columnas
  gap: 1rem;
`;

const CellContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover pre {
    display: block;
  }
`;

const CellText = styled.div`
  margin-bottom: 0.5rem;
`;

const CellJson = styled.pre`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem;
  z-index: 1;
  white-space: pre-wrap;
  word-break: break-all;
  width: 100%;
`;

const TableEditor: React.FC<{ table: CritTable; onSave: (updatedTable: CritTable) => void; }> = ({ table, onSave }) => {
  const [rows, setRows] = useState<CritRow[]>(table.rows);
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    column: CritColumn;
    data: CritCell | undefined;
    lower?: number;
    upper?: number;
  } | null>(null);

  // Añadir useEffect para actualizar las filas cuando cambie la tabla
  useEffect(() => {
    setRows(table.rows);
  }, [table]);

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
          <CellContainer>
            <CellText>{info.getValue<CritCell>().text}</CellText>
            <EffectIcons metadata={info.getValue<CritCell>().metadata} />
            <CellJson>{JSON.stringify(info.getValue<CritCell>().metadata, null, 2)}</CellJson>
          </CellContainer>
        )
      },
      {
        header: 'B', accessorKey: 'B', cell: info => (
          <CellContainer>
            <CellText>{info.getValue<CritCell>().text}</CellText>
            <EffectIcons metadata={info.getValue<CritCell>().metadata} />
            <CellJson>{JSON.stringify(info.getValue<CritCell>().metadata, null, 2)}</CellJson>
          </CellContainer>
        )
      },
      {
        header: 'C', accessorKey: 'C', cell: info => (
          <CellContainer>
            <CellText>{info.getValue<CritCell>().text}</CellText>
            <EffectIcons metadata={info.getValue<CritCell>().metadata} />
            <CellJson>{JSON.stringify(info.getValue<CritCell>().metadata, null, 2)}</CellJson>
          </CellContainer>
        )
      },
      {
        header: 'D', accessorKey: 'D', cell: info => (
          <CellContainer>
            <CellText>{info.getValue<CritCell>().text}</CellText>
            <EffectIcons metadata={info.getValue<CritCell>().metadata} />
            <CellJson>{JSON.stringify(info.getValue<CritCell>().metadata, null, 2)}</CellJson>
          </CellContainer>
        )
      },
      {
        header: 'E', accessorKey: 'E', cell: info => (
          <CellContainer>
            <CellText>{info.getValue<CritCell>().text}</CellText>
            <EffectIcons metadata={info.getValue<CritCell>().metadata} />
            <CellJson>{JSON.stringify(info.getValue<CritCell>().metadata, null, 2)}</CellJson>
          </CellContainer>
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
    if (column === 'lower' || column === 'upper') return;

    setSelectedCell({
      rowIndex,
      column,
      data: rows[rowIndex][column] || { text: '', metadata: [] },
      lower: rows[rowIndex].lower,
      upper: rows[rowIndex].upper
    });
  };

  const handleSave = () => {
    onSave({ ...table, rows });
    updateTable({ ...table, rows });
  };

  return (
    <div style={styles.editorContainer}>
      <h2>Editando tabla: {table.name}</h2>
      <TableContainer>
        <div style={styles.tableHeader}>Lower</div>
        <div style={styles.tableHeader}>Upper</div>
        <div style={styles.tableHeader}>A</div>
        <div style={styles.tableHeader}>B</div>
        <div style={styles.tableHeader}>C</div>
        <div style={styles.tableHeader}>D</div>
        <div style={styles.tableHeader}>E</div>
        {reactTableInstance.getRowModel().rows.map((row, i) => (
          <React.Fragment key={row.id}>
            {row.getVisibleCells().map(cell => (
              <div
                key={cell.id}
                style={styles.tableCell}
                onClick={() => handleCellClick(i, cell.column.id as CritColumn)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </React.Fragment>
        ))}
      </TableContainer>
      <button style={styles.saveButton} onClick={handleSave}>Guardar Tabla</button>
      {
        selectedCell && (
          <EditModal
            cellData={selectedCell}
            onSave={handleSaveCritCell}
            onClose={() => setSelectedCell(null)}
          />
        )
      }
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  editorContainer: {
    margin: '2rem 0',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f4f4f4',
  },
  tableHeader: {
    backgroundColor: '#e9ecef',
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
    fontSize: '0.875rem',
    position: 'relative',
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default TableEditor;