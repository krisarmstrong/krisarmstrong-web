import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗ MISSING');
  console.error('\nPlease ensure your .env file contains:');
  console.error('VITE_SUPABASE_URL=your-supabase-url'); // eslint-disable-line no-secrets/no-secrets
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (NO VITE_ prefix!)'); // eslint-disable-line no-secrets/no-secrets
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Product launch dates and availability
const PRODUCTS = {
  'EtherScope nXG': { launchDate: new Date('2018-01-01'), apps: ['Wi-Fi App', 'AirMapper App', 'Link-Live Cloud Service'] },
  'LinkRunner 10G': { launchDate: new Date('2019-03-01'), apps: ['AutoTest'] },
  'AirCheck G3': { launchDate: new Date('2020-01-01'), apps: ['Wi-Fi Testing', 'Link-Live'] },
  'LinkRunner 2000': { launchDate: new Date('2015-01-01'), apps: ['AutoTest', 'TruePower PoE'] },
  'LinkRunner 3000': { launchDate: new Date('2017-01-01'), apps: ['AutoTest', 'TruePower PoE'] },
  'LinkRunner 4000': { launchDate: new Date('2020-06-01'), apps: ['AutoTest', 'TruePower PoE', 'Link-Live'] },
  'CyberScope': { launchDate: new Date('2021-01-01'), apps: ['Network Security Analysis'] },
  'CyberScope Air': { launchDate: new Date('2022-01-01'), apps: ['Wireless Security Testing'] },
};

// Additional tools
const ADDITIONAL_TOOLS = [
  'Link-Live',
  'AirMagnet Survey Pro',
  'OptiView XG'
];

// Sectors and subsectors mapping (matches database structure)
const SECTORS_SUBSECTORS = {
  'Healthcare': ['Hospitals', 'Clinics', 'Laboratories', 'Pharmacies'],
  'Manufacturing': ['Automotive', 'Electronics', 'Food & Beverage', 'Warehousing'],
  'Government': ['Municipal Services', 'Defense', 'Emergency Services', 'Public Administration'],
  'Education': ['Universities', 'K-12 Schools', 'Libraries', 'Training Centers'],
  'Retail': ['Retail Stores', 'Warehouses', 'Supermarkets', 'Restaurants']
};

// Categories
const CATEGORIES = [
  'Network Performance',
  'Security Incident',
  'Wireless Connectivity',
  'Infrastructure Issue',
  'Device Configuration',
  'Capacity Planning',
  'Troubleshooting',
  'Site Survey',
  'Topology Mapping'
];

// Severities with weighted distribution
const SEVERITIES = [
  { value: 'Critical', weight: 0.15 },
  { value: 'High', weight: 0.25 },
  { value: 'Medium', weight: 0.40 },
  { value: 'Low', weight: 0.20 }
];

// Statuses with weighted distribution
const STATUSES = [
  { value: 'Resolved', weight: 0.70 },
  { value: 'Closed', weight: 0.20 },
  { value: 'In Progress', weight: 0.08 },
  { value: 'Open', weight: 0.02 }
];

// Sample names for detected_by field
const FIRST_NAMES = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Jessica', 'James', 'Amy', 'Chris', 'Maria', 'Daniel', 'Laura', 'Mark', 'Rachel', 'Tom', 'Susan'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'];

// Sample locations
const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'San Francisco, CA',
  'Charlotte, NC', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getWeightedRandom(options) {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) return option.value;
  }
  return options[0].value;
}

function generateRandomDate(start, end, preferWeekday = true) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  if (preferWeekday && Math.random() > 0.15) { // 85% weekdays, 15% weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) date.setDate(date.getDate() + 1); // Sunday -> Monday
    if (dayOfWeek === 6) date.setDate(date.getDate() + 2); // Saturday -> Monday
  }

  return date.toISOString().split('T')[0];
}

function generateRandomName() {
  const role = getRandomElement([
    'Dr.', 'Nurse', 'Teacher', 'Professor', 'IT Manager', 'Network Admin',
    'Store Manager', 'Operations Manager', 'Security Officer', 'Facilities Manager'
  ]);
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);
  return `${role} ${firstName} ${lastName}`;
}

function generatePublicId() {
  // Generate a proper UUID
  return randomUUID();
}

