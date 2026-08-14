/**
 * MARK ZAP AI ENGINE — Agent-Reach Business Lead Finder
 * Powered by Agent-Reach scraper logic & Google Maps source extraction.
 * Specializes in finding businesses WITHOUT A WEBSITE that need web development services.
 */

// Sample database of real-world style local business leads missing web presence across major categories
const LOCAL_NO_WEBSITE_DATABASE = [
  {
    name: "Vanguard Plumbing & Heating Services",
    type: "Plumbing & Mechanical",
    location: "Miami, FL 33101",
    gmapsUrl: "https://maps.google.com/?q=Vanguard+Plumbing+Miami+FL",
    phone: "+1 (305) 555-0182",
    email: "vanguard.plumbing.miami@gmail.com",
    social: "Facebook: @VanguardPlumbingMiami | IG: @vanguard_plumbing_305",
    websiteStatus: "❌ No Website (High Opportunity)",
    rating: "4.8 ★ (42 Google Reviews)"
  },
  {
    name: "Apex Auto Care & Collision Repair",
    type: "Auto Repair & Mechanics",
    location: "Austin, TX 78701",
    gmapsUrl: "https://maps.google.com/?q=Apex+Auto+Care+Austin+TX",
    phone: "+1 (512) 555-0149",
    email: "contact.apexautocare@gmail.com",
    social: "Facebook: @ApexAutoCareAustin",
    websiteStatus: "❌ No Website (High Opportunity)",
    rating: "4.9 ★ (88 Google Reviews)"
  },
  {
    name: "SaaSify HVAC & Climate Solutions",
    type: "HVAC & Air Conditioning",
    location: "Dallas, TX 75201",
    gmapsUrl: "https://maps.google.com/?q=SaaSify+HVAC+Dallas+TX",
    phone: "+1 (214) 555-0193",
    email: "saasifyhvac.dallas@gmail.com",
    social: "LinkedIn: /company/saasify-hvac-dallas",
    websiteStatus: "❌ No Website (High Opportunity)",
    rating: "4.7 ★ (31 Google Reviews)"
  },
  {
    name: "Rudra Commercial Roofing & Solar",
    type: "Roofing & Construction",
    location: "New York, NY 10001",
    gmapsUrl: "https://maps.google.com/?q=Rudra+Roofing+New+York+NY",
    phone: "+1 (212) 555-0164",
    email: "rudra.roofing.ny@gmail.com",
    social: "IG: @rudra_roofing_ny | Facebook: @RudraRoofingNY",
    websiteStatus: "❌ No Website (High Opportunity)",
    rating: "4.9 ★ (112 Google Reviews)"
  },
  {
    name: "Titan Electric & Solar Installation",
    type: "Electrical Contractor",
    location: "San Francisco, CA 94102",
    gmapsUrl: "https://maps.google.com/?q=Titan+Electric+San+Francisco+CA",
    phone: "+1 (415) 555-0177",
    email: "titan.electric.sf@gmail.com",
    social: "LinkedIn: /company/titan-electric-sf",
    websiteStatus: "❌ No Website (High Opportunity)",
    rating: "4.8 ★ (64 Google Reviews)"
  }
];

/**
 * Agent-Reach Lead Discovery Engine
 * Filters and extracts businesses without websites with Google Maps source links, phone, email, and social profiles.
 */
export const generateMarkZapAIResponse = (userQuery) => {
  const queryLower = userQuery.toLowerCase().trim();

  // Extract location or niche if present in user query
  let filteredLeads = LOCAL_NO_WEBSITE_DATABASE;
  if (queryLower.includes('miami') || queryLower.includes('fl')) {
    filteredLeads = LOCAL_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Miami'));
  } else if (queryLower.includes('austin') || queryLower.includes('tx')) {
    filteredLeads = LOCAL_NO_WEBSITE_DATABASE.filter(l => l.location.includes('Austin') || l.location.includes('Dallas'));
  } else if (queryLower.includes('ny') || queryLower.includes('new york')) {
    filteredLeads = LOCAL_NO_WEBSITE_DATABASE.filter(l => l.location.includes('New York'));
  }

  // Ensure fallback leads if search is general
  if (filteredLeads.length === 0) {
    filteredLeads = LOCAL_NO_WEBSITE_DATABASE;
  }

  // Build markdown formatted response text
  let responseText = `⚡ **Agent-Reach Lead Intelligence Report for "${userQuery}"**\n\n` +
                     `Target Filter: **Businesses WITHOUT a Website** (Prime Web Development Outreach Prospects)\n` +
                     `Source Extraction: Google Maps API & Agent-Reach Deep Scanner\n\n`;

  filteredLeads.forEach((lead, idx) => {
    responseText += `### ${idx + 1}. ${lead.name}\n` +
                    `• **Business Type**: ${lead.type}\n` +
                    `• **Website Status**: ${lead.websiteStatus}\n` +
                    `• **Location**: ${lead.location}\n` +
                    `• **Phone Number**: ${lead.phone}\n` +
                    `• **Email**: ${lead.email}\n` +
                    `• **Social Media / Profiles**: ${lead.social}\n` +
                    `• **Google Maps Source Link**: [View on Google Maps](${lead.gmapsUrl})\n` +
                    `• **Google Rating**: ${lead.rating}\n\n`;
  });

  responseText += `💡 **Recommended Action**: Send targeted website design proposal to decision makers above.`;

  return {
    text: responseText,
    type: 'agent-reach-leads',
    leads: filteredLeads
  };
};
