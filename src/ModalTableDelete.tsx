import ReactDOM from 'react-dom';
import { modalStyles } from './styles';
import { useEffect } from 'react';

interface DeleteModalProps {
    tableName: string
    onConfirm: () => void
    onCancel: () => void
}

function ModalTableDelete({ tableName, onConfirm, onCancel }: DeleteModalProps) {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onCancel]);

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

export default ModalTableDelete
