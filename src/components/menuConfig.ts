export interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    label: 'SEO Tools',
    children: [
      { label: 'Structured Data Tool', href: '/seo-tools/structured-data-tool' },
      { label: 'Meta Content Tool', href: '/seo-tools/meta-content-tool' },
      { label: 'Sitemap Tool', href: '/seo-tools/sitemap-tool' },
    ],
  },
  { label: 'Social Tools', href: '/social-tools' },
  { label: 'Graphic Tools', href: '/graphic-tools' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
