import React from 'react';
import { FaFire, FaSnowflake, FaBolt, FaShieldAlt, FaHeart, FaPlusCircle, FaMinusCircle } from 'react-icons/fa'; // Ejemplo de iconos, puedes agregar más según sea necesario
import { EffectGroup, isEffectComplex, isEffectNumeric } from './types';

interface EffectIconsProps {
    metadata: EffectGroup[];
}

const styles = {
    list: {
        padding: 0,
        margin: 0,
        listStyleType: 'none',
    },
    desc: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        marginBottom: '0.5rem',
    },
    nestedList: {
        paddingLeft: '1rem',
        margin: 0,
        listStyleType: 'none',
    },
    effectItem: {
        marginRight: '0.5rem',
        fontSize: '0.75rem',
        fontStyle: 'italic',
    },
};

const EffectIcons: React.FC<EffectIconsProps> = ({ metadata }) => {
    const renderIcon = (key: string) => {
        switch (key) {
            case 'HP':
                return <FaHeart />;
            case 'P':
                return <FaShieldAlt />;
            case 'NP':
                return <FaMinusCircle />;
            case 'BONUS':
                return <FaPlusCircle />;
            case 'STUN':
                return <FaBolt />;
            case 'PE':
                return <FaSnowflake />;
            case 'HPR':
                return <FaFire />;
            default:
                return null;
        }
    };

    const renderEffect = (key: string, value: { VALUE?: number; ROUNDS?: number } | number) => {
        if (isEffectComplex(key)) {
            const valueText = typeof value === 'object' && value.VALUE !== undefined ? `${value.VALUE}` : '';
            const roundsText = typeof value === 'object' && value.ROUNDS !== undefined ? ` (${value.ROUNDS} rounds)` : '';
            return `${valueText}${roundsText}`;
        }
        if (isEffectNumeric(key)) {
            return value.toString();
        }
        return value;
    };

    return (
        <ul style={styles.list}>
            {metadata.map((effectGroup, index) => (
                <li key={index}>
                    {effectGroup.DESC && <div style={styles.desc}>{effectGroup.DESC}</div>}
                    <ul style={styles.nestedList}>
                        {Object.entries(effectGroup).map(([key, value]) => (
                            key !== 'DESC' && (
                                <li key={key} style={styles.effectItem}>
                                    {renderIcon(key)} {key}: {renderEffect(key, value)}
                                </li>
                            )
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

export default EffectIcons;
