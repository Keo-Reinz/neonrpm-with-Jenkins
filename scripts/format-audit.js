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
    report += `## Package: ${pkg}\n`;
    report += `- **Severity:** ${vuln.severity}\n`;
    report += `- **Issue:** ${vuln.title}\n`;
    report += `- **Path:** ${vuln.via.map(v => (v.source || v.name)).join(' → ')}\n`;
    report += `- **Fix Available:** ${vuln.isFixAvailable ? 'Yes' : 'No'}\n\n`;
  }
}

fs.writeFileSync('security-report.md', report);
console.log("Security report generated: security-report.md");
