import { businessInfo } from '../data/businessInfo';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface JsonLdProps {
  type?: 'restaurant' | 'menu' | 'menuItem' | 'breadcrumb' | 'faq';
  data?: Record<string, unknown>;
}

export function JsonLd({ type = 'restaurant', data }: JsonLdProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'restaurant':
        return {
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          '@id': `${BASE_URL}/#restaurant`,
          name: 'MO:MO Station',
          alternateName: 'Momo Station',
          description: businessInfo.description,
          url: BASE_URL,
          telephone: businessInfo.contact.phone,
          email: businessInfo.contact.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: businessInfo.contact.address.street,
            addressLocality: businessInfo.contact.address.city,
            addressRegion: businessInfo.contact.address.state,
            postalCode: businessInfo.contact.address.zip,
            addressCountry: businessInfo.contact.address.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.7128,
            longitude: -74.0060,
          },
          image: [
            `${BASE_URL}/og-image.jpg`,
            `${BASE_URL}/brandlogo.svg`,
          ],
          logo: `${BASE_URL}/brandlogo.svg`,
          priceRange: '$$',
          servesCuisine: ['Nepali', 'Himalayan', 'Asian', 'Dumplings'],
          hasMenu: `${BASE_URL}/menu`,
          acceptsReservations: 'True',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
              opens: '11:00',
              closes: '22:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Friday', 'Saturday'],
              opens: '10:00',
              closes: '23:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Sunday',
              opens: '10:00',
              closes: '21:00',
            },
          ],
          sameAs: [
            businessInfo.social.instagram,
            businessInfo.social.facebook,
            businessInfo.social.tiktok,
            businessInfo.social.twitter,
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '2000',
            bestRating: '5',
            worstRating: '1',
          },
          potentialAction: {
            '@type': 'OrderAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${BASE_URL}/menu`,
              inLanguage: 'en',
              actionPlatform: [
                'http://schema.org/DesktopWebPlatform',
                'http://schema.org/MobileWebPlatform',
              ],
            },
            deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
          },
        };

      case 'menu':
        return {
          '@context': 'https://schema.org',
          '@type': 'Menu',
          '@id': `${BASE_URL}/menu#menu`,
          name: 'MO:MO Station Menu',
          description: 'Explore our authentic Nepali momos and dishes',
          url: `${BASE_URL}/menu`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: data?.items || [],
          },
        };

      case 'menuItem':
        return {
          '@context': 'https://schema.org',
          '@type': 'MenuItem',
          '@id': `${BASE_URL}/menu/${data?.slug}#menuitem`,
          name: data?.name,
          description: data?.description,
          image: data?.image,
          offers: {
            '@type': 'Offer',
            price: data?.price,
            priceCurrency: 'USD',
            availability: data?.isAvailable 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/OutOfStock',
          },
          nutrition: data?.calories ? {
            '@type': 'NutritionInformation',
            calories: `${data.calories} calories`,
          } : undefined,
          suitableForDiet: data?.isVegetarian 
            ? 'https://schema.org/VegetarianDiet' 
            : undefined,
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: (data?.items as { name: string; url: string }[] || []).map(
            (item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })
          ),
        };

      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (data?.questions as { question: string; answer: string }[] || []).map(
            (faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })
          ),
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Organization schema for the website
export function OrganizationJsonLd() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'MO:MO Station',
    url: BASE_URL,
    logo: `${BASE_URL}/brandlogo.svg`,
    description: businessInfo.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessInfo.contact.phone,
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      businessInfo.social.instagram,
      businessInfo.social.facebook,
      businessInfo.social.tiktok,
      businessInfo.social.twitter,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

// Website schema
export function WebsiteJsonLd() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'MO:MO Station',
    url: BASE_URL,
    description: businessInfo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/menu?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}

// Local Business schema (more specific than Restaurant for local SEO)
export function LocalBusinessJsonLd() {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'MO:MO Station',
    image: `${BASE_URL}/og-image.jpg`,
    telephone: businessInfo.contact.phone,
    email: businessInfo.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.contact.address.street,
      addressLocality: businessInfo.contact.address.city,
      addressRegion: businessInfo.contact.address.state,
      postalCode: businessInfo.contact.address.zip,
      addressCountry: businessInfo.contact.address.country,
    },
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2000',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
