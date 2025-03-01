
export const styles: { [key: string]: React.CSSProperties } = {
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

export const modalStyles: { [key: string]: React.CSSProperties } = {
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