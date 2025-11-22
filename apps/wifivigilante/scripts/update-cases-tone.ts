import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗ MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Dramatic title prefixes by category
const TITLE_TEMPLATES = {
  'Network Performance': [
    'The Mystery of the Vanishing Bandwidth',
    'Shadows in the Network',
    'The Case of the Phantom Lag',
    'When Speed Disappears',
    'The Bandwidth Heist',
    'Ghost in the Network',
    'The Slowdown Saboteur'
  ],
  'Security Incident': [
    'The Midnight Intruder',
    'Breach at',
    'The Invisible Threat',
    'Shadow Protocol',
    'The Unauthorized Access Mystery',
    'Dark Signals',
    'The Phantom Login'
  ],
  'Wireless Connectivity': [
    'The Wi-Fi Vanishing Act',
    'Signals from Nowhere',
    'The Disconnection Dilemma',
    'When Wi-Fi Goes Dark',
    'The Signal Sabotage',
    'The Wireless Whodunit',
    'The Great Wi-Fi Blackout'
  ],
  'Infrastructure Issue': [
    'The Infrastructure Breakdown',
    'Critical Failure at',
    'The System Collapse',
    'When Everything Went Dark',
    'The Network Nightmare',
    'Infrastructure Under Siege',
    'The Great Outage'
  ],
  'Device Configuration': [
    'The Misconfiguration Mystery',
    'Settings Gone Rogue',
    'The Configuration Conundrum',
    'Device Chaos at',
    'The Setup Sabotage',
    'When Configs Attack',
    'The Configuration Crisis'
  ],
  'Capacity Planning': [
    'The Capacity Crunch',
    'Too Much, Too Little',
    'The Scaling Challenge',
    'Network at the Breaking Point',
    'The Bandwidth Bottleneck',
    'Capacity Under Fire',
    'The Growth Dilemma'
  ],
  'Troubleshooting': [
    'The Diagnostic Detective',
    'Hunting the Network Gremlin',
    'The Troubleshooting Trail',
    'Mystery Malfunction at',
    'The Investigation',
    'Solving the Unsolvable',
    'The Network Puzzle'
  ],
  'Site Survey': [
    'Mapping the Unknown',
    'The Site Survey Revelation',
    'Discovering Dead Zones',
    'The Coverage Mystery',
    'Signal Mapping at',
    'The Great Survey',
    'Uncovering Network Secrets'
  ],
  'Topology Mapping': [
    'The Network Maze',
    'Mapping the Invisible',
    'The Topology Mystery',
    'Untangling the Web',
    'The Network Blueprint',
    'Discovery at',
    'The Hidden Network'
  ]
};

// Location name generators by subsector
const LOCATION_NAMES = {
  'Hospitals': ['Memorial Wing', 'Cardiac Care Unit', 'Emergency Department', 'Surgical Tower', 'Radiology Suite', 'ICU Ward'],
  'Clinics': ['Wellness Center', 'Primary Care Facility', 'Outpatient Clinic', 'Medical Plaza', 'Health Services Center'],
  'Laboratories': ['Research Lab', 'Diagnostic Center', 'Testing Facility', 'Analysis Wing', 'Pathology Department'],
  'Pharmacies': ['Pharmacy Department', 'Medication Center', 'Dispensary', 'Pharmaceutical Services'],
  'Universities': ['Engineering Hall', 'Student Center', 'Library Complex', 'Research Building', 'Campus Network Hub'],
  'K-12 Schools': ['Main Building', 'Science Wing', 'Student Commons', 'Administrative Offices', 'Computer Lab'],
  'Libraries': ['Reference Section', 'Study Commons', 'Digital Resources Center', 'Reading Rooms', 'Archives Wing'],
  'Training Centers': ['Conference Hall', 'Training Facility', 'Learning Center', 'Classroom Complex'],
  'Municipal Services': ['City Hall', 'Public Services Building', 'Administrative Center', 'Municipal Complex'],
  'Defense': ['Operations Center', 'Command Facility', 'Security Wing', 'Communications Hub'],
  'Emergency Services': ['Dispatch Center', 'Emergency Operations', 'Response Facility', 'Command Center'],
  'Public Administration': ['Government Office', 'Public Works Building', 'Administrative Complex'],
  'Automotive': ['Production Floor', 'Assembly Line', 'Manufacturing Wing', 'Quality Control Department'],
  'Electronics': ['Fabrication Facility', 'Assembly Plant', 'Testing Laboratory', 'Production Line'],
  'Food & Beverage': ['Processing Plant', 'Production Facility', 'Packaging Department', 'Distribution Center'],
  'Warehousing': ['Distribution Hub', 'Logistics Center', 'Storage Facility', 'Warehouse Complex'],
  'Retail Stores': ['Main Store', 'Sales Floor', 'Customer Service Area', 'Retail Complex'],
  'Warehouses': ['Distribution Center', 'Logistics Hub', 'Storage Facility', 'Fulfillment Center'],
  'Supermarkets': ['Market Floor', 'Grocery Store', 'Shopping Center', 'Retail Complex'],
  'Restaurants': ['Dining Area', 'Kitchen Operations', 'Restaurant Floor', 'Service Area']
};

