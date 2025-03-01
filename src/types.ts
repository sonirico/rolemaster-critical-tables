export interface EffectComplex {
    ROUNDS?: number;
    VALUE?: number;
}

export type EffectNumeric = number;

export interface EffectGroup {
    DESC?: string;
    HP?: number;
    P?: EffectComplex;
    NP?: EffectNumeric;
    STUN?: EffectComplex;
    BONUS?: EffectComplex;
    PE?: EffectComplex;
    HPR?: EffectNumeric;
}

export interface CritCell {
    text: string;
    metadata: EffectGroup[];
}

export interface CritRow {
    lower: number;
    upper: number;
    A: CritCell;
    B: CritCell;
    C: CritCell;
    D: CritCell;
    E: CritCell;
}

export interface CritTable {
    id: number;
    filename: string;
    name: string;
    rows: CritRow[];
}

export type CritColumn = 'A' | 'B' | 'C' | 'D' | 'E';

export const effectNames = ['DESC', 'HP', 'STUN', 'P', 'NP', 'BONUS', 'PE', 'HPR'];

export const isEffectComplex = (key: string): boolean => {
    return ['P', 'STUN', 'BONUS', 'PE'].includes(key);
};

export const isEffectNumeric = (key: string): boolean => {
    return ['HP', 'NP', 'HPR'].includes(key);
};