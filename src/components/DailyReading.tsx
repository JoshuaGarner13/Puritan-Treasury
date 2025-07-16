import { useState, useEffect } from "react";
import { Calendar, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import booksData from "@/data/books.json";

interface DailyQuote {
  text: string;
  author: string;
  bookTitle: string;
  bookId: string;
}

const DailyReading = () => {
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);

  useEffect(() => {
    generateDailyQuote();
  }, []);

  const generateDailyQuote = () => {
    // Simple daily quote generation based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Collect all text segments
    const allQuotes: DailyQuote[] = [];
    booksData.forEach(book => {
      book.chapters.forEach(chapter => {
        // Extract meaningful sentences from the content
        const sentences = chapter.content.split('.').filter(s => s.trim().length > 50);
        sentences.forEach(sentence => {
          if (sentence.trim().length > 100 && sentence.trim().length < 300) {
            allQuotes.push({
              text: sentence.trim() + '.',
              author: book.author,
              bookTitle: book.title,
              bookId: book.id
            });
          }
        });
      });
    });

    // Select quote based on day of year
    if (allQuotes.length > 0) {
      const selectedQuote = allQuotes[dayOfYear % allQuotes.length];
      setDailyQuote(selectedQuote);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="parchment-bg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-ui text-sm text-muted-foreground">
            {formatDate(new Date())}
          </span>
        </div>
        <CardTitle className="text-2xl font-heading text-primary">
          Daily Reading
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {dailyQuote && (
          <div className="space-y-4">
            <blockquote className="quote-highlight theological-text text-lg">
              "{dailyQuote.text}"
            </blockquote>
            
            <div className="text-right space-y-1">
              <div className="font-heading font-semibold text-primary">
                {dailyQuote.author}
              </div>
              <div className="font-ui text-sm text-muted-foreground">
                {dailyQuote.bookTitle}
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button asChild className="btn-scholar">
                <Link to={`/read/${dailyQuote.bookId}`}>
                  <Book className="h-4 w-4 mr-2" />
                  Read Full Book
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={generateDailyQuote}
            className="font-ui"
          >
            Get New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyReading;