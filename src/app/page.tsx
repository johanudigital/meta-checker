import UrlAnalyzer from '@/components/UrlAnalyzer';

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">Analyze your website for SEO in just 1 click</h1>
          <p className="text-xl text-muted-foreground mb-10">
            Analyze, generate and automate, completely for free. 
          </p>
          <UrlAnalyzer />
        </div>
      </div>
    </div>
  );
}