import { useState, useEffect } from "react";
import { Quote as QuoteIcon, Search, Tag, Trash2, Book, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const savedQuotes = localStorage.getItem('puritanTreasuryQuotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    }
  }, []);

  const deleteQuote = (quoteId: string) => {
    const updatedQuotes = quotes.filter(q => q.id !== quoteId);
    setQuotes(updatedQuotes);
    localStorage.setItem('puritanTreasuryQuotes', JSON.stringify(updatedQuotes));
  };

  const exportQuotes = () => {
    const exportData = quotes.map(quote => ({
      text: quote.text,
      author: quote.author,
      book: quote.bookTitle,
      date: new Date(quote.timestamp).toLocaleDateString(),
      tags: quote.tags || []
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'puritan-treasury-quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(quotes.flatMap(quote => quote.tags || []))
  ).sort();

  // Filter quotes
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchTerm === "" || 
      quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || (quote.tags && quote.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  }).sort((a, b) => b.timestamp - a.timestamp); // Most recent first

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-primary">
          My Quotes
        </h1>
        <p className="text-lg theological-text text-muted-foreground max-w-2xl mx-auto">
          Your personal collection of theological wisdom, carefully gathered from the great works 
          of Reformed and Puritan divines.
        </p>
      </div>

      {quotes.length === 0 ? (
        <Card className="parchment-bg">
          <CardContent className="text-center py-12 space-y-6">
            <QuoteIcon className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-heading font-semibold">No quotes saved yet</h3>
              <p className="theological-text text-muted-foreground max-w-md mx-auto">
                Start reading theological works and select meaningful passages to build your 
                personal collection of spiritual wisdom.
              </p>
            </div>
            <Button asChild className="btn-scholar">
              <Link to="/library">
                <Book className="h-4 w-4 mr-2" />
                Explore Library
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes, authors, or books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-ui"
                />
              </div>
              <Button onClick={exportQuotes} variant="outline" className="font-ui">
                Export Quotes
              </Button>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-ui text-sm font-medium">Filter by tag:</span>
                  {selectedTag && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTag(null)}
                      className="font-ui"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors font-ui"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground font-ui">
              <span>{filteredQuotes.length} quotes</span>
              <span>Sorted by most recent</span>
            </div>
          </div>

          {/* Quotes List */}
          <div className="space-y-6">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="parchment-bg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Quote Text */}
                    <blockquote className="quote-highlight theological-text text-lg">
                      "{quote.text}"
                    </blockquote>

                    {/* Attribution */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-heading font-semibold text-primary">
                          {quote.author}
                        </div>
                        <Link 
                          to={`/read/${quote.bookId}`}
                          className="theological-text text-sm text-muted-foreground hover:text-primary transition-colors underline"
                        >
                          {quote.bookTitle}
                        </Link>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground font-ui">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(quote.timestamp).toLocaleDateString()}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuote(quote.id)}
                          className="font-ui"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {quote.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-ui text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Information */}
      <Card className="bg-accent/20 border-accent">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-heading font-semibold text-accent-foreground">
              Building Your Theological Library
            </h4>
            <p className="theological-text text-sm text-accent-foreground/80">
              Select meaningful passages while reading to create your personal collection of theological insights. 
              These quotes can be exported for use in study, teaching, or personal reflection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quotes;