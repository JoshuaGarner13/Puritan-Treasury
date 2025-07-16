import { useState } from "react";
import { Search, Filter, Book, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookCard from "@/components/BookCard";
import booksData from "@/data/books.json";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "author" | "year">("author");

  // Get all unique topics
  const allTopics = Array.from(
    new Set(booksData.flatMap(book => book.topics))
  ).sort();

  // Filter and sort books
  const filteredBooks = booksData
    .filter(book => {
      const matchesSearch = searchTerm === "" || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTopic = selectedTopic === null || book.topics.includes(selectedTopic);
      
      return matchesSearch && matchesTopic;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "year":
          return a.year - b.year;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Theological Library
        </h1>
        <p className="text-lg theological-text text-muted-foreground max-w-3xl mx-auto">
          A carefully curated collection of public domain Reformed and Puritan writings, 
          digitized for modern study and reflection.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-ui"
          />
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-ui text-sm font-medium">Sort by:</span>
            <div className="flex space-x-1">
              {[
                { key: "author", label: "Author" },
                { key: "title", label: "Title" },
                { key: "year", label: "Year" }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.key as any)}
                  className="font-ui"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground font-ui">
            <Book className="h-4 w-4 mr-1" />
            <span>{filteredBooks.length} books</span>
          </div>
        </div>

        {/* Topic Filter */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-ui text-sm font-medium">Filter by topic:</span>
            {selectedTopic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="font-ui"
              >
                Clear Filter
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTopics.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors font-ui"
                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground font-ui">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Information Footer */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground font-ui max-w-2xl mx-auto">
          All works in this library are in the public domain and sourced from established 
          theological archives. These texts have been formatted for digital reading while 
          preserving their original theological content and intent.
        </p>
      </div>
    </div>
  );
};

export default Library;