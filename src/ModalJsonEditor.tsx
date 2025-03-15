import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CritTable } from './types';
import { modalStyles } from './styles';

interface ModalJsonEditorProps {
    table: CritTable;
    onUpdate: (updatedTable: CritTable) => void;
    onClose: () => void;
}

const ModalJsonEditor: React.FC<ModalJsonEditorProps> = ({ table, onUpdate, onClose }) => {
    const [json, setJson] = useState<string>(JSON.stringify(table, null, 2));

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

    const handleUpdate = () => {
        try {
            const updatedTable: CritTable = JSON.parse(json);
            onUpdate(updatedTable);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    };

    return ReactDOM.createPortal(
        <div style={modalStyles.fullScreenOverlay}>
            <div style={modalStyles.fullScreenModal}>
                <button style={modalStyles.closeButton} onClick={onClose}>×</button>
                <h2>Editar Tabla como JSON</h2>
                <textarea
                    style={modalStyles.fullScreenTextarea}
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                />
                <div style={modalStyles.btnRow}>
                    <button style={modalStyles.button} onClick={handleUpdate}>
                        Actualizar
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
