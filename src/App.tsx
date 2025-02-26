import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

interface Metadatum {
  HP?: number
}

interface CritCell {
  text: string;

  metadata: Metadatum[]
}
interface CritRow {
  // Ajusta esta interfaz a tu gusto
  // para representar cada fila de tu tabla
  lower?: string
  upper?: string
  A?: CritCell
  B?: CritCell
  C?: CritCell
  D?: CritCell
  E?: CritCell
}

interface CritTable {
  id: number
  filename: string;
  name: string
  rows: CritRow[]
}

function App() {
  const [critTables, setCritTables] = useState<CritTable[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [tableToDelete, setTableToDelete] = useState<CritTable | null>(null)
  const [newTableName, setNewTableName] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('critTables')
    if (stored) {
      setCritTables(JSON.parse(stored) as CritTable[])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('critTables', JSON.stringify(critTables))
  }, [critTables])

  const handleCreate = (): void => {
    if (!newTableName.trim()) return
    const newTable: CritTable = {
      id: Date.now(),
      name: newTableName.trim(),
      filename: newTableName.toLocaleLowerCase().split(' ').filter(x => x.length).join('_'),
      rows: []
    }
    setCritTables((prev) => [...prev, newTable])
    setNewTableName('')
  }

  const requestDelete = (table: CritTable): void => {
    setTableToDelete(table)
    setShowDeleteModal(true)
  }

  const confirmDelete = (): void => {
    if (tableToDelete) {
      setCritTables(critTables.filter((t) => t.id !== tableToDelete.id))
    }
    setShowDeleteModal(false)
    setTableToDelete(null)
  }

  const cancelDelete = (): void => {
    setShowDeleteModal(false)
    setTableToDelete(null)
  }

  const handleClone = (table: CritTable): void => {
    const cloned: CritTable = {
      ...table,
      id: Date.now(),
      name: table.name + ' (copia)'
    }
    setCritTables((prev) => [...prev, cloned])
  }

  const handleEdit = (table: CritTable): void => {
    alert('Editar tabla: ' + table.name + '. (Pendiente de implementación)')
  }

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
                  style={{ ...styles.actionButton, backgroundColor: '#f33' }}
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
    </div>
  )
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
    borderCollapse: 'collapse'
  },
  actionButton: {
    marginRight: '0.5rem',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer'
  }
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