// Tool-specific investigation techniques (ensuring technical accuracy)
const TOOL_INVESTIGATIONS = {
  'EtherScope nXG': {
    'Wi-Fi App': 'Deployed EtherScope nXG Wi-Fi App to analyze channel utilization, signal strength, and interference patterns. Performed spectrum analysis across 2.4GHz and 5GHz bands, identifying overlapping channels and non-Wi-Fi interference sources.',
    'AirMapper App': 'Utilized AirMapper App to generate comprehensive coverage heatmaps. Conducted site walkthrough capturing RSSI values, identifying dead zones and signal overlap areas. Validated AP placement against floor plans.',
    'Network App': 'Engaged EtherScope nXG Network App for comprehensive wired network analysis. Performed auto-discovery, switch port identification, and VLAN validation. Verified PoE power levels and link speeds.',
    'default': 'Deployed EtherScope nXG for comprehensive network analysis. Conducted baseline measurements of throughput, latency, and packet loss. Utilized multiple apps to correlate wireless and wired performance metrics.'
  },
  'LinkRunner 10G': {
    'AutoTest': 'Executed LinkRunner 10G AutoTest sequence on critical network segments. Validated link speeds (100M/1G/10G), duplex settings, and switch connectivity. Performed TDR cable fault analysis to locate physical layer issues.',
    'default': 'Deployed LinkRunner 10G for rapid cable and switch validation. Ran comprehensive connectivity tests including link negotiation, PoE classification, and port identification. Documented results for infrastructure team.'
  },
  'AirCheck G3': {
    'Wi-Fi Testing': 'Utilized AirCheck G3 for rapid Wi-Fi troubleshooting. Scanned all channels, identified rogue APs and interferers. Validated client connection quality, channel utilization, and AP coverage.',
    'Link-Live': 'Uploaded AirCheck G3 results to Link-Live for team collaboration. Generated shareable reports with detailed channel analysis, interference sources, and recommended remediation steps.',
    'default': 'Deployed AirCheck G3 for quick wireless network validation. Performed one-button AutoTest to verify SSID availability, security settings, and connection quality. Identified nearby networks and potential sources of interference.'
  },
  'LinkRunner 2000': {
    'AutoTest': 'Executed LinkRunner 2000 AutoTest for rapid connectivity validation. Verified Ethernet link status, switch port info, and VLAN assignment. Performed PoE power measurement to validate device power requirements.',
    'TruePower PoE': 'Utilized TruePower PoE testing to measure actual power delivery under load conditions. Validated PoE class, voltage levels, and power budget allocation for connected devices.',
    'default': 'Deployed LinkRunner 2000 for essential network connectivity testing. Ran AutoTest to quickly identify switch port configuration, VLAN settings, and link negotiation status.'
  },
  'LinkRunner 3000': {
    'AutoTest': 'Ran LinkRunner 3000 AutoTest sequence for comprehensive connectivity validation. Tested link speeds up to 10G, verified duplex settings, measured PoE power delivery. Validated switch port configuration and VLAN assignments.',
    'default': 'Utilized LinkRunner 3000 for rapid network troubleshooting. Performed AutoTest and cable diagnostics to isolate connectivity issues. Documented port configuration and power delivery for infrastructure planning.'
  },
  'LinkRunner 4000': {
    'AutoTest': 'Executed LinkRunner 4000 AutoTest with advanced diagnostics. Validated multi-gig link speeds, performed comprehensive PoE testing including 802.3bt capability. Generated detailed reports via Link-Live cloud integration.',
    'Link-Live': 'Synchronized LinkRunner 4000 results to Link-Live for instant team visibility. Created comparison reports showing before/after remediation metrics. Utilized cloud-based troubleshooting workflows.',
    'default': 'Deployed LinkRunner 4000 for enterprise-grade connectivity testing. Performed AutoTest with cloud reporting, validated PoE power delivery, identified switch stack configuration. Results uploaded to Link-Live for documentation.'
  },
  'CyberScope': {
    'Network Security Analysis': 'Deployed CyberScope for comprehensive security assessment. Performed vulnerability scanning, device fingerprinting, and open port analysis. Validated security policies and identified potential attack vectors.',
    'default': 'Utilized CyberScope for network security audit. Scanned for unauthorized devices, assessed security configurations, and validated segmentation policies. Generated risk assessment report with remediation priorities.'
  },
  'CyberScope Air': {
    'Wireless Security Testing': 'Executed CyberScope Air for wireless security analysis. Scanned for rogue APs, unauthorized clients, and weak encryption. Performed evil twin detection and wireless IDS validation. Identified security policy violations.',
    'default': 'Deployed CyberScope Air for Wi-Fi security assessment. Discovered all wireless networks in range, analyzed encryption methods, detected potential security threats. Validated wireless security policies and identified risks.'
  },
  'Link-Live': {
    'Site Survey': 'Utilized Link-Live cloud platform for comprehensive site survey planning and execution. Coordinated team members, tracked coverage validation, and generated collaborative reports. Monitored real-time results from multiple field technicians.',
    'Topology Mapping': 'Leveraged Link-Live for automated network topology discovery. Aggregated data from multiple test devices, created visual network maps, identified infrastructure dependencies. Shared interactive topology with stakeholders.',
    'default': 'Employed Link-Live cloud platform for centralized network management. Aggregated test results from field devices, generated compliance reports, tracked historical performance trends. Enabled team collaboration and data sharing.'
  },
  'AirMagnet Survey Pro': {
    'Site Survey': 'Conducted comprehensive RF site survey using AirMagnet Survey Pro. Performed active and passive surveys to validate coverage, capacity, and quality. Generated detailed heatmaps showing RSSI, SNR, and data rates across facility.',
    'default': 'Deployed AirMagnet Survey Pro for professional-grade wireless survey. Created floor plans, conducted walkthrough surveys, analyzed coverage gaps. Generated comprehensive reports with AP placement recommendations.'
  },
  'OptiView XG': {
    'Network Analysis': 'Utilized OptiView XG for deep packet analysis and network troubleshooting. Performed application performance testing, VoIP quality assessment, and bandwidth utilization analysis. Identified top talkers and application bottlenecks.',
    'default': 'Deployed OptiView XG for enterprise network diagnostics. Conducted wire-speed packet capture, analyzed protocols, validated QoS configurations. Generated detailed performance reports with remediation recommendations.'
  }
};