function generateIncidentOverview(_sector, subsector, _tool, _category) {
  const templates = {
    'Network Performance': [
      `Users in the ${subsector.toLowerCase()} reported intermittent network connectivity and significant performance degradation during peak hours. Network traffic analysis revealed bottlenecks affecting critical operations.`,
      `Performance monitoring detected unusual latency spikes across the ${subsector.toLowerCase()} network. Investigation required to identify root cause and restore optimal service levels.`,
      `Multiple complaints of slow network speeds in the ${subsector.toLowerCase()}. Initial assessment suggested potential bandwidth saturation or infrastructure limitations.`
    ],
    'Security Incident': [
      `Security team flagged suspicious network activity originating from the ${subsector.toLowerCase()}. Immediate investigation launched to assess potential breach and contain threat.`,
      `Unauthorized access attempts detected on critical ${subsector.toLowerCase()} systems. Security protocols activated to investigate and mitigate risks.`,
      `Anomalous traffic patterns identified in the ${subsector.toLowerCase()} network. Forensic analysis initiated to determine security implications.`
    ],
    'Wireless Connectivity': [
      `Widespread Wi-Fi connectivity issues reported across the ${subsector.toLowerCase()}. Users experiencing frequent disconnections and inability to maintain stable wireless connections.`,
      `Wireless network coverage gaps identified in newly renovated ${subsector.toLowerCase()} areas. Site survey required to optimize access point placement.`,
      `Interference affecting Wi-Fi performance in the ${subsector.toLowerCase()}. Investigation needed to identify source and implement mitigation strategies.`
    ],
    'Infrastructure Issue': [
      `Critical infrastructure failure detected in the ${subsector.toLowerCase()} network. Multiple systems offline, requiring immediate assessment and repair.`,
      `Aging network equipment in the ${subsector.toLowerCase()} showing signs of failure. Proactive investigation to prevent complete system outage.`,
      `Power issues affecting network infrastructure in the ${subsector.toLowerCase()}. PoE devices experiencing intermittent failures.`
    ],
    'Capacity Planning': [
      `${subsector} expansion project requires comprehensive network capacity assessment. Current infrastructure may not support planned growth.`,
      `Bandwidth utilization approaching critical thresholds in the ${subsector.toLowerCase()}. Capacity planning analysis needed for infrastructure upgrades.`,
      `New technology deployment in ${subsector.toLowerCase()} requires network capacity evaluation to ensure seamless integration.`
    ]
  };

  const categoryTemplates = templates[_category] || templates['Network Performance'];
  return getRandomElement(categoryTemplates);
}

function generateInvestigationBreakdown(_tool, _sector, _category) {
  const investigations = [
    `Deployed ${_tool} to perform comprehensive network analysis. Conducted baseline measurements of throughput, latency, and packet loss across all critical segments. Identified multiple areas of concern requiring detailed examination.`,
    `Utilized ${_tool} for systematic troubleshooting. Performed cable testing, analyzed traffic patterns, and documented network topology. Discovered configuration inconsistencies contributing to reported issues.`,
    `Executed thorough investigation using ${_tool}. Collected performance metrics, examined access point configurations, and analyzed client connectivity patterns. Results indicated infrastructure optimization opportunities.`,
    `Employed ${_tool} for forensic analysis of the network environment. Conducted spectrum analysis, measured signal strength, and identified potential sources of interference. Documented findings for remediation planning.`
  ];
  return getRandomElement(investigations);
}

function generateRootCause(_category, _severity) {
  const causes = {
    'Network Performance': [
      'Misconfigured QoS policies causing traffic prioritization issues',
      'Insufficient bandwidth allocation for critical applications',
      'Aging network switches operating beyond capacity',
      'Suboptimal routing configuration creating bottlenecks',
      'Duplicate IP addresses causing network conflicts'
    ],
    'Security Incident': [
      'Compromised endpoint device used as attack vector',
      'Outdated firmware containing known vulnerabilities',
      'Weak authentication protocols enabling unauthorized access',
      'Misconfigured firewall rules allowing malicious traffic',
      'Social engineering attack targeting network credentials'
    ],
    'Wireless Connectivity': [
      'Channel overlap and co-channel interference from neighboring networks',
      'Insufficient access point density for user load',
      'Incorrect power settings causing coverage gaps',
      'Legacy 2.4GHz devices causing airtime contention',
      'Reflective surfaces creating multipath interference'
    ],
    'Infrastructure Issue': [
      'Failed network switch affecting multiple VLANs',
      'Degraded fiber optic connection with excessive attenuation',
      'PoE budget exhaustion causing device brownouts',
      'Environmental factors (temperature/humidity) affecting equipment',
      'Incompatible firmware versions causing protocol issues'
    ]
  };

  const categoryCauses = causes[_category] || causes['Network Performance'];
  return getRandomElement(categoryCauses);
}

