# Wi-Fi Vigilante Case Generation Plan

## Project Scope
Generate 500-1000 realistic case studies following the Wi-Fi Vigilante style and technical accuracy standards.

## Requirements Summary
- **Products**: 8 total (40 cases each minimum = 320 cases)
- **Sectors**: 5 total (100-200 cases each = 500-1000 cases)
- **Date Range**: 2020-2025 (respecting product launch dates)
- **Days**: Primarily Monday-Friday, occasional Saturday/Sunday emergencies
- **Quality**: Match existing case quality, technical accuracy, Wi-Fi Vigilante tone

---

## Product Launch Dates & Availability

| Product | Launch Date | Available From | Cases Needed |
|---------|-------------|----------------|--------------|
| EtherScope nXG | 2017 | 2020-2025 | 40 |
| LinkRunner 10G | 2019 | 2020-2025 | 40 |
| AirCheck G3 | 2020 | 2021-2025 | 40 |
| LinkRunner 2000 | 2018 | 2020-2025 | 40 |
| LinkRunner 3000 | 2020 | 2021-2025 | 40 |
| LinkRunner 4000 | 2021 | 2022-2025 | 40 |
| CyberScope | 2022 | 2023-2025 | 40 |
| CyberScope Air | 2023 | 2024-2025 | 40 |

---

## Sector Distribution

| Sector | Subsectors | Target Cases | Products to Feature |
|--------|------------|--------------|---------------------|
| Healthcare | Hospitals, Clinics, Laboratories, Pharmacies | 100-200 | All products (medical IoT, patient monitoring) |
| Manufacturing | Automotive, Electronics, Food & Beverage, Warehousing | 100-200 | EtherScope, LinkRunner series (IIoT, automation) |
| Government | Municipal, Defense, Emergency, Administration | 100-200 | CyberScope series, EtherScope (security-focused) |
| Education | Universities, K-12, Libraries, Training Centers | 100-200 | AirCheck, LinkRunner series (campus networks) |
| Retail | Stores, Warehouses, Supermarkets, Restaurants | 100-200 | All products (POS, inventory, guest Wi-Fi) |

---

## Case Template Structure

Each case must include:

```sql
INSERT INTO case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) VALUES (
    [id],
    '[UUID]',
    '[Narrative Title]',
    [1-5],
    [1-20],
    '[Product + Apps]',
    '[Specific Location]',
    '[Category]',
    '[YYYY-MM-DD]',
    '#WiFiVigilante,#[Product],#[Sector],#Cybersecurity',
    '[2-3 sentence narrative hook]',
    '[Detailed technical investigation using product features]',
    '[Root cause explanation]',
    '[Resolution steps taken]',
    '[Outcome]',
    '[Summary]',
    '[Person Name + Role]',
    '[Low|Medium|High|Critical]',
    'Resolved',
    '[Scope description]',
    [60-600],
    'Wi-Fi Vigilante'
);
```

---

## Generation Strategy

### Phase 1: Template & Tooling (Complete First)
1. Create case generation Python script with:
   - Product capabilities database
   - Realistic scenario templates per sector
   - Name generator for detected_by field
   - Date generator (weighted toward weekdays)
   - UUID generator
   - SQL formatter

### Phase 2: Batch Generation
Generate in batches by product-sector combination:

**Batch Size**: 20 cases per batch
**Validation**: Manual review of first 5 cases from each batch

**Example Batch Plan**:
- Batch 1: EtherScope nXG + Healthcare (20 cases)
- Batch 2: EtherScope nXG + Manufacturing (10 cases)
- Batch 3: EtherScope nXG + Government (10 cases)
- ... continue for all products

### Phase 3: Quality Assurance
- Review technical accuracy (tools, features, protocols)
- Check narrative consistency (Wi-Fi Vigilante tone)
- Validate dates against product availability
- Ensure sector distribution targets met

### Phase 4: Database Import
1. Combine all batches into single SQL file
2. Test import on development database
3. Verify data integrity
4. Import to production

---

## Product Capabilities Reference

### EtherScope nXG
**Apps**: Wi-Fi, AirMapper, Spectrum, Capture, AutoTest, Discovery, Path Analysis, LANBERT, NetTag
**Use Cases**: Wi-Fi interference, spectrum analysis, packet capture, network discovery, cable testing, VLAN troubleshooting

### LinkRunner 10G
**Features**: 10G Ethernet testing, PoE++, TDR cable testing, VLAN discovery, port identification
**Use Cases**: High-speed link testing, PoE validation, cable certification, switch port identification

### AirCheck G3
**Features**: Wi-Fi scanning, channel analysis, rogue AP detection, device discovery
**Use Cases**: Wi-Fi site surveys, interference hunting, security audits, client troubleshooting

### LinkRunner 2000/3000/4000
**Features**: Cable testing (varies by model), PoE testing, switch port ID, network connectivity validation
**Use Cases**: Cable certification, PoE troubleshooting, network validation, pre-deployment testing

### CyberScope
**Features**: Network security scanning, vulnerability assessment, compliance checking
**Use Cases**: Security audits, rogue device detection, compliance validation, threat hunting

### CyberScope Air
**Features**: Wireless security scanning, rogue AP detection, encryption validation
**Use Cases**: Wireless security audits, guest network validation, rogue AP hunting, 802.11 security assessment

---

## Case Naming Convention

Follow existing pattern: "[Narrative Name] of [Location]"

**Examples**:
- "The Phantom Signal in Tower West"
- "The Data Drought of Assembly Line 4"
- "The Rogue SSID at City Hall"
- "The Cable Curse in Lecture Hall C"
- "The PoE Failure at Register 12"

---

## Detected By - Name Examples

**Healthcare**: Dr. Sarah Martinez, Nurse David Chen, Lab Tech Maria Rodriguez, Pharmacist James Wilson
**Manufacturing**: Plant Manager John Stevens, QA Lead Rebecca Torres, Automation Tech Miguel Santos
**Government**: IT Director Lisa Johnson, Security Officer Mark Thompson, Network Admin Ryan Cooper
**Education**: Professor Emily Brown, IT Manager Alex Patel, Librarian Jessica Lee
**Retail**: Store Manager Kevin White, POS Tech Amanda Garcia, Warehouse Lead Carlos Rivera

---

## Next Steps

1. Would you like me to create the Python generation script?
2. Should we start with one product (e.g., EtherScope nXG) as a pilot?
3. Do you want to review a sample batch before full generation?

**Estimated Time**:
- Script creation: 2-3 hours
- First batch (20 cases): 1 hour
- Full generation (500 cases): 8-12 hours
- Review & QA: 4-6 hours
- **Total: 15-23 hours**

This is best done as a separate project phase after UI cleanup is complete.