// Generate dramatic incident overview
function generateDramaticOverview(category, subsector, location, _tool) {
  const scenarios = {
    'Network Performance': [
      `${location} staff reported the network crawling to a halt during peak hours. "It's like watching paint dry," muttered the IT manager as file transfers stalled and cloud applications timed out. Users complained of degraded performance affecting critical operations.`,
      `A cascade of slow response times plagued ${location}, bringing productivity to a standstill. Employees gathered around IT's desk: "The system's broken again." Network performance had degraded mysteriously overnight, affecting dozens of users.`,
      `"Everything just... stopped working," reported a frustrated user in ${location}. Network throughput had plummeted to a fraction of normal levels. Applications hung, downloads failed, and patience wore thin as the issue persisted.`
    ],
    'Security Incident': [
      `A security alert lit up the ${location} monitoring dashboard at 2:47 AM. Unusual network traffic patterns suggested unauthorized access attempts. "We've got a breach," the security analyst announced, initiating incident response protocols.`,
      `Suspicious login attempts triggered alerts across ${location} systems. The security team discovered anomalous traffic patterns emanating from an unexpected source. "This doesn't look right," the analyst noted, initiating a full investigation.`,
      `${location} security monitoring detected unauthorized network scanning activity. Multiple failed authentication attempts preceded unusual data transfer patterns. The incident response team mobilized to contain the potential threat.`
    ],
    'Wireless Connectivity': [
      `Wi-Fi devices across ${location} began dropping connections without warning. "The wireless network is acting possessed," complained a user as their laptop reconnected for the third time in five minutes. Dozens of users experienced the same mysterious disconnections.`,
      `Wireless clients in ${location} reported intermittent connectivity that defied explanation. Users connected successfully only to lose their links moments later. "It works, then it doesn't," became the common refrain as frustration mounted.`,
      `A wave of Wi-Fi connection failures swept through ${location}. Devices that had worked flawlessly for months suddenly refused to maintain stable connections. "Something's interfering with our wireless," the network admin suspected.`
    ],
    'Infrastructure Issue': [
      `Critical infrastructure alarms triggered simultaneously across ${location}. Multiple systems went offline in rapid succession. "We've lost half the network," the on-call engineer reported, rushing to diagnose the cascading failure.`,
      `${location} experienced a complete network outage at the worst possible time. Switches went dark, access points went silent, and panic ensued. "Everything's down," staff reported as operations ground to a halt.`,
      `Power fluctuations in ${location} led to mysterious network equipment failures. One by one, infrastructure devices dropped offline. "This is a disaster," the facilities manager observed as the extent of the damage became clear.`
    ],
    'Device Configuration': [
      `Newly deployed devices in ${location} refused to communicate properly. "The configuration looks right, but nothing works," the network engineer puzzled over settings that should have been straightforward. Something in the device config was fundamentally wrong.`,
      `${location} equipment exhibited bizarre behavior after a routine update. Devices that should have connected seamlessly encountered mysterious errors. "The configs were pushed correctly," insisted the admin, yet problems persisted.`,
      `A configuration drift in ${location} caused a chain reaction of connectivity failures. Devices gradually fell out of compliance with network standards. "How did this even happen?" the team wondered as they uncovered the scope of misconfiguration.`
    ],
    'Capacity Planning': [
      `${location} network utilization graphs painted a concerning picture: capacity approaching critical levels. "We're going to hit a wall soon," the network architect warned, observing traffic patterns trending toward infrastructure limits.`,
      `Growth in ${location} outpaced network capacity planning. Bandwidth consumption had tripled in six months, straining infrastructure designed for lighter loads. "We need to scale, and fast," management realized.`,
      `${location} struggled under unexpectedly heavy network demands. Capacity constraints created bottlenecks affecting performance. "We didn't anticipate this level of growth," the planning team admitted as users complained.`
    ],
    'Troubleshooting': [
      `An intermittent issue in ${location} defied conventional troubleshooting. The problem appeared randomly, disappeared without intervention, and left no obvious traces. "This is the strangest thing I've seen," the senior tech admitted.`,
      `${location} experienced a mysterious network anomaly that puzzled even experienced engineers. Standard troubleshooting steps yielded no answers. "We need to dig deeper," the team lead decided, preparing for advanced diagnostics.`,
      `Complaints poured in from ${location} users about network behavior that made no technical sense. The symptoms contradicted each other, the timing seemed random, and conventional wisdom failed. "Time for the heavy artillery," the engineer declared.`
    ],
    'Site Survey': [
      `${location} wireless coverage had never been professionally validated. "We just placed APs where they seemed good," the admin admitted. Now, with expansion plans looming, management demanded a proper site survey to validate capacity.`,
      `Recent construction in ${location} prompted questions about Wi-Fi coverage quality. "Do we have dead zones?" management asked. A comprehensive site survey would reveal the truth about wireless infrastructure effectiveness.`,
      `${location} prepared for a major wireless upgrade, but first needed baseline measurements. "We're flying blind without proper survey data," the consultant explained. Time to map reality versus expectations.`
    ],
    'Topology Mapping': [
      `Network documentation for ${location} existed only in fragmented notes and one engineer's memory. "What happens when they retire?" management worried. The network topology remained a mystery waiting to be solved.`,
      `${location} infrastructure had evolved organically over years without proper documentation. "Nobody knows where all the cables go," admitted the facilities team. Time to create an accurate topology map.`,
      `A merger brought ${location} under new management who demanded complete network visibility. "Show us what we actually have," they requested. The existing documentation proved woefully inadequate for modern operations.`
    ]
  };

  const options = scenarios[category] || scenarios['Troubleshooting'];
  return options[Math.floor(Math.random() * options.length)];
}

