const fs = require('fs');

// Read the audit JSON
const data = JSON.parse(fs.readFileSync('audit-report.json', 'utf8'));
const vulns = data.vulnerabilities || {};

let report = `# Security Audit Report\n\n`;
report += `Generated on: ${new Date().toLocaleString()}\n\n`;

if (Object.keys(vulns).length === 0) {
  report += `No vulnerabilities found.\n`;
} else {
  for (const [pkg, vuln] of Object.entries(vulns)) {
    const details = Array.isArray(vuln.via) && typeof vuln.via[0] === 'object' ? vuln.via[0] : null;

    // Handle CWE as string or array
    let cwe = 'N/A';
    if (details && details.cwe) {
      if (Array.isArray(details.cwe)) {
        cwe = details.cwe.join(', ');
      } else {
        cwe = details.cwe;
      }
    }

    report += `## Package: ${pkg}\n`;
    report += `- **Severity:** ${vuln.severity}\n`;
    report += `- **Issue:** ${details ? details.title : 'N/A'}\n`;
    report += `- **CWE:** ${cwe}\n`;
    report += `- **Advisory URL:** ${details && details.url ? details.url : 'N/A'}\n`;
    report += `- **Fix Available:** ${vuln.fixAvailable ? 'Yes' : 'No'}\n\n`;
  }
}

fs.writeFileSync('security-report.md', report);
console.log("Security report generated: security-report.md");
