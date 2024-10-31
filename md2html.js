#!/usr/bin/env node

const fs = require('fs');
const marked = require('marked');
const path = require('path');

// Check if input file is provided
if (process.argv.length < 3) {
    console.error('Usage: node md2html.js <input-file.md> [output-file.html]');
    process.exit(1);
}

// Get input and output file paths
const inputPath = process.argv[2];
const outputPath = process.argv[3];

// Process a single file
function convertFile(inputFile, outputFile) {
    try {
        // Ensure output directory exists
        const outputDir = path.dirname(outputFile);
        console.log(outputDir);
        console.log(fs.existsSync(outputDir));
        if (!fs.existsSync(outputDir)) {
            console.log('Creating output directory:', outputDir);
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const markdown = fs.readFileSync(inputFile, 'utf-8');
        const html = marked.parse(markdown);
        fs.writeFileSync(outputFile, html);
        console.log(`Successfully converted ${inputFile} to ${outputFile}`);
    } catch (error) {
        console.error(`Error processing ${inputFile}:`, error.message);
    }
}

// Process input path
try {
    const stats = fs.statSync(inputPath);
    
    if (stats.isDirectory()) {
        // Process all .md files in directory
        console
        const files = fs.readdirSync(inputPath);
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const inputFile = path.join(inputPath, file);
                const outputDir = outputPath || inputPath;
                const outputFile = path.join(outputDir, file.replace('.md', '.html'));
                convertFile(inputFile, outputFile);
            }
        });
    } else {
        // Process single file
        const outputFile = outputPath || inputPath.replace('.md', '.html');
        convertFile(inputPath, outputFile);
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
