import { Book, FileText, Calendar, Quote, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Library", href: "/library", icon: Book },
    { name: "Reading Plans", href: "/plans", icon: Calendar },
    { name: "My Quotes", href: "/quotes", icon: Quote },
    { name: "Journal", href: "/journal", icon: FileText },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="font-heading text-xl font-semibold text-primary">
              Puritan Treasury
            </span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-ui transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;