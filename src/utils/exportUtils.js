import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import {getReductionPotential, toSentenceCase, toTitleCase} from './helpers';

const convertToCSV = (data) => {
  if (!data || !data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] ?? '';
        if (cell.toString().includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
};

export const exportToCSV = (data, filename) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

const generatePdfReport = (cityName, ccraData, qualitativeScore, customRiskLevels) => {
  const doc = new jsPDF();

  // Page configuration
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const horizontalMargin = 20;
  const topMargin = 20;
  const bottomMargin = 25; // Increased bottom margin for page numbers
  const textWidth = pageWidth - (2 * horizontalMargin);

  let currentY = topMargin;

  // Helper functions
  const addNewPage = () => {
    doc.addPage();
    currentY = topMargin;
    return currentY;
  };

  const checkForNewPage = (requiredSpace) => {
    if (currentY + requiredSpace > pageHeight - bottomMargin) {
      return addNewPage();
    }
    return currentY;
  };

  const addWrappedText = (text, x, y, maxWidth, fontSize = 10, options = {}) => {
    doc.setFontSize(fontSize);

    // Calculate line height based on font size
    const lineHeight = fontSize * 0.5;

    // Split text into lines that fit within maxWidth
    const lines = doc.splitTextToSize(text, maxWidth);

    // Calculate total height needed for this text block
    const totalHeight = lines.length * lineHeight * 1.2; // 1.2 for extra spacing

    // Check if we need a new page for this text block
    y = checkForNewPage(totalHeight);

    // Render text with alignment options if provided
    doc.text(lines, x, y, options);

    // Return the new Y position after the text
    return y + totalHeight;
  };

  const calculateAdjustedVulnerability = (row, resilienceScore) => {
    if (!resilienceScore) return row["Vulnerability Score"];
    const sensitivity = row["Sensitivity Score"];
    return sensitivity * (1 - resilienceScore);
  };

  const calculateAdjustedRiskScore = (row, resilienceScore) => {
    if (!resilienceScore) return row["Risk Score"];
    const hazardScore = row["Climate Threat Score"];
    const exposureScore = row["Exposure Score"];
    const adjustedVulnerability = calculateAdjustedVulnerability(row, resilienceScore);
    return hazardScore * exposureScore * adjustedVulnerability;
  };

  const defineRiskLevel = (score) => {
    if (score >= 0.75) return "Very High";
    if (score >= 0.5) return "High";
    if (score >= 0.25) return "Medium";
    return "Low";
  };

  // ---- Start building the report ----

  // Title Section
  doc.setFontSize(24);
  doc.text('Climate Change Risk Assessment Report', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // City and Date
  doc.setFontSize(16);
  doc.text(`City: ${cityName}`, horizontalMargin, currentY);
  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, horizontalMargin, currentY);
  currentY += 15;

  // Executive Summary
  doc.setFontSize(16);
  doc.text('Executive Summary', horizontalMargin, currentY);
  currentY += 8;

  const summaryText = `This report presents a comprehensive Climate Change Risk Assessment for ${cityName}. ` +
    `The assessment evaluates various climate hazards and their potential impacts across different sectors.`;

  currentY = addWrappedText(summaryText, horizontalMargin, currentY, textWidth, 11);
  currentY += 15; // Extra vertical margin after summary

  // Qualitative Assessment Section (if available)
  if (qualitativeScore !== null) {
    currentY = checkForNewPage(40);
    doc.setFontSize(16);
    doc.text('Qualitative Assessment Results', horizontalMargin, currentY);
    currentY += 8;
    doc.setFontSize(11);
    doc.text(`Resilience Score: ${(qualitativeScore * 100).toFixed(1)}%`, horizontalMargin, currentY);
    currentY += 8;

    const qualitativeNote = 'Note: The risk scores in this report have been adjusted based on the qualitative assessment results.';
    currentY = addWrappedText(qualitativeNote, horizontalMargin, currentY, textWidth, 11);
    currentY += 15; // Extra vertical margin after section
  }

  // Top Risks Section
  currentY = checkForNewPage(80);
  doc.setFontSize(16);
  doc.text('Top Climate Risks', horizontalMargin, currentY);
  currentY += 8;

  const topRisks = [...ccraData]
    .sort((a, b) => {
      const scoreA = qualitativeScore ? calculateAdjustedRiskScore(a, qualitativeScore) : a["Risk Score"];
      const scoreB = qualitativeScore ? calculateAdjustedRiskScore(b, qualitativeScore) : b["Risk Score"];
      return scoreB - scoreA;
    })
    .slice(0, 3);

  topRisks.forEach((risk, index) => {
    // Check if we need a new page for this risk
    currentY = checkForNewPage(50);

    // If we started a new page and it's not the first risk, add section header
    if (currentY === topMargin && index > 0) {
      doc.setFontSize(16);
      doc.text('Top Climate Risks (continued)', horizontalMargin, currentY);
      currentY += 8;
    }

    const riskScore = qualitativeScore ? calculateAdjustedRiskScore(risk, qualitativeScore) : risk["Risk Score"];
    const riskLevel = defineRiskLevel(riskScore);

    // Show risk title with proper wrapping
    const riskTitle = `${index + 1}. ${risk.Hazard} (${risk.Sector})`;
    currentY = addWrappedText(riskTitle, horizontalMargin, currentY, textWidth, 12, { align: 'left' });

    doc.setFontSize(11);
    doc.text(`Risk Score: ${riskScore.toFixed(2)}`, horizontalMargin + 10, currentY);
    currentY += 7;
    doc.text(`Risk Level: ${riskLevel}`, horizontalMargin + 10, currentY);
    currentY += 7;
    doc.text(`Climate Threat Score: ${risk["Climate Threat Score"].toFixed(2)}`, horizontalMargin + 10, currentY);
    currentY += 7;
    doc.text(`Exposure Score: ${risk["Exposure Score"].toFixed(2)}`, horizontalMargin + 10, currentY);
    currentY += 7;
    doc.text(`Sensitivity Score: ${risk["Sensitivity Score"].toFixed(2)}`, horizontalMargin + 10, currentY);
    currentY += 15; // Extra vertical margin between risks
  });

  // Full Assessment Table - force a new page to ensure table starts fresh
  addNewPage();
  doc.setFontSize(16);
  doc.text('Detailed Risk Assessment', horizontalMargin, currentY);
  currentY += 10;

  // Prepare comprehensive table data
  const fullTableHeaders = [
    'Sector',
    'Hazard',
    'Climate\nThreat',
    'Exposure',
    'Sensitivity',
    'Adaptive\nCapacity',
    qualitativeScore ? 'Adjusted\nVulnerability' : 'Vulnerability',
    qualitativeScore ? 'Adjusted\nRisk' : 'Risk Score',
    'Risk\nLevel',
    'Custom\nRisk'
  ];

  const fullTableData = ccraData.map((row, index) => {
    const adjustedRiskScore = qualitativeScore ? calculateAdjustedRiskScore(row, qualitativeScore) : row["Risk Score"];
    const adjustedVulnerability = qualitativeScore ? calculateAdjustedVulnerability(row, qualitativeScore) : row["Vulnerability Score"];

    return [
      row.Sector,
      row.Hazard,
      row["Climate Threat Score"]?.toFixed(2),
      row["Exposure Score"]?.toFixed(2),
      row["Sensitivity Score"]?.toFixed(2),
      qualitativeScore ? qualitativeScore.toFixed(2) : row["Adaptive Capacity Score"]?.toFixed(2),
      adjustedVulnerability?.toFixed(2),
      adjustedRiskScore?.toFixed(2),
      defineRiskLevel(adjustedRiskScore),
      customRiskLevels[index] || defineRiskLevel(adjustedRiskScore)
    ];
  });

  // Add the full table with improved column configuration and cell handling
  doc.autoTable({
    startY: currentY,
    head: [fullTableHeaders],
    body: fullTableData,
    theme: 'grid',
    styles: {
      fontSize: 6.5, // Further reduced font size
      cellPadding: 1, // Minimal padding
      overflow: 'linebreak', // Force text wrapping
      halign: 'center', // Center-align content
      valign: 'middle', // Vertical center alignment
      lineWidth: 0.1, // Thinner grid lines
    },
    headStyles: {
      fillColor: [35, 81, 220],
      fontSize: 7,
      fontStyle: 'bold',
    },
    margin: {
      top: topMargin,
      left: horizontalMargin,
      right: horizontalMargin,
      bottom: bottomMargin
    },
    columnStyles: {
      0: { cellWidth: 21, halign: 'left' },   // Sector - left aligned
      1: { cellWidth: 21, halign: 'left' },   // Hazard - left aligned
      2: { cellWidth: 12 },  // Climate Threat
      3: { cellWidth: 12 },  // Exposure
      4: { cellWidth: 12 },  // Sensitivity
      5: { cellWidth: 12 },  // Adaptive Capacity
      6: { cellWidth: 15 },  // Adjusted Vulnerability
      7: { cellWidth: 12 },  // Adjusted Risk Score
      8: { cellWidth: 10 },  // Risk Level
      9: { cellWidth: 10 }   // Custom Risk Level
    },
    willDrawCell: function(data) {
      // Additional cell customization if needed
      if (data.section === 'body' && typeof data.cell.text === 'string') {
        // Ensure very long text is truncated if needed
        if (data.cell.text.length > 30) {
          data.cell.text = data.cell.text.substring(0, 28) + '...';
        }
      }
    },
    didDrawPage: function(data) {
      // Add header and footer to each page
      doc.setFontSize(9);
      doc.text(`Climate Risk Assessment - ${cityName}`, horizontalMargin, 10);
    }
  });

  // Add page numbers to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  return doc;
};
export const exportCCRAToPDF = (cityName, ccraData, qualitativeScore, customRiskLevels) => {
  const doc = generatePdfReport(cityName, ccraData, qualitativeScore, customRiskLevels);
  doc.save(`${cityName.replace(/\s+/g, '_')}_CCRA_Report.pdf`);
};

const isAdaptation = (type) => type === 'adaptation';

export const exportToPDF = (cityName, mitigationData, adaptationData, generatedPlans) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - 2 * margin;
  const pageHeight = doc.internal.pageSize.height;
  const defaultFont = { normal: 'helvetica', bold: 'helvetica' };

  // Helper function to check if we need a new page
  const checkForNewPage = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Helper function to force a new page
  const forceNewPage = () => {
    doc.addPage();
    yPos = 20;
  };

  // Helper function to add wrapped text and return new Y position
  const addWrappedText = (text, x, y, maxWidth, fontSize, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont(defaultFont.normal, fontStyle);

    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);

    return y + (lines.length * fontSize * 0.5) + (fontStyle === 'bold' ? 2 : 0);
  };

