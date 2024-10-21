import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Utility function to convert data to CSV
export const exportToCSV = (data, fileName) => {
  const headers = [
    'Sector', 'Hazard', 'Climate Threat Score', 'Exposure Score', 
    'Sensitivity Score', 'Adaptive Capacity Score', 'Vulnerability Score', 
    'Risk Score', 'Year'
  ];

  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    )
  ];

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

// Create styles for PDF
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { margin: 10, padding: 10, borderBottom: '1 solid #ccc' },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 5 },
});

// Create PDF document
const MyDocument = ({ data, city }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Climate Risk Assessment for {city}</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.label}>Sector:</Text>
          <Text style={styles.text}>{item.Sector || 'N/A'}</Text>
          <Text style={styles.label}>Hazard:</Text>
          <Text style={styles.text}>{item.Hazard || 'N/A'}</Text>
          <Text style={styles.label}>Climate Threat Score:</Text>
          <Text style={styles.text}>{item['Climate Threat Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Exposure Score:</Text>
          <Text style={styles.text}>{item['Exposure Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Sensitivity Score:</Text>
          <Text style={styles.text}>{item['Sensitivity Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Adaptive Capacity Score:</Text>
          <Text style={styles.text}>{item['Adaptive Capacity Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Vulnerability Score:</Text>
          <Text style={styles.text}>{item['Vulnerability Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Risk Score:</Text>
          <Text style={styles.text}>{item['Risk Score'] || 'N/A'}</Text>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.text}>{item.Year || 'N/A'}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

// Utility function to export PDF
export const ExportToPDF = ({ data, city }) => (
  <PDFDownloadLink document={<MyDocument data={data} city={city} />} fileName={`${city}_climate_risk_assessment.pdf`}>
    {({ blob, url, loading, error }) => (
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        {loading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    )}
  </PDFDownloadLink>
);