import fs from 'fs';
import path from 'path';

const errorLogPath = path.join(__dirname, 'logs', 'errorlogs.txt');
const markdownLogPath = path.join(__dirname, 'logs', 'errorLogs.md');

/**
 * Render the error logs to a Markdown file
 * @returns {void}
 */
export function renderErrorsToMarkdown() {
  // Read the raw error logs from the file
  fs.readFile(errorLogPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the log file:', err);
      return;
    }

    // Split the error logs by the delimiter (------ error ------)
    const errors = data.split('------ error ------').filter(error => error.trim());

    // Start the markdown content
    let markdownContent = '# Error Logs\n\n';

    // Loop through the errors and format them into markdown
    errors.forEach((error, index) => {
      // Extract the timestamp and error message
      const timestampMatch = error.match(/\[([^\]]+)\]/);
      const errorMessageMatch = error.split('-------------------')[0].trim();
      console.log(errorMessageMatch);
      if (timestampMatch && errorMessageMatch) {
        const timestamp = timestampMatch[1];
        
        // Add the formatted error log to the markdown content
        markdownContent += `## Error ${index + 1} - ${timestamp}\n`;
        markdownContent += `**Error Message:**\n\`\`\`\n${errorMessageMatch}\n\`\`\`\n\n`;
      }
    });

    // Write the markdown content to a new file
    fs.writeFile(markdownLogPath, markdownContent, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the markdown file:', writeErr);
        return;
      }

      console.log('Error logs rendered to markdown successfully!');
    });
  });
}

// Call the function to render the error logs
renderErrorsToMarkdown();
