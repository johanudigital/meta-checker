import Link from 'next/link'

export default function SEOTools() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">SEO Tools</h1>
      <ul className="list-disc pl-5">
        <li><Link href="/seo-tools/structured-data" className="text-blue-600 hover:underline">Structured Data Tool</Link></li>
        <li><Link href="/seo-tools/sitemap" className="text-blue-600 hover:underline">Sitemap Tool</Link></li>
        <li><Link href="/seo-tools/robots-txt" className="text-blue-600 hover:underline">Meta Content Tool</Link></li>
        <li><Link href="/seo-tools/seo-checker" className="text-blue-600 hover:underline">SEO Analyzer Tool</Link></li>
      </ul>
    </div>
  )
}
