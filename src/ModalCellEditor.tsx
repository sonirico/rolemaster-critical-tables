import React, { useState, useEffect } from 'react';
import { CritColumn, CritCell, EffectGroup, isEffectComplex, EffectComplex, effectNames } from './types';

interface EditModalProps {
    cellData: { rowIndex: number; column: CritColumn; data: CritCell };
    onSave: (rowIndex: number, column: CritColumn, updatedData: CritCell) => void;
    onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ cellData, onSave, onClose }) => {
    const [text, setText] = useState(cellData.data.text || '');
    const [effectGroups, setEffectGroups] = useState<EffectGroup[]>([]);

    useEffect(() => {
        setEffectGroups(cellData.data.metadata || []);
    }, [cellData]);

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
        const cleanedEffectGroups = effectGroups.map(group => {
            const cleanedGroup: EffectGroup = {};
            Object.entries(group).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    cleanedGroup[key as keyof EffectGroup] = value;
                }
            });
            return cleanedGroup;
        });
        onSave(cellData.rowIndex, cellData.column, { text, metadata: cleanedEffectGroups });
    };

    const addEffectGroup = () => {
        setEffectGroups([...effectGroups, {}]);
    };

    const addEffect = (groupIndex: number) => {
        const updatedEffectGroups = [...effectGroups];
        const usedEffects = Object.keys(updatedEffectGroups[groupIndex]);
        const nextEffect = effectNames.find(effect => !usedEffects.includes(effect));
        if (nextEffect) {
            updatedEffectGroups[groupIndex] = { ...updatedEffectGroups[groupIndex], [nextEffect]: '' };
            setEffectGroups(updatedEffectGroups);
        }
    };

    const removeEffectGroup = (groupIndex: number) => {
        const updatedEffectGroups = effectGroups.filter((_, index) => index !== groupIndex);
        setEffectGroups(updatedEffectGroups);
    };

    const removeEffect = (groupIndex: number, effectKey: keyof EffectGroup) => {
        const updatedEffectGroups = [...effectGroups];
        delete updatedEffectGroups[groupIndex][effectKey];
        setEffectGroups(updatedEffectGroups);
    };

    const handleEffectChange = (e: React.ChangeEvent<HTMLInputElement>, groupIndex: number, key: keyof EffectGroup, field?: keyof EffectComplex) => {
        const value = e.target.value === '' ? undefined : isEffectComplex(key) ? Number(e.target.value) : e.target.value;
        const updatedEffectGroups = [...effectGroups];
        if (field) {
            updatedEffectGroups[groupIndex][key] = { ...updatedEffectGroups[groupIndex][key] as EffectGroup, [field]: value };
        } else {
            updatedEffectGroups[groupIndex][key] = value;
        }
        setEffectGroups(updatedEffectGroups);
    };

    const renderEffectInput = (key: string, value: any, groupIndex: number) => {
        if (isEffectComplex(key)) {
            return (
                <>
                    <input
                        type="number"
                        placeholder="VALUE"
                        value={value?.VALUE ?? ''}
                        onChange={(e) => handleEffectChange(e, groupIndex, key as keyof EffectGroup, 'VALUE')}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="ROUNDS"
                        value={value?.ROUNDS ?? ''}
                        onChange={(e) => handleEffectChange(e, groupIndex, key as keyof EffectGroup, 'ROUNDS')}
                        style={styles.input}
                    />
                </>
            );
        }
        return (
            <input
                type={key === 'DESC' ? 'text' : 'number'}
                placeholder="Valor"
                value={value ?? ''}
                onChange={(e) => handleEffectChange(e, groupIndex, key as keyof EffectGroup)}
                style={styles.input}
            />
        );
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3>Editar Celda</h3>
                <textarea style={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} />
                <h4>Grupos de Efectos</h4>
                <div style={styles.effectGroupsContainer}>
                    {effectGroups.map((group, groupIndex) => (
                        <div key={groupIndex} style={styles.effectGroup}>
                            {Object.entries(group).map(([key, value]) => (
                                <div key={key} style={styles.effectRow}>
                                    <select
                                        style={styles.select}
                                        value={key}
                                        onChange={(e) => {
                                            const updatedEffectGroups = [...effectGroups];
                                            const newKey = e.target.value as keyof EffectGroup;
                                            updatedEffectGroups[groupIndex] = { ...updatedEffectGroups[groupIndex], [newKey]: value };
                                            delete updatedEffectGroups[groupIndex][key as keyof EffectGroup];
                                            setEffectGroups(updatedEffectGroups);
                                        }}
                                    >
                                        {effectNames.map(effect => (
                                            <option key={effect} value={effect}>{effect}</option>
                                        ))}
                                    </select>
                                    {renderEffectInput(key, value, groupIndex)}
                                    <button
                                        style={styles.removeButton}
                                        onClick={() => removeEffect(groupIndex, key as keyof EffectGroup)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button style={styles.addButton} onClick={() => addEffect(groupIndex)}>Añadir Efecto</button>
                            <button style={styles.removeButton} onClick={() => removeEffectGroup(groupIndex)}>Eliminar Grupo</button>
                        </div>
                    ))}
                </div>
                <button style={styles.addButton} onClick={addEffectGroup}>Añadir Grupo de Efectos</button>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleSave}>Guardar</button>
                    <button style={styles.button} onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '600px',
        maxWidth: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
};

const styles: { [key: string]: React.CSSProperties } = {
    textarea: {
        width: '100%',
        height: '100px',
        marginBottom: '1rem',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    effectGroupsContainer: {
        maxHeight: '50vh',
        overflowY: 'auto',
    },
    effectGroup: {
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
    },
    effectRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    select: {
        marginRight: '0.5rem',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    input: {
        flex: 1,
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginRight: '0.5rem',
    },
    button: {
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    addButton: {
        marginTop: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
    },
    removeButton: {
        marginLeft: '0.5rem',
        padding: '0.5rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#dc3545',
        color: '#fff',
        cursor: 'pointer',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
    },
};

export default EditModal;