import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Utility function to convert data to CSV
export const exportToCSV = (data, fileName) => {
  const headers = [
    'Sector',
    'Hazard',
    'Climate Threat Score',
    'Exposure Score',
    'Sensitivity Score',
    'Adaptive Capacity Score',
    'Vulnerability Score',
    'Risk Score',
    'Risk Level',
    'Year'
  ];

  const defineRiskLevel = (score) => {
    if (score >= 0.75) return "Very High";
    if (score >= 0.5) return "High";
    if (score >= 0.25) return "Medium";
    return "Low";
  };

  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => {
      const values = headers.map(header => {
        if (header === 'Risk Level') {
          return JSON.stringify(defineRiskLevel(row['Risk Score']));
        }
        return JSON.stringify(row[header] || '');
      });
      return values.join(',');
    })
  ];

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#3B4BDF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#575757',
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: '1 solid #E4E4E4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '40%',
    color: '#575757',
  },
  value: {
    fontSize: 12,
    width: '60%',
  },
  riskScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E80A0A',
  }
});

const getRiskColor = (score) => {
  if (score >= 0.75) return '#E80A0A';
  if (score >= 0.5) return '#E06835';
  if (score >= 0.25) return '#F59E0B';
  return '#3B82F6';
};

// Create PDF document
const MyDocument = ({ data, city }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Climate Risk Assessment</Text>
        <Text style={styles.subtitle}>{city}</Text>
      </View>

      {data
        .sort((a, b) => b['Risk Score'] - a['Risk Score'])
        .map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{item.Sector} - {item.Hazard}</Text>

            {[
              { label: 'Risk Score', value: item['Risk Score'], isRisk: true },
              { label: 'Climate Threat Score', value: item['Climate Threat Score'] },
              { label: 'Exposure Score', value: item['Exposure Score'] },
              { label: 'Sensitivity Score', value: item['Sensitivity Score'] },
              { label: 'Adaptive Capacity Score', value: item['Adaptive Capacity Score'] },
              { label: 'Vulnerability Score', value: item['Vulnerability Score'] },
              { label: 'Year', value: item.Year },
            ].map(({ label, value, isRisk }, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={[styles.value, isRisk && styles.riskScore]}>
                  {value?.toFixed(2) || 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        ))}
    </Page>
  </Document>
);

// Export PDF Component
export const ExportToPDF = ({ data, city }) => (
  <PDFDownloadLink 
    document={<MyDocument data={data} city={city} />} 
    fileName={`${city}_climate_risk_assessment.pdf`}
    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
  >
    {({ loading }) => (loading ? 'Generating PDF...' : 'Export to PDF')}
  </PDFDownloadLink>
);