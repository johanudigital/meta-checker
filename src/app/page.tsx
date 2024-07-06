'use client';
import UrlAnalyzer from '@/components/UrlAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Analyze URLs with Confidence</h1>
            <p className="text-xl text-gray-600 mb-10">
              Get instant insights on safety, content type, and sentiment for any URL.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <UrlAnalyzer />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Safety Check</h3>
              <p className="text-gray-600">Ensure the URLs you visit are free from potential threats.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Content Analysis</h3>
              <p className="text-gray-600">Understand the type of content you're about to access.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Sentiment Evaluation</h3>
              <p className="text-gray-600">Get a quick overview of the overall tone of the linked content.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