// Helper to render details in a 2x2 grid format
const renderDetailsGrid = (details, x, y, maxWidth, doc, defaultFont) => {
  if (!details || details.length === 0) return y;

  const colWidth = (maxWidth / 2) - 5; // Width per column with some spacing
  const leftColX = x;
  const rightColX = x + colWidth + 10;
  const valueFontSize = 10;
  const keyFontSize = 14;
  const valueLineHeight = valueFontSize * 0.5;
  const keyLineHeight = keyFontSize * 0.5;

  let row1Y = y;
  let row2Y = y; // Will be updated after row 1 is drawn
  let maxRow1Y = y;
  let maxRow2Y = y;

  details.slice(0, 4).forEach((detail, index) => {
    const parts = detail.split(': ');
    const key = parts[0];
    const value = parts.slice(1).join(': ');

    let currentX;
    let startY;
    let isRow1 = index < 2;

    if (index % 2 === 0) { // Left column (index 0 or 2)
      currentX = leftColX;
      startY = isRow1 ? row1Y : row2Y;
    } else { // Right column (index 1 or 3)
      currentX = rightColX;
      startY = isRow1 ? row1Y : row2Y;
    }

    let currentY = startY;

    // Draw Value (Normal)
    doc.setFont(defaultFont.normal, 'normal');
    doc.setFontSize(valueFontSize);
    const valueLines = doc.splitTextToSize(value, colWidth);
    doc.text(valueLines, currentX, currentY);
    currentY += valueLines.length * valueLineHeight + 1; // Add small gap

    // Draw Key (Bold)
    doc.setFont(defaultFont.normal, 'bold');
    doc.setFontSize(keyFontSize);
    const keyLines = doc.splitTextToSize(key, colWidth);
    doc.text(keyLines, currentX, currentY);
    currentY += keyLines.length * keyLineHeight + 3; // Add gap after key

    // Update max Y for the current row
    if (isRow1) {
      maxRow1Y = Math.max(maxRow1Y, currentY);
    } else {
      maxRow2Y = Math.max(maxRow2Y, currentY);
    }

    // After drawing the first row, set the starting Y for the second row
    if (index === 1) { 
      row2Y = maxRow1Y;
      maxRow2Y = row2Y; // Initialize maxRow2Y
    }
  });

  // Return the Y position after the grid (based on the bottom-most element)
  return maxRow2Y;
};

  // Fixed function to safely get reduction potential
