/**
 * MARK ZAP AI ENGINE — Agent-Reach Mid-Range Lead Finder
 * Clean Intent Processing & Non-Duplicate Lead Card Output
 */

const MID_RANGE_NO_WEBSITE_DATABASE = [
  {
    name: "Precision Auto Care & Collision Center",
    type: "Established Local Auto Workshop (2 Locations)",
    revenueEstimate: "$850K - $1.5M / year",
    location: "Miami, FL 33137",
    gmapsUrl: "https://maps.google.com/?q=Precision+Auto+Care+Miami+FL",
    phone: "+1 (305) 555-0182",
    email: "contact@precisionautomiami.com",
    social: "Facebook: @PrecisionAutoMiami | IG: @precision_auto_305",
    websiteStatus: "❌ No Website (Prime Web Prospect)",
    rating: "4.8 ★ (94 Google Reviews)",
    whyBuildFromUs: "Established 8+ years with 94 positive reviews, but losing ~30 diagnostic appointments weekly due to no online booking website."
  },
  {
    name: "Biscayne Bay Dental Group",
    type: "Mid-size Local Dental & Hygiene Clinic",
    revenueEstimate: "$1.2M - $2.4M / year",
    location: "Miami, FL 33131",
    gmapsUrl: "https://maps.google.com/?q=Biscayne+Bay+Dental+Group+Miami+FL",
    phone: "+1 (305) 555-0149",
    email: "info@biscaynedentalgroup.com",
    social: "Facebook: @BiscayneDental | LinkedIn: /company/biscayne-dental",
    websiteStatus: "❌ No Website (Prime Web Prospect)",
    rating: "4.9 ★ (128 Google Reviews)",
    whyBuildFromUs: "High-margin private clinic relying entirely on phone calls. A modern site with patient booking & service showcase will increase patient intake by 40%."
  },
  {
    name: "Sunstate Plumbing & Climate Control",
    type: "Mid-Range Residential & Commercial Contractor",
    revenueEstimate: "$900K - $1.8M / year",
    location: "Austin, TX 78704",
    gmapsUrl: "https://maps.google.com/?q=Sunstate+Plumbing+Austin+TX",
    phone: "+1 (512) 555-0193",
    email: "dispatch@sunstateplumbingtx.com",
    social: "Facebook: @SunstatePlumbingATX | IG: @sunstate_plumbing",
    websiteStatus: "❌ No Website (Prime Web Prospect)",
    rating: "4.7 ★ (68 Google Reviews)",
    whyBuildFromUs: "Strong local reputation with 12 service trucks, but zero web presence. Needs custom landing page to capture commercial maintenance retainers."
  },
  {
    name: "Veritas Accounting & Tax Advisory",
    type: "Regional Mid-Tier CPA & Tax Firm",
    revenueEstimate: "$750K - $1.4M / year",
    location: "Dallas, TX 75201",
    gmapsUrl: "https://maps.google.com/?q=Veritas+Accounting+Dallas+TX",
    phone: "+1 (214) 555-0164",
    email: "advisory@veritastaxdallas.com",
    social: "LinkedIn: /company/veritas-tax-dallas",
    websiteStatus: "❌ No Website (Prime Web Prospect)",
    rating: "4.9 ★ (45 Google Reviews)",
    whyBuildFromUs: "High-value business clients expect trust. A professional corporate site will position them as the top CPA firm in Dallas."
  },
  {
    name: "Heritage Artisan Bakery & Cafe",
    type: "Popular Mid-Range Local Restaurant & Catering",
    revenueEstimate: "$600K - $1.1M / year",
    location: "New York, NY 10012",
    gmapsUrl: "https://maps.google.com/?q=Heritage+Artisan+Bakery+New+York+NY",
    phone: "+1 (212) 555-0177",
    email: "events@heritagebakeryny.com",
    social: "IG: @heritagebakeryny | Facebook: @HeritageBakeryNY",
    websiteStatus: "❌ No Website (Prime Web Prospect)",
    rating: "4.8 ★ (180 Google Reviews)",
    whyBuildFromUs: "High foot traffic and 180 Google reviews, but missing an event catering menu & online order site for corporate office orders."
  }
];

/**
 * Smart Intent-Based Response Processor
 */
export const generateMarkZapAIResponse = (userQuery) => {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Simple Greeting & Introduction Intent
  if (queryLower === 'hi i am rudra' || queryLower === 'hi' || queryLower === 'hello' || queryLower.startsWith('hi ') || queryLower.startsWith('hello ')) {
    const nameMatch = userQuery.match(/(?:i am|iam|name is|hi|hello)\s+([A-Za-z]+)/i);
    const userName = nameMatch && nameMatch[1] && nameMatch[1].toLowerCase() !== 'i' ? nameMatch[1] : 'Rudra';

    return {
      text: `Hello ${userName}! Welcome to Mark Zap AI Lead Finder.\n\n` +
            `I am your AI Lead Generation & Business Intelligence Engine. I can help you discover established mid-range local businesses without websites, complete with Google Maps links, phone numbers, and conversion strategies.\n\n` +
            `Type a query like "find plumbers in Miami" or "show mid-range leads" to start generating leads!`,
      type: 'greeting',
      leads: []
    };
  }

  // 2. Lead Discovery Query Intent
  let filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE;
  if (queryLower.includes('miami') || queryLower.includes('fl')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Miami'));
  } else if (queryLower.includes('austin') || queryLower.includes('dallas') || queryLower.includes('tx')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Austin') || l.location.includes('Dallas'));
  } else if (queryLower.includes('ny') || queryLower.includes('new york')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('New York'));
  }

  return {
    text: `⚡ **Agent-Reach Lead Intelligence Report for "${userQuery}"**\n` +
          `Discovered **${filteredLeads.length} High-Intent Mid-Range Businesses WITHOUT a Website** ($600K - $2.4M/yr Revenue Segment).`,
    type: 'mid-range-leads',
    leads: filteredLeads
  };
};
