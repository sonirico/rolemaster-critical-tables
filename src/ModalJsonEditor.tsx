import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CritTable } from './types';
import { modalStyles } from './styles';
import { updateTable } from './RepositoryTable';

interface ModalJsonEditorProps {
    table: CritTable;
    onUpdate: (updatedTable: CritTable) => void;
    onClose: () => void;
}

const ModalJsonEditor: React.FC<ModalJsonEditorProps> = ({ table, onUpdate, onClose }) => {
    const [jsonText, setJsonText] = useState<string>('');

    useEffect(() => {
        setJsonText(JSON.stringify(table, null, 2));
    }, [table]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleSave = () => {
        try {
            const updatedTable: CritTable = JSON.parse(jsonText);
            // First update localStorage
            const tables = updateTable(updatedTable);

            // Then force a refresh of the parent component
            onUpdate(updatedTable);

            // Only close after everything is done
            onClose();
        } catch (error) {
            alert(`Error parsing JSON: ${error}`);
            console.error('Error parsing JSON:', error);
        }
    };

    return ReactDOM.createPortal(
        <div style={modalStyles.fullScreenOverlay}>
            <div style={modalStyles.fullScreenModal}>
                <button style={modalStyles.closeButton} onClick={onClose}>×</button>
                <h2>Editar {table.name} como JSON</h2>
                <textarea
                    style={modalStyles.fullScreenTextarea}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                />
                <div style={modalStyles.btnRow}>
                    <button style={modalStyles.button} onClick={handleSave}>
                        Guardar
                    </button>
                    <button style={modalStyles.button} onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default ModalJsonEditor;