const getReductionPotentialSafe = (action) => {
    // Check if GHGReductionPotential is a string and return it directly
    if (typeof action.GHGReductionPotential === 'string') {
      return action.GHGReductionPotential;
    }

    // If it's an object, format it properly
    if (action.GHGReductionPotential && typeof action.GHGReductionPotential === 'object') {
      try {
        // Filter out null or undefined values and format keys to sentence case
        const formattedEntries = Object.entries(action.GHGReductionPotential)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([key, value]) => `${toSentenceCase(key)}: ${value}`);

        // Join with commas if multiple entries
        if (formattedEntries.length > 0) {
          return formattedEntries.join(', ');
        }
      } catch (e) {
        // Fallback
        return String(action.GHGReductionPotential);
      }
    }

    // Fallback
    return 'N/A';
  };  

  // Title
  doc.setFontSize(20);
  doc.text(`Climate Actions Report - ${cityName}`, margin, yPos);
  yPos += 20;

  // Top Mitigation Actions
  doc.setFontSize(16);
  doc.text("Top Mitigation Actions", margin, yPos);
  yPos += 15;

  mitigationData.slice(0, 3).forEach((item, index) => {
    const type = 'mitigation';

    // Check if we need a new page for this item
    checkForNewPage(60); // Minimum space needed for an item

    // Title - This is the part that was causing overflow
    doc.setFont(defaultFont.normal, 'bold');
    doc.setFontSize(14);
    const actionTitle = `${index + 1}. ${item.action.ActionName}`;
    // Wrap the title text properly
    yPos = addWrappedText(actionTitle, margin, yPos, contentWidth, 14, 'bold');

    // Description with proper text wrapping
    doc.setFont(defaultFont.normal, 'normal');
    doc.setFontSize(11);
    const descriptionText = doc.splitTextToSize(item.action.Description, contentWidth - 5);

    // Check if description needs a new page
    if (checkForNewPage(descriptionText.length * 7)) {
      // We're on a new page, so re-add the title
      yPos = addWrappedText(actionTitle, margin, yPos, contentWidth, 14, 'bold');
    }

    doc.text(descriptionText, margin + 5, yPos);
    // Reduce the space after description - was 8, now 3
    yPos += (descriptionText.length * 7) + 3;

    // Check if we need a new page for the details
    checkForNewPage(40);

    // Prepare details for table-like presentation
    // Fix for reduction potential using our new safe function
    const potential = item.action.GHGReductionPotential ?
      getReductionPotentialSafe(item.action) :
      toTitleCase(item.action.AdaptationEffectiveness || 'N/A');

    const sectorOrHazard = item.action.Sector?.join ?
      item.action.Sector.map(s => toTitleCase(s.replace('_', ' '))).join(', ') :
      item.action.Hazard?.join ?
        item.action.Hazard.map(h => toTitleCase(h)).join(', ') :
        toTitleCase(String(item.action.Sector || item.action.Hazard || ''));

    const details = [
      `${isAdaptation(type) ? 'Adaptation' : 'Reduction'} Potential: ${potential}`,
      `${isAdaptation(type) ? 'Hazard' : 'Sector'}: ${sectorOrHazard}`,
      `Estimated cost: ${toTitleCase(item.action.CostInvestmentNeeded || 'N/A')}`,
      `Implementation time: ${item.action.TimelineForImplementation || 'N/A'}`
    ];

    // Render the details in a nice table format
    yPos = renderDetailsGrid(details, margin, yPos, contentWidth, doc, defaultFont);

    // Add space after each action
    yPos += 12;
  });

  // Force a new page for the full mitigation list
  forceNewPage();

  doc.setFontSize(16);
  doc.text("All Mitigation Actions", margin, yPos);
  yPos += 10;

  const mitigationHeaders = [['Priority', 'Action Name', 'Reduction Potential']];
  const mitigationRows = mitigationData.map((item, index) => {
    // Use the safe function for reduction potential here too
    const reductionPotential = item.action.GHGReductionPotential ?
      getReductionPotentialSafe(item.action) : 'N/A';

    return [
      index + 1,
      item.action.ActionName,
      reductionPotential
    ];
  });

  doc.autoTable({
    startY: yPos,
    head: mitigationHeaders,
    body: mitigationRows,
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 }
    },
    styles: { overflow: 'linebreak', cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    didDrawPage: function(data) {
      // Add header to each page of the table
      doc.setFontSize(10);
      doc.text(`Climate Actions - ${cityName} - Mitigation`, margin, 10);
    }
  });

  // Add new page for adaptation actions
  forceNewPage();

  // Top Adaptation Actions
  doc.setFontSize(16);
  doc.text("Top Adaptation Actions", margin, yPos);
  yPos += 15;

  adaptationData.slice(0, 3).forEach((item, index) => {
    const type = 'adaptation';

    // Check if we need a new page for this item
    checkForNewPage(60);

    // Title - Apply the same fix as for mitigation titles
    doc.setFont(defaultFont.normal, 'bold');
    doc.setFontSize(14);
    const actionTitle = `${index + 1}. ${item.action.ActionName}`;
    // Wrap the title text properly
    yPos = addWrappedText(actionTitle, margin, yPos, contentWidth, 14, 'bold');

    // Description with proper text wrapping
    doc.setFont(defaultFont.normal, 'normal');
    doc.setFontSize(11);
    const descriptionText = doc.splitTextToSize(item.action.Description, contentWidth - 5);

    // Check if description needs a new page
    if (checkForNewPage(descriptionText.length * 7)) {
      // We're on a new page, so re-add the title
      yPos = addWrappedText(actionTitle, margin, yPos, contentWidth, 14, 'bold');
    }

    doc.text(descriptionText, margin + 5, yPos);
    // Reduce the space after description - was 8, now 3
    yPos += (descriptionText.length * 7) + 3;

    // Check if we need a new page for the details
    checkForNewPage(40);

    // Use our safe function for adaptation effectiveness too
    const potential = item.action.AdaptationEffectiveness ?
      toTitleCase(item.action.AdaptationEffectiveness) : 'N/A';

    const sectorOrHazard = item.action.Sector?.join ?
      item.action.Sector.map(s => toTitleCase(s.replace('_', ' '))).join(', ') :
      item.action.Hazard?.join ?
        item.action.Hazard.map(h => toTitleCase(h)).join(', ') :
        toTitleCase(String(item.action.Sector || item.action.Hazard || ''));

    const details = [
      `${isAdaptation(type) ? 'Adaptation' : 'Reduction'} Potential: ${potential}`,
      `${isAdaptation(type) ? 'Hazard' : 'Sector'}: ${sectorOrHazard}`,
      `Estimated cost: ${toTitleCase(item.action.CostInvestmentNeeded || 'N/A')}`,
      `Implementation time: ${item.action.TimelineForImplementation || 'N/A'}`
    ];

    // Render the details in a nice table format
    yPos = renderDetailsGrid(details, margin, yPos, contentWidth, doc, defaultFont);

    // Add space after each action
    yPos += 12;
  });

  // Force a new page for the full adaptation list
  forceNewPage();

  doc.setFontSize(16);
  doc.text("All Adaptation Actions", margin, yPos);
  yPos += 10;

  const adaptationHeaders = [['Priority', 'Action Name', 'Adaptation Potential']];
  const adaptationRows = adaptationData.map((item, index) => [
    index + 1,
    item.action.ActionName,
    item.action.AdaptationEffectiveness || 'N/A'
  ]);

  doc.autoTable({
    startY: yPos,
    head: adaptationHeaders,
    body: adaptationRows,
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 }
    },
    styles: { overflow: 'linebreak', cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    didDrawPage: function(data) {
      // Add header to each page of the table
      doc.setFontSize(10);
      doc.text(`Climate Actions - ${cityName} - Adaptation`, margin, 10);
    }
  });

  // Add generated plans on a new page
  if (generatedPlans && Array.isArray(generatedPlans) && generatedPlans.length > 0) {
    forceNewPage();

    doc.setFontSize(16);
    doc.text("Generated Action Plans", margin, yPos);
    yPos += 20;

    const contentHeight = pageHeight - 40; // Available content height per page
    const styles = {
      h2: { style: 'bold', fontSize: 14, spacing: 10 },
      normal: { style: 'normal', fontSize: 12, spacing: 7 },
      small: { style: 'italic', fontSize: 10, spacing: 5 }
    };

    const calculateTextHeight = (text, fontSize, pageWidth) => {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      return lines.length * (fontSize * 0.3528); // Convert pt to mm
    };

    generatedPlans.forEach((planData, index) => {
      if (yPos > pageHeight - 40) {
        forceNewPage();
      }

      // Calculate required height for current plan
      const plainText = convertMarkdownToPlainText(planData.plan);
      const textHeight = calculateTextHeight(plainText, styles.normal.fontSize, pageWidth);
      const headerHeight = styles.h2.spacing + styles.small.spacing + 8;
      const totalRequiredHeight = textHeight + headerHeight;

      // Check if we need a new page
      if (yPos + totalRequiredHeight > contentHeight) {
        forceNewPage();
      }

      // Plan header with background
      doc.setFillColor(230, 240, 255);
      doc.rect(margin - 2, yPos - 6, pageWidth - 2 * margin + 4, 12, 'F');

      // Use the wrapped text helper for plan titles too
      const planTitle = `Plan ${index + 1}: ${planData.actionName}`;
      doc.setFont(undefined, styles.h2.style);
      doc.setFontSize(styles.h2.fontSize);
      yPos = addWrappedText(planTitle, margin, yPos, contentWidth, styles.h2.fontSize, 'bold');

      // Timestamp
      doc.setFont(undefined, 'italic');
      doc.setFontSize(styles.small.fontSize);
      doc.setTextColor(100, 100, 100);
      doc.text(new Date(planData.timestamp).toLocaleString(), margin, yPos);
      yPos += styles.small.spacing + 4;

      // Process the plan text with markdown support
      doc.setFont(undefined, 'normal');
      doc.setFontSize(styles.normal.fontSize);
      doc.setTextColor(0, 0, 0);
      const splitText = doc.splitTextToSize(plainText, pageWidth - 2 * margin);

      splitText.forEach(line => {
        if (yPos > contentHeight) {
          forceNewPage();
        }
        doc.text(line, margin, yPos);
        yPos += styles.normal.spacing;
      });

      // Add some spacing between plans
      yPos += 20;
      if (yPos > pageHeight - 60) {
        forceNewPage();
      }
    });
  }

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`${cityName}_climate_actions.pdf`);
};

export const exportUtils = {
  exportToCSV,
  exportToPDF
};

export default exportUtils;

// Placeholder for markdown conversion function.  Replace with your actual implementation.
const convertMarkdownToPlainText = (markdown) => markdown.replace(/`/g, '');