// Generate tool-appropriate investigation with technical accuracy
function generateInvestigation(tool, category, rootCause) {
  const toolName = tool.split('(')[0].trim();
  const appMatch = tool.match(/\(([^)]+)\)/);
  const appName = appMatch ? appMatch[1].split(',')[0].trim() : 'default';

  const investigations = TOOL_INVESTIGATIONS[toolName];
  if (!investigations) {
    return `Deployed ${toolName} for comprehensive network analysis. Conducted systematic troubleshooting to isolate the root cause. Collected detailed diagnostic data and correlated findings with reported symptoms.`;
  }

  const baseInvestigation = investigations[appName] || investigations['default'];

  // Add context based on what was found
  const findings = [
    `Analysis revealed ${rootCause.toLowerCase()}.`,
    `Data clearly indicated ${rootCause.toLowerCase()}.`,
    `Diagnostic results pointed directly to ${rootCause.toLowerCase()}.`,
    `Investigation uncovered ${rootCause.toLowerCase()}.`
  ];

  return `${baseInvestigation} ${findings[Math.floor(Math.random() * findings.length)]}`;
}

// Generate technically accurate root causes by category
function generateRootCause(category, _tool) {
  const causes = {
    'Network Performance': [
      'misconfigured QoS policies causing improper traffic prioritization',
      'bandwidth saturation from uncontrolled broadcast traffic',
      'aging switch hardware operating beyond capacity',
      'duplicate IP addresses creating network conflicts',
      'routing loops caused by spanning tree misconfiguration',
      'congested uplink ports creating bottlenecks'
    ],
    'Security Incident': [
      'unauthorized device attempting network reconnaissance',
      'compromised workstation serving as attack pivot point',
      'outdated firmware containing exploitable vulnerabilities',
      'weak WPA2 passphrase enabling unauthorized access',
      'rogue access point providing unauthorized network entry',
      'unpatched security vulnerabilities in network equipment'
    ],
    'Wireless Connectivity': [
      'channel overlap with neighboring wireless networks',
      'insufficient access point density for user load',
      'power level settings creating coverage gaps',
      'legacy 2.4GHz clients causing airtime contention',
      'physical obstructions creating RF dead zones',
      'adjacent-channel interference from overlapping APs'
    ],
    'Infrastructure Issue': [
      'failed network switch affecting multiple VLANs',
      'degraded fiber connection with excessive attenuation',
      'PoE budget exhaustion causing device brownouts',
      'environmental factors (heat/humidity) affecting equipment',
      'firmware incompatibility causing protocol failures',
      'failing UPS causing intermittent power disruptions'
    ],
    'Device Configuration': [
      'VLAN mismatch between switch ports and device configuration',
      'incorrect DNS settings preventing name resolution',
      'MTU size mismatch causing packet fragmentation',
      'duplex mismatch between NIC and switch port',
      'incorrect subnet mask isolating devices',
      'missing default gateway preventing inter-VLAN routing'
    ],
    'Capacity Planning': [
      'user growth exceeding planned network capacity',
      'application bandwidth requirements doubling unexpectedly',
      'backup traffic saturating available bandwidth',
      'video conferencing adoption straining infrastructure',
      'IoT device proliferation consuming network resources',
      'cloud migration creating unexpected traffic patterns'
    ],
    'Troubleshooting': [
      'intermittent cable fault causing packet loss',
      'EMI from nearby electrical equipment disrupting signals',
      'spanning tree reconvergence causing periodic outages',
      'multicast flooding overwhelming switch backplane',
      'ARP cache poisoning from misconfigured device',
      'broadcast storms from looped network cable'
    ],
    'Site Survey': [
      'inadequate AP coverage in renovated areas',
      'high-density areas lacking sufficient capacity',
      'signal attenuation from new construction materials',
      'coverage gaps in critical operational zones',
      'co-channel interference from dense AP deployment',
      'insufficient 5GHz coverage for modern clients'
    ],
    'Topology Mapping': [
      'undocumented network segments creating security risks',
      'shadow IT infrastructure bypassing proper controls',
      'unauthorized VLAN extensions creating policy violations',
      'redundant paths lacking proper documentation',
      'orphaned network equipment consuming resources',
      'untracked fiber connections creating confusion'
    ]
  };

  const categoryArray = causes[category] || causes['Troubleshooting'];
  return categoryArray[Math.floor(Math.random() * categoryArray.length)];
}

