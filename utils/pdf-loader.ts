import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

/**
 * Loads and processes a PDF file, extracting its text content
 * @param filePath Path to the PDF file
 * @returns The extracted text content from the PDF
 */
export async function loadPdfContent(filePath: string): Promise<string> {
  try {
    console.log(`Loading PDF from: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found at path: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read the PDF file as a buffer
    const dataBuffer = fs.readFileSync(filePath);
    console.log(`PDF file size: ${dataBuffer.length} bytes`);
    
    // Use pdf-parse to extract text from the PDF
    const data = await pdfParse(dataBuffer);
    
    console.log(`Extracted ${data.text.length} characters from PDF`);
    return data.text;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Splits text into chunks of a specified maximum size
 * @param text Text to split into chunks
 * @param maxChunkSize Maximum size of each chunk
 * @returns Array of text chunks
 */
export function splitTextIntoChunks(text: string, maxChunkSize = 8000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split text into paragraphs
  const paragraphs = text.split("\n\n");

  for (const paragraph of paragraphs) {
    // If adding the current paragraph would exceed the max size, save the current chunk and start a new one
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      // Otherwise, add the paragraph to the current chunk
      if (currentChunk.length > 0) {
        currentChunk += "\n\n";
      }
      currentChunk += paragraph;
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Finds relevant information in the guide content based on a query
 * @param query Search query
 * @param guideContent Full guide content to search within
 * @returns Relevant sections of the guide content
 */
export function findRelevantInformation(query: string, guideContent: string): string {
  // Split guide content into chunks
  const chunks = splitTextIntoChunks(guideContent);

  // Convert query and chunks to lowercase for comparison
  const lowerQuery = query.toLowerCase();

  // Find keywords in the query
  const keywords = lowerQuery.split(/\s+/).filter((word) => word.length > 3);

  // Rank chunks by the number of keywords they contain
  const rankedChunks = chunks
    .map((chunk) => {
      const lowerChunk = chunk.toLowerCase();
      let score = 0;

      // Count the number of keywords in the chunk
      for (const keyword of keywords) {
        if (lowerChunk.includes(keyword)) {
          score += 1;
        }
      }

      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score);

  // Select the most relevant chunks (maximum 3 chunks)
  const relevantChunks = rankedChunks.slice(0, 3).map((item) => item.chunk);

  // Combine the relevant chunks
  return relevantChunks.join("\n\n");
}

// Cache for PDF content to avoid repeated processing
let pdfContentCache: { [key: string]: string } = {};

/**
 * Gets the content of a PDF file, using cache if available
 * @param pdfPath Path to the PDF file
 * @returns The text content of the PDF
 */
export async function getPdfContent(pdfPath: string): Promise<string> {
  // Use cached content if available
  if (pdfContentCache[pdfPath]) {
    console.log(`Using cached PDF content for: ${pdfPath}`);
    return pdfContentCache[pdfPath];
  }

  try {
    // Load and process the PDF
    const pdfContent = await loadPdfContent(pdfPath);
    
    // Cache the extracted content
    pdfContentCache[pdfPath] = pdfContent;
    
    return pdfContent;
  } catch (error) {
    console.error('Error getting PDF content:', error);
    throw new Error(`Failed to get PDF content: ${error instanceof Error ? error.message : String(error)}`);
  }
}
