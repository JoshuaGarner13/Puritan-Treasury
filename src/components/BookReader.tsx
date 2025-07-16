import { useState, useRef } from "react";
import { ArrowLeft, Quote, BookOpen, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import booksData from "@/data/books.json";

interface Quote {
  id: string;
  text: string;
  author: string;
  bookTitle: string;
  bookId: string;
  chapterId: number;
  timestamp: number;
  tags?: string[];
}

const BookReader = () => {
  const { bookId } = useParams();
  const [selectedText, setSelectedText] = useState("");
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const book = booksData.find(b => b.id === bookId);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-heading mb-4">Book Not Found</h2>
            <Button asChild>
              <Link to="/library">Return to Library</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      setShowQuoteDialog(true);
    }
  };

  const saveQuote = (tags: string[] = []) => {
    if (!selectedText) return;

    const quote: Quote = {
      id: Date.now().toString(),
      text: selectedText,
      author: book.author,
      bookTitle: book.title,
      bookId: book.id,
      chapterId: 1, // Could be enhanced to track specific chapter
      timestamp: Date.now(),
      tags
    };

    // Save to localStorage
    const existingQuotes = JSON.parse(localStorage.getItem('puritanTreasuryQuotes') || '[]');
    const updatedQuotes = [...existingQuotes, quote];
    localStorage.setItem('puritanTreasuryQuotes', JSON.stringify(updatedQuotes));

    toast({
      title: "Quote Saved",
      description: "Added to your personal collection",
    });

    setSelectedText("");
    setShowQuoteDialog(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/library">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Link>
        </Button>
        
        <Card className="parchment-bg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading text-primary mb-2">
              {book.title}
            </CardTitle>
            <div className="space-y-2">
              <div className="text-xl font-heading text-primary">
                {book.author}
              </div>
              <div className="font-ui text-muted-foreground">
                Published {book.year}
              </div>
              <p className="theological-text text-muted-foreground max-w-2xl mx-auto">
                {book.description}
              </p>
              <div className="flex justify-center flex-wrap gap-2 pt-2">
                {book.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="font-ui">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Quote Dialog */}
      {showQuoteDialog && (
        <Card className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md bg-card border-2 border-primary shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center">
              <Quote className="h-5 w-5 mr-2 text-primary" />
              Save Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="quote-highlight text-sm theological-text max-h-32 overflow-y-auto">
              "{selectedText}"
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => saveQuote()} className="btn-scholar flex-1">
                <Bookmark className="h-4 w-4 mr-2" />
                Save Quote
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQuoteDialog(false)}
                className="font-ui"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <div className="space-y-8">
        {book.chapters.map((chapter) => (
          <Card key={chapter.id} className="parchment-bg">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-primary flex items-center">
                <BookOpen className="h-6 w-6 mr-3" />
                Chapter {chapter.id}: {chapter.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={contentRef}
                className="theological-text text-lg leading-relaxed whitespace-pre-line select-text"
                onMouseUp={handleTextSelection}
                style={{ userSelect: 'text' }}
              >
                {chapter.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reading Instructions */}
      <Card className="mt-8 bg-accent/20 border-accent">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm font-ui text-accent-foreground">
            <Quote className="h-4 w-4" />
            <span>Select any text to save quotes to your personal collection</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookReader;