import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { modalStyles } from './styles';

interface ModalImportJsonProps {
    onImport: (json: string) => void;
    onClose: () => void;
}

const ModalImportJson: React.FC<ModalImportJsonProps> = ({ onImport, onClose }) => {
    const [json, setJson] = useState<string>('');

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

    const handleImport = () => {
        onImport(json);
    };

    return ReactDOM.createPortal(
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2>Importar desde JSON</h2>
                <textarea
                    style={modalStyles.textarea}
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                    placeholder="Pega aquí el JSON de la tabla"
                />
                <div style={modalStyles.btnRow}>
                    <button style={modalStyles.button} onClick={handleImport}>
                        Importar
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

export default ModalImportJson;
