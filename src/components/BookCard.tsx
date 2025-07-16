import { Book, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface BookData {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  topics: string[];
  chapters: Array<{
    id: number;
    title: string;
    content: string;
  }>;
}

interface BookCardProps {
  book: BookData;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Card className="parchment-bg hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <Book className="h-5 w-5 text-primary" />
            <span className="font-ui text-sm text-muted-foreground">{book.year}</span>
          </div>
        </div>
        
        <CardTitle className="font-heading text-xl leading-tight">
          {book.title}
        </CardTitle>
        
        <div className="font-heading text-primary font-semibold">
          {book.author}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="theological-text text-muted-foreground leading-relaxed">
          {book.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="font-ui text-sm font-medium">Topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {book.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="font-ui text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground font-ui">
          <Calendar className="h-4 w-4" />
          <span>{book.chapters.length} chapters</span>
        </div>
        
        <div className="pt-2">
          <Button asChild className="w-full btn-scholar">
            <Link to={`/read/${book.id}`}>
              Start Reading
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;