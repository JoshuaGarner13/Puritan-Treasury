import { useState, useEffect } from "react";
import { Plus, Calendar, Book, Search, Download, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import booksData from "@/data/books.json";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  linkedBookId?: string;
  tags?: string[];
  timestamp: number;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkedBookId, setLinkedBookId] = useState<string>("");

  useEffect(() => {
    const savedEntries = localStorage.getItem('puritanTreasuryJournal');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive"
      });
      return;
    }

    const entry: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      linkedBookId: linkedBookId || undefined,
      timestamp: editingEntry?.timestamp || Date.now()
    };

    let updatedEntries;
    if (editingEntry) {
      updatedEntries = entries.map(e => e.id === editingEntry.id ? entry : e);
    } else {
      updatedEntries = [entry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem('puritanTreasuryJournal', JSON.stringify(updatedEntries));

    // Reset form
    setTitle("");
    setContent("");
    setLinkedBookId("");
    setEditingEntry(null);
    setShowNewEntryDialog(false);

    toast({
      title: editingEntry ? "Entry Updated" : "Entry Saved",
      description: "Your journal entry has been saved successfully."
    });
  };

  const editEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setLinkedBookId(entry.linkedBookId || "");
    setShowNewEntryDialog(true);
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(e => e.id !== entryId);
    setEntries(updatedEntries);
    localStorage.setItem('puritanTreasuryJournal', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been removed."
    });
  };

  const exportJournal = () => {
    const exportData = entries.map(entry => ({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      linkedBook: entry.linkedBookId ? getBookTitle(entry.linkedBookId) : null
    }));

    const textContent = exportData.map(entry => 
      `${entry.title}\n${entry.date}\n${entry.linkedBook ? `Related to: ${entry.linkedBook}\n` : ''}\n${entry.content}\n\n---\n\n`
    ).join('');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'puritan-treasury-journal.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBookTitle = (bookId: string) => {
    const book = booksData.find(b => b.id === bookId);
    return book?.title || "Unknown Book";
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setLinkedBookId("");
    setEditingEntry(null);
  };

  // Filter entries
  const filteredEntries = entries.filter(entry =>
    searchTerm === "" ||
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.linkedBookId && getBookTitle(entry.linkedBookId).toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Spiritual Journal
        </h1>
        <p className="text-lg theological-text text-muted-foreground max-w-2xl mx-auto">
          Record your thoughts, prayers, and insights as you journey through the depths 
          of Reformed theology and personal spiritual growth.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journal entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-ui"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={exportJournal} variant="outline" className="font-ui">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
            <DialogTrigger asChild>
              <Button className="btn-scholar" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entry-title" className="font-ui">Title</Label>
                  <Input
                    id="entry-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your reflection..."
                    className="font-ui mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="linked-book" className="font-ui">Related Book (Optional)</Label>
                  <Select value={linkedBookId} onValueChange={setLinkedBookId}>
                    <SelectTrigger className="font-ui mt-1">
                      <SelectValue placeholder="Select a book this entry relates to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No book selected</SelectItem>
                      {booksData.map((book) => (
                        <SelectItem key={book.id} value={book.id} className="font-ui">
                          {book.title} - {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="entry-content" className="font-ui">Content</Label>
                  <Textarea
                    id="entry-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts, prayers, insights, or reflections..."
                    className="theological-text mt-1 min-h-64 resize-none"
                    rows={12}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewEntryDialog(false)}
                    className="font-ui"
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveEntry} className="btn-scholar">
                    {editingEntry ? "Update Entry" : "Save Entry"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <Card className="parchment-bg">
          <CardContent className="text-center py-12 space-y-6">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-heading font-semibold">Your journal awaits</h3>
              <p className="theological-text text-muted-foreground max-w-md mx-auto">
                Begin recording your spiritual journey, theological insights, and personal reflections 
                as you study the great works of faith.
              </p>
            </div>
            <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
              <DialogTrigger asChild>
                <Button className="btn-scholar" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Entry
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground font-ui">
            {filteredEntries.length} entries
          </div>
          
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="parchment-bg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="font-heading text-xl text-primary">
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground font-ui">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      {entry.linkedBookId && (
                        <div className="flex items-center space-x-1">
                          <Book className="h-4 w-4" />
                          <span>{getBookTitle(entry.linkedBookId)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editEntry(entry)}
                      className="font-ui"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="font-ui"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="theological-text leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Information */}
      <Card className="bg-accent/20 border-accent">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-heading font-semibold text-accent-foreground">
              Cultivating Spiritual Reflection
            </h4>
            <p className="theological-text text-sm text-accent-foreground/80">
              Use your journal to process theological insights, record prayers, and track your spiritual growth. 
              Link entries to specific books to create connections between your reading and reflection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;