// Utility functions to parse and format public domain theological texts

export interface ChapterContent {
  id: number;
  title: string;
  content: string;
}

export interface BookData {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  topics: string[];
  chapters: ChapterContent[];
  sourceUrl?: string;
  publicDomain: boolean;
}

// Parse Sibbes' "The Bruised Reed" from Monergism source
export const parseBruisedReed = (markdownContent: string): ChapterContent[] => {
  const chapters: ChapterContent[] = [];
  
  // Split content by chapter markers
  const sections = markdownContent.split(/(?=^##?\s+\d+\.\s+)/gm);
  
  sections.forEach((section, index) => {
    if (section.trim().length > 100) { // Skip small sections
      const lines = section.split('\n');
      let title = '';
      let content = '';
      
      // Extract title from header
      const titleMatch = lines[0].match(/^##?\s*(\d+\.\s*[^#]+)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        title = `Chapter ${index + 1}`;
      }
      
      // Clean up content
      content = lines.slice(1)
        .join('\n')
        .replace(/\[Back To Top\][^\n]*/g, '')
        .replace(/\[.*?\]\([^)]*\)/g, '') // Remove markdown links
        .replace(/^_.*?_$/gm, '') // Remove emphasis markers
        .replace(/\n{3,}/g, '\n\n') // Normalize spacing
        .trim();
      
      if (content.length > 200) {
        chapters.push({
          id: index + 1,
          title,
          content
        });
      }
    }
  });
  
  return chapters;
};

// Parse Owen's "Mortification of Sin" from Modern Puritans source
export const parseMortificationOfSin = (markdownContent: string): ChapterContent[] => {
  const chapters: ChapterContent[] = [];
  
  // Split content by chapter markers
  const sections = markdownContent.split(/(?=^##\s+Chapter\s+\d+)/gm);
  
  sections.forEach((section, index) => {
    if (section.trim().length > 100) {
      const lines = section.split('\n');
      let title = '';
      let content = '';
      
      // Extract title from header
      const titleMatch = lines[0].match(/^##\s+Chapter\s+\d+:\s*(.+)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        title = `Chapter ${index + 1}`;
      }
      
      // Clean up content, removing references and formatting
      content = lines.slice(1)
        .join('\n')
        .replace(/\[[^\]]*\]\([^)]*\)/g, '') // Remove markdown links
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/_([^_]+)_/g, '$1') // Remove italic markers
        .replace(/^[a-z]\.\s*/gm, '') // Remove lettered list markers
        .replace(/^\d+\.\s*/gm, '') // Remove numbered list markers
        .replace(/\n{3,}/g, '\n\n') // Normalize spacing
        .trim();
      
      if (content.length > 300) {
        chapters.push({
          id: index + 1,
          title,
          content
        });
      }
    }
  });
  
  return chapters;
};

// Parse Watson's "Body of Divinity" from CCEL source
export const parseBodyOfDivinity = (markdownContent: string): ChapterContent[] => {
  const chapters: ChapterContent[] = [];
  
  // Split content by section markers
  const sections = markdownContent.split(/(?=^##\s+\d+\.)/gm);
  
  sections.forEach((section, index) => {
    if (section.trim().length > 100) {
      const lines = section.split('\n');
      let title = '';
      let content = '';
      
      // Extract title from header
      const titleMatch = lines[0].match(/^##\s+(\d+\.\s*[^#]+)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        title = `Section ${index + 1}`;
      }
      
      // Clean up content
      content = lines.slice(1)
        .join('\n')
        .replace(/\[[^\]]*\]\([^)]*\)/g, '') // Remove markdown links
        .replace(/\n{3,}/g, '\n\n') // Normalize spacing
        .trim();
      
      if (content.length > 300) {
        chapters.push({
          id: index + 1,
          title,
          content
        });
      }
    }
  });
  
  return chapters;
};

// Extract meaningful quotes from theological text
export const extractQuotes = (text: string, minLength = 100, maxLength = 400): string[] => {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const quotes: string[] = [];
  
  sentences.forEach(sentence => {
    if (sentence.length >= minLength && sentence.length <= maxLength) {
      // Clean up the sentence
      const cleanSentence = sentence
        .replace(/^\s*[a-z]\.\s*/i, '') // Remove list markers
        .replace(/^\s*\d+\.\s*/, '') // Remove numbered markers
        .trim();
      
      if (cleanSentence.length >= minLength) {
        quotes.push(cleanSentence + '.');
      }
    }
  });
  
  return quotes;
};