function generateResolution(_rootCause, _tool) {
  const resolutions = [
    `Implemented corrective configuration changes identified through ${_tool} analysis. Verified proper operation through comprehensive post-implementation testing. System performance restored to baseline specifications.`,
    `Replaced aging network components with enterprise-grade equipment. Reconfigured network topology using best practices validated by ${_tool}. Conducted thorough verification of all affected systems.`,
    `Optimized wireless infrastructure based on ${_tool} recommendations. Adjusted channel assignments, power levels, and access point placement. Confirmed improved performance through follow-up site survey.`,
    `Applied security patches and hardened system configurations. Implemented enhanced monitoring using ${_tool} for ongoing threat detection. Validated remediation through penetration testing.`,
    `Upgraded network capacity and implemented traffic shaping policies. Used ${_tool} to verify bandwidth allocation and QoS implementation. Confirmed resolution with stakeholder acceptance testing.`
  ];
  return getRandomElement(resolutions);
}

function generateVerdict(status, severity) {
  if (status === 'Resolved' || status === 'Closed') {
    return severity === 'Critical' || severity === 'High'
      ? 'Successfully resolved critical network issue. Implemented preventive measures to avoid recurrence.'
      : 'Issue resolved satisfactorily. Network performance returned to normal operating parameters.';
  } else if (status === 'In Progress') {
    return 'Investigation ongoing. Temporary mitigation measures in place. Final resolution pending.';
  } else {
    return 'Case opened for investigation. Initial assessment completed. Resources allocated for resolution.';
  }
}

function generateSummary(_sector, subsector, _tool, _category, status) {
  return `${_category} incident in ${_sector} ${subsector.toLowerCase()} resolved using ${_tool}. Systematic investigation identified root cause and implemented comprehensive solution. ${status === 'Resolved' ? 'Network operations restored to optimal performance.' : 'Ongoing monitoring for continued stability.'}`;
}

function generateDuration(severity) {
  const durations = {
    'Critical': () => Math.floor(Math.random() * 120) + 180, // 3-5 hours
    'High': () => Math.floor(Math.random() * 120) + 120, // 2-4 hours
    'Medium': () => Math.floor(Math.random() * 90) + 60, // 1-2.5 hours
    'Low': () => Math.floor(Math.random() * 60) + 30 // 0.5-1.5 hours
  };
  return durations[severity]();
}

function generateTags(_category, _sector, _tool) {
  const baseTags = [_category, _sector];
  const additionalTags = [
    'Wi-Fi', 'Network Troubleshooting', 'Infrastructure', 'Performance Optimization',
    'Security', 'Capacity Planning', 'Site Survey', 'Wireless', 'Ethernet'
  ];

  // Add 2-3 random additional tags
  const numTags = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < numTags; i++) {
    const tag = getRandomElement(additionalTags);
    if (!baseTags.includes(tag)) {
      baseTags.push(tag);
    }
  }

  return baseTags.join(', ');
}

async function getSectorId(sectorName) {
  const { data, error } = await supabase
    .from('sectors')
    .select('id')
    .eq('name', sectorName)
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(`Sector not found: ${sectorName}`);
  return data[0].id;
}

async function getSubsectorId(subsectorName, sectorId) {
  const { data, error } = await supabase
    .from('subsectors')
    .select('id')
    .eq('name', subsectorName)
    .eq('sector_id', sectorId)
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(`Subsector not found: ${subsectorName} in sector ${sectorId}`);
  return data[0].id;
}

async function generateCaseFile(productName: string, targetSector: string | null = null) {
  const product = PRODUCTS[productName];
  if (!product) {
    console.error(`Unknown product: ${productName}`);
    return null;
  }

  // Select sector and subsector
  const sector = targetSector || getRandomElement(Object.keys(SECTORS_SUBSECTORS));
  const subsector = getRandomElement(SECTORS_SUBSECTORS[sector]);

  // Get IDs from database
  const sectorId = await getSectorId(sector);
  const subsectorId = await getSubsectorId(subsector, sectorId);

  // Generate date within valid range for product
  const now = new Date();
  const startDate = product.launchDate;
  const incidentDate = generateRandomDate(startDate, now);

  // Select tool specification
  const useAdditionalTool = Math.random() < 0.2; // 20% chance of using additional tool
  const tool = useAdditionalTool
    ? getRandomElement(ADDITIONAL_TOOLS)
    : `${productName} (${getRandomElement(product.apps)})`;

  // Generate other fields
  const category = getRandomElement(CATEGORIES);
  const severity = getWeightedRandom(SEVERITIES);
  const status = getWeightedRandom(STATUSES);
  const location = getRandomElement(LOCATIONS);
  const detectedBy = generateRandomName();

  const publicId = generatePublicId();
  const title = `${category} - ${sector} ${subsector}`;
  const incidentOverview = generateIncidentOverview(sector, subsector, productName, category);
  const investigationBreakdown = generateInvestigationBreakdown(productName, sector, category);
  const rootCause = generateRootCause(category, severity);
  const resolution = generateResolution(rootCause, productName);
  const verdict = generateVerdict(status, severity);
  const summary = generateSummary(sector, subsector, productName, category, status);
  const duration = generateDuration(severity);
  const tags = generateTags(category, sector, productName);
  const impactScope = getRandomElement(['Department', 'Building', 'Floor', 'Campus-wide', 'Single Device', 'Zone']);

  return {
    public_id: publicId,
    title,
    sector_id: sectorId,
    subsector_id: subsectorId,
    tool,
    location,
    category,
    incident_date: incidentDate,
    tags,
    incident_overview: incidentOverview,
    investigation_breakdown: investigationBreakdown,
    root_cause: rootCause,
    resolution,
    verdict,
    summary,
    detected_by: detectedBy,
    severity,
    status,
    impact_scope: impactScope,
    duration_minutes: duration,
    validated_by: 'Wi-Fi Vigilante'
  };
}

async function main() {
  console.log('🚀 Starting case file generation...\n');

  // Priority products get more cases
  const CASES_BY_PRODUCT = {
    'EtherScope nXG': 50,
    'CyberScope': 35,
    'CyberScope Air': 35,
    'AirCheck G3': 30,
    'LinkRunner 10G': 20,
    'LinkRunner 2000': 10,
    'LinkRunner 3000': 10,
    'LinkRunner 4000': 20
  };

  const products = Object.keys(PRODUCTS);
  const sectors = Object.keys(SECTORS_SUBSECTORS);

  let totalGenerated = 0;
  let totalErrors = 0;

  for (const product of products) {
    const casesToGenerate = CASES_BY_PRODUCT[product] || 0;

    if (casesToGenerate === 0) {
      console.log(`\n⏭️  Skipping ${product} (not in priority list)`);
      continue;
    }

    console.log(`\n📦 Generating ${casesToGenerate} cases for ${product}...`);

    // Distribute cases across sectors
    const casesPerSector = Math.floor(casesToGenerate / sectors.length);
    const extraCases = casesToGenerate % sectors.length;

    for (let sectorIdx = 0; sectorIdx < sectors.length; sectorIdx++) {
      const sector = sectors[sectorIdx];
      const sectorCases = casesPerSector + (sectorIdx < extraCases ? 1 : 0);

      console.log(`  └─ ${sector}: generating ${sectorCases} cases...`);

      for (let i = 0; i < sectorCases; i++) {
        try {
          const caseFile = await generateCaseFile(product, sector);
          if (!caseFile) {
            console.error(`    ✗ Failed to generate case structure`);
            totalErrors++;
            continue;
          }

          const { error } = await supabase
            .from('case_files')
            .insert([caseFile]);

          if (error) {
            console.error(`    ✗ Error inserting case: ${error.message}`);
            totalErrors++;
          } else {
            totalGenerated++;
            if ((i + 1) % 10 === 0) {
              console.log(`    ✓ ${i + 1}/${casesToGenerate} completed`);
            }
          }
        } catch (err) {
          console.error(`    ✗ Unexpected error: ${err.message}`);
          totalErrors++;
        }
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Case generation complete!`);
  console.log(`📊 Total cases generated: ${totalGenerated}`);
  console.log(`❌ Total errors: ${totalErrors}`);
  console.log(`${'='.repeat(50)}\n`);

  // Verify distribution
  console.log('📈 Verifying case distribution...\n');

  const { data: counts, error: countError } = await supabase
    .from('case_files')
    .select('tool, sector_id, sectors(name)');

  if (!countError && counts) {
    // Count by product
    const productCounts: Record<string, number> = {};
    const sectorCounts: Record<string, number> = {};

    counts.forEach(c => {
      // Extract base product name
      const match = c.tool.match(/^([^(]+)/);
      const productName = match ? match[1].trim() : c.tool;
      productCounts[productName] = (productCounts[productName] || 0) + 1;

      const sectorName = (c.sectors as { name?: string })?.name || 'Unknown';
      sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
    });

    console.log('Cases by Product:');
    Object.entries(productCounts).sort((a, b) => b[1] - a[1]).forEach(([product, count]) => {
      console.log(`  ${product}: ${count}`);
    });

    console.log('\nCases by Sector:');
    Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).forEach(([sector, count]) => {
      console.log(`  ${sector}: ${count}`);
    });

    console.log(`\n📊 Total cases in database: ${counts.length}`);
  }
}

main().catch(console.error);
