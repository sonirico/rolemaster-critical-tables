import ReactDOM from 'react-dom';
import { modalStyles } from './styles';

interface DeleteModalProps {
    tableName: string
    onConfirm: () => void
    onCancel: () => void
}

function ModalTableDelete({ tableName, onConfirm, onCancel }: DeleteModalProps) {
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
