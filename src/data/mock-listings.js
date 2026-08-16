const HOUR = 60 * 60 * 1000;

const mockListingDetails = [
  {
    title: "Vintage Rolex Submariner",
    description: "A rare collector's watch.",
    tag: "Watches",
    bidCount: 4,
    createdHoursAgo: 2,
    endsInHours: 4,
  },
  {
    title: "Jean-Michel Basquiat Study",
    description: "An expressive fine art study.",
    tag: "Fine Art",
    bidCount: 2,
    createdHoursAgo: 12,
    endsInHours: 12,
  },
  {
    title: "Air Jordan Chicago",
    description: "Collectible streetwear sneakers.",
    tag: "Sneakers",
    bidCount: 5,
    createdHoursAgo: 24,
    endsInHours: 48,
  },
  {
    title: "Leica M3 Vintage Camera",
    description: "A vintage photography classic.",
    tag: "Vintage",
    bidCount: 1,
    createdHoursAgo: 36,
    endsInHours: 72,
  },
  {
    title: "Canon Camera Collection",
    description: "Professional photography equipment.",
    tag: "Photography",
    bidCount: 3,
    createdHoursAgo: 48,
    endsInHours: 96,
  },
  {
    title: "Gold Dress Watch",
    description: "A refined watch for formal occasions.",
    tag: "Watches",
    bidCount: 0,
    createdHoursAgo: 72,
    endsInHours: 120,
  },
  {
    title: "Limited Fine Art Print",
    description: "A signed contemporary art print.",
    tag: "Fine Art",
    bidCount: 6,
    createdHoursAgo: 96,
    endsInHours: 144,
  },
  {
    title: "Vintage Jewellery Collection",
    description: "A curated collection of vintage jewellery.",
    tag: "Vintage",
    bidCount: 2,
    createdHoursAgo: 120,
    endsInHours: 168,
  },
];

/**
 * Temporary API-shaped listings used to test landing-page behaviour.
 *
 * @type {Object[]}
 */
export const mockListings = mockListingDetails.map((listing, listingIndex) => {
  const bids = Array.from({ length: listing.bidCount }, (_, bidIndex) => ({
    id: `mock-bid-${listingIndex + 1}-${bidIndex + 1}`,
    amount: (listingIndex + 1) * 3500 + bidIndex * 250,
  }));

  return {
    id: `mock-listing-${listingIndex + 1}`,
    title: listing.title,
    description: listing.description,
    tags: [listing.tag],
    media: [
      {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
        alt: listing.title,
      },
    ],
    created: new Date(
      Date.now() - listing.createdHoursAgo * HOUR
    ).toISOString(),
    endsAt: new Date(Date.now() + listing.endsInHours * HOUR).toISOString(),
    bids,
    _count: {
      bids: listing.bidCount,
    },
  };
});
