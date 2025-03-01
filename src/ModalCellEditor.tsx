import React, { useState } from 'react';
import { CritColumn, CritCell } from './types';

interface EditModalProps {
    cellData: { rowIndex: number; column: CritColumn; data: CritCell };
    onSave: (rowIndex: number, column: CritColumn, updatedData: CritCell) => void;
    onClose: () => void;
}

const EditorCellModal: React.FC<EditModalProps> = ({ cellData, onSave, onClose }) => {
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
        </div >
    );
}

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



const modalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        background: '#fff',
        padding: '2rem',
        maxWidth: 600,
        width: '90%',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    btnRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        cursor: 'pointer',
    },
};



export default EditorCellModal;