// Generate resolution matching the root cause
function generateResolution(rootCause, tool) {
  const toolName = tool.split('(')[0].trim();

  const resolutionMappings = {
    'qos': `Reconfigured QoS policies using ${toolName}-validated traffic classifications. Implemented proper priority queuing for critical applications. Verified correct operation through follow-up testing.`,
    'bandwidth': `Upgraded network infrastructure to handle increased capacity. Implemented traffic shaping policies to manage bandwidth utilization. ${toolName} validation confirmed improved performance.`,
    'switch': `Replaced aging switch hardware with modern enterprise equipment. Migrated all connections systematically to minimize downtime. Verified proper operation with ${toolName} comprehensive testing.`,
    'ip address': `Implemented IP Address Management (IPAM) system to prevent conflicts. Reconfigured DHCP scopes with proper exclusions. ${toolName} confirmed resolution of duplicate address issues.`,
    'routing': `Corrected spanning tree configuration to eliminate loops. Validated proper topology convergence. ${toolName} testing verified stable network operation.`,
    'unauthorized': `Isolated compromised device from network. Implemented enhanced access controls and monitoring. Security team validated remediation using ${toolName} security scanning.`,
    'firmware': `Applied critical security patches to all affected devices. Verified firmware integrity and proper operation. ${toolName} validation confirmed vulnerability remediation.`,
    'password': `Changed wireless authentication to use stronger WPA3 security. Implemented complex passphrase policy. ${toolName} verified improved security posture.`,
    'rogue': `Located and removed rogue access point from network. Enhanced wireless monitoring to detect future threats. ${toolName} scans confirmed clean wireless environment.`,
    'channel': `Optimized channel assignments using ${toolName} spectrum analysis. Configured APs for minimal overlap and interference. Post-implementation survey validated improved performance.`,
    'density': `Deployed additional access points in high-density areas. Optimized channel and power settings for capacity. ${toolName} heatmaps confirmed comprehensive coverage.`,
    'power': `Adjusted AP power levels using ${toolName} recommendations. Balanced coverage vs. interference considerations. Follow-up survey validated optimal settings.`,
    'fiber': `Replaced degraded fiber patch cables. Cleaned all fiber connectors and validated loss levels. ${toolName} confirmed proper link operation.`,
    'poe': `Upgraded PoE switches to higher power budget models. Redistributed devices across power-capable ports. ${toolName} validation confirmed adequate power delivery.`,
    'environmental': `Implemented improved cooling for network equipment. Relocated sensitive devices away from heat sources. Temperature monitoring showed healthy operating conditions.`,
    'vlan': `Corrected VLAN assignments across all switch ports. Updated device configurations to match network design. ${toolName} verified proper VLAN connectivity.`,
    'dns': `Configured correct DNS server addresses. Validated name resolution functionality. ${toolName} testing confirmed proper DNS operation.`,
    'mtu': `Standardized MTU settings across network infrastructure. Configured jumbo frames where appropriate. ${toolName} validated elimination of fragmentation issues.`,
    'duplex': `Configured proper auto-negotiation settings. Verified link speed and duplex match. ${toolName} confirmed optimal link operation.`,
    'capacity': `Implemented bandwidth upgrades to accommodate growth. Enhanced QoS policies for critical applications. ${toolName} monitoring showed healthy utilization levels.`,
    'cable': `Located and replaced faulty network cable. Performed TDR testing to verify cable integrity. ${toolName} confirmed elimination of packet loss.`,
    'emi': `Rerouted network cables away from EMI sources. Implemented shielded cabling where necessary. ${toolName} validation showed clean signal quality.`,
    'coverage': `Deployed additional APs to fill coverage gaps. Optimized placement using ${toolName} site survey data. Validated comprehensive coverage through testing.`,
    'documentation': `Created comprehensive network topology documentation. Updated diagrams with current infrastructure state. ${toolName} data provided accurate baseline for future planning.`
  };

  // Find matching resolution template
  for (const [key, resolution] of Object.entries(resolutionMappings)) {
    if (rootCause.toLowerCase().includes(key)) {
      return resolution;
    }
  }

  // Default resolution
  return `Implemented corrective measures based on ${toolName} diagnostic findings. Validated proper operation through comprehensive post-implementation testing. Documented changes for future reference and monitoring.`;
}

