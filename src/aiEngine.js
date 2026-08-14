/**
 * MARK ZAP AI ENGINE — Agent-Reach Mid-Range Lead Finder
 * Targets established mid-range local businesses without websites (Ideal Web Dev Prospects).
 * Filters OUT huge enterprise giants (BMW, SBI) and micro roadside stalls.
 */

// Database of established mid-range local business prospects without websites
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
 * Agent-Reach Mid-Range Lead Discovery Engine
 */
export const generateMarkZapAIResponse = (userQuery) => {
  const queryLower = userQuery.toLowerCase().trim();

  // Filter leads based on query location
  let filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE;
  if (queryLower.includes('miami') || queryLower.includes('fl')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Miami'));
  } else if (queryLower.includes('austin') || queryLower.includes('dallas') || queryLower.includes('tx')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Austin') || l.location.includes('Dallas'));
  } else if (queryLower.includes('ny') || queryLower.includes('new york')) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE.filter(l => l.location.includes('New York'));
  }

  if (filteredLeads.length === 0) {
    filteredLeads = MID_RANGE_NO_WEBSITE_DATABASE;
  }

  // Build markdown summary text
  let responseText = `⚡ **Agent-Reach Mid-Range Lead Discovery Report**\n\n` +
                     `🎯 **Target ICP Profile**: Established Mid-Range Local Businesses WITHOUT a Website\n` +
                     `🚫 **Filtered Out**: Enterprise Giants (BMW/SBI) & Micro Roadside Stalls\n` +
                     `💰 **Target Revenue Segment**: $600K - $2.4M / year (High Budget & High Decision Velocity)\n\n`;

  filteredLeads.forEach((lead, idx) => {
    responseText += `### ${idx + 1}. ${lead.name}\n` +
                    `• **Category**: ${lead.type}\n` +
                    `• **Est. Revenue**: ${lead.revenueEstimate}\n` +
                    `• **Website Status**: ${lead.websiteStatus}\n` +
                    `• **Location**: ${lead.location}\n` +
                    `• **Phone Number**: ${lead.phone}\n` +
                    `• **Email**: ${lead.email}\n` +
                    `• **Social Media**: ${lead.social}\n` +
                    `• **Google Maps**: [View Source on Google Maps](${lead.gmapsUrl})\n` +
                    `• **Why They Will Build From Us**: ${lead.whyBuildFromUs}\n\n`;
  });

  responseText += `💡 **Conversion Strategy**: Pitch how a custom Mark Zap website will capture their missing monthly appointments & online revenue.`;

  return {
    text: responseText,
    type: 'mid-range-leads',
    leads: filteredLeads
  };
};
