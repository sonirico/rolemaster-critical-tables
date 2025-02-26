export interface MetadatumComplex {
    ROUNDS?: number;
    VALUE?: number;
}

export type MetadatumNumeric = number;

export interface Metadatum {
    DESC?: string;
    HP?: number;
    P?: MetadatumComplex;
    NP?: MetadatumNumeric;
    STUN?: MetadatumComplex;
    BONUS?: MetadatumComplex;
    PE?: MetadatumComplex;
    HPR?: MetadatumNumeric;
}

export interface CritCell {
    text: string;
    metadata: Metadatum[];
}

export interface CritRow {
    lower?: number;
    upper?: number;
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