function generateTitle(category, subsector, location) {
  const templates = TITLE_TEMPLATES[category] || TITLE_TEMPLATES['Troubleshooting'];
  const template = templates[Math.floor(Math.random() * templates.length)];

  // If template includes location placeholder or ends with "at"
  if (template.includes('at') || template.includes('in')) {
    return `${template} ${location}`;
  }

  return template;
}

function generateLocation(subsectorName) {
  const locations = LOCATION_NAMES[subsectorName] || ['Main Facility', 'Operations Center', 'Primary Location'];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateHashtags(_tool, category, sector) {
  const toolTag = _tool.split('(')[0].trim().replace(/\s+/g, '');
  const categoryTag = category.replace(/\s+/g, '');
  const sectorTag = sector.replace(/\s+/g, '');

  return `#WiFiVigilante,#${toolTag},#${categoryTag},#${sectorTag}`;
}

async function updateCase(caseData) {
  const { data: sectorData } = await supabase
    .from('sectors')
    .select('name')
    .eq('id', caseData.sector_id)
    .single();

  const { data: subsectorData } = await supabase
    .from('subsectors')
    .select('name')
    .eq('id', caseData.subsector_id)
    .single();

  const sectorName = sectorData?.name || 'Unknown';
  const subsectorName = subsectorData?.name || 'Unknown';

  // Generate location name
  const location = generateLocation(subsectorName);

  // Generate dramatic title
  const title = generateTitle(caseData.category, subsectorName, location);

  // Generate root cause that makes sense for the category and tool
  const rootCause = generateRootCause(caseData.category, caseData.tool);

  // Generate incident overview with drama
  const incidentOverview = generateDramaticOverview(caseData.category, subsectorName, location, caseData.tool);

  // Generate technically accurate investigation
  const investigationBreakdown = generateInvestigation(caseData.tool, caseData.category, rootCause);

  // Generate resolution that matches root cause
  const resolution = generateResolution(rootCause, caseData.tool);

  // Generate verdict
  const verdict = caseData.severity === 'Critical' || caseData.severity === 'High'
    ? 'Critical incident resolved. Preventive measures implemented to avoid recurrence.'
    : 'Issue resolved successfully. Network operations restored to normal.';

  // Generate summary
  const summary = `${location} experienced ${caseData.category.toLowerCase()} affecting operations. ${caseData.tool.split('(')[0].trim()} investigation identified ${rootCause}. ${resolution.split('.')[0]}.`;

  // Generate hashtags
  const tags = generateHashtags(caseData.tool, caseData.category, sectorName);

  // Update the case
  const { error } = await supabase
    .from('case_files')
    .update({
      title,
      location,
      incident_overview: incidentOverview,
      investigation_breakdown: investigationBreakdown,
      root_cause: rootCause,
      resolution,
      verdict,
      summary,
      tags
    })
    .eq('id', caseData.id);

  return { success: !error, error };
}

async function main() {
  console.log('🎭 Starting Wi-Fi Vigilante tone enhancement...\n');

  // Get all cases that need updating (exclude the original 15)
  const { data: cases, error: fetchError } = await supabase
    .from('case_files')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(530); // Update the generated cases

  if (fetchError) {
    console.error('Error fetching cases:', fetchError);
    return;
  }

  console.log(`📊 Found ${cases.length} cases to enhance\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < cases.length; i++) {
    const caseData = cases[i];

    try {
      const result = await updateCase(caseData);
      if (result.success) {
        updated++;
        if ((i + 1) % 50 === 0) {
          console.log(`✓ Progress: ${i + 1}/${cases.length} cases enhanced`);
        }
      } else {
        errors++;
        console.error(`✗ Error updating case ${caseData.id}:`, result.error);
      }
    } catch (err) {
      errors++;
      console.error(`✗ Exception updating case ${caseData.id}:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Enhancement complete!`);
  console.log(`📊 Updated: ${updated} cases`);
  console.log(`❌ Errors: ${errors} cases`);
  console.log('='.repeat(60));
}

main().catch(console.error);
