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
      { label: 'Robots.txt Tool', href: '/seo-tools/robots-txt-tool' },
      { label: 'Sitemap Tool', href: '/seo-tools/sitemap-tool' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
