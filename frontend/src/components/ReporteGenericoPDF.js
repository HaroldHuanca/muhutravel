import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#cccccc', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  metaData: { fontSize: 9, color: '#555', textAlign: 'right' },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0', padding: 5 },
  tableCol: { borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  cellTextHeader: { fontSize: 9, fontWeight: 'bold', color: '#000' },
  cellText: { fontSize: 8, color: '#333' }
});

const ReporteGenericoPDF = ({ title, columns, data }) => {
  // Calculamos el ancho de columna automáticamente
  const colWidth = (100 / columns.length) + '%';

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <View>
             <Text style={styles.title}>{title}</Text>
             <Text style={{fontSize: 10, marginTop: 5}}>Sistema de Gestión MuhuTravel</Text>
          </View>
          <View>
             <Text style={styles.metaData}>Fecha: {new Date().toLocaleDateString()}</Text>
             <Text style={styles.metaData}>Registros: {data.length}</Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Cabecera */}
          <View style={styles.tableRow}>
            {columns.map((col, index) => (
              <View key={index} style={{ ...styles.tableColHeader, width: colWidth }}>
                <Text style={styles.cellTextHeader}>{col.label}</Text>
              </View>
            ))}
          </View>

          {/* Datos */}
          {data.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={{ ...styles.tableCol, width: colWidth }}>
                  {/* Aquí accede a la propiedad del objeto usando la key de la columna */}
                  <Text style={styles.cellText}>
                    {item[col.key] !== null && item[col.key] !== undefined ? String(item[col.key]) : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Pie de página */}
        <Text style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'gray' }}>
            Reporte generado automáticamente - MuhuTravel
        </Text>
      </Page>
    </Document>
  );
};

export default ReporteGenericoPDF;