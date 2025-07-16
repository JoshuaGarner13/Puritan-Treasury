import { Book, Calendar, Quote, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DailyReading from "@/components/DailyReading";
import heroImage from "@/assets/hero-library.jpg";

const Home = () => {
  const features = [
    {
      icon: Book,
      title: "Theological Library",
      description: "Access carefully curated public domain works from Reformed and Puritan divines including John Owen, Richard Sibbes, and Thomas Watson.",
      link: "/library",
      linkText: "Explore Library"
    },
    {
      icon: Calendar,
      title: "Reading Plans",
      description: "Follow structured reading plans designed to guide you through systematic study of classic theological works.",
      link: "/plans",
      linkText: "View Plans"
    },
    {
      icon: Quote,
      title: "Quote Collection",
      description: "Save meaningful excerpts and build your personal treasury of theological wisdom for reflection and study.",
      link: "/quotes",
      linkText: "My Quotes"
    },
    {
      icon: FileText,
      title: "Spiritual Journal",
      description: "Record your thoughts, prayers, and insights as you study the riches of Reformed theology.",
      link: "/journal",
      linkText: "Open Journal"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
        
        <div className="relative text-center space-y-6 py-24 px-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Puritan Treasury
            </h1>
            <p className="text-xl md:text-2xl theological-text text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed">
              A digital sanctuary for reading, reflecting upon, and journaling about the 
              profound theological writings of the Reformed and Puritan traditions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link to="/library">
                <Book className="h-5 w-5 mr-2" />
                Start Reading
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/plans">
                <Calendar className="h-5 w-5 mr-2" />
                Browse Reading Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Reading */}
      <div className="max-w-3xl mx-auto">
        <DailyReading />
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-semibold text-primary mb-4">
            Deepen Your Faith Through Classical Wisdom
          </h2>
          <p className="theological-text text-muted-foreground max-w-2xl mx-auto">
            Discover the spiritual treasures left by generations of faithful theologians 
            who sought to understand and communicate God's truth with precision and devotion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="parchment-bg hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-heading text-primary">
                  <feature.icon className="h-6 w-6" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="theological-text text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <Button asChild variant="outline" className="w-full font-ui">
                  <Link to={feature.link}>
                    {feature.linkText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="text-center py-12 space-y-6">
          <h3 className="text-2xl font-heading font-semibold">
            Begin Your Journey Through Reformed Theology
          </h3>
          <p className="theological-text text-primary-foreground/90 max-w-2xl mx-auto">
            Whether you're new to Reformed theology or seeking to deepen your understanding, 
            these timeless works offer wisdom that has shaped Christian thought for centuries.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/library">
              <Book className="h-5 w-5 mr-2" />
              Explore the Library
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;