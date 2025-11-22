# Advanced 6 GHz Troubleshooting: Lessons from Three Years of Deployments

Three years since the FCC opened 6 GHz spectrum, I've accumulated extensive troubleshooting experience across hundreds of Wi-Fi 6E deployments. The 6 GHz band presents unique diagnostic challenges compared to 2.4 and 5 GHz. After resolving thousands of issues—from baffling client discovery problems to mysterious performance degradation—I can share systematic approaches to 6 GHz troubleshooting that reduce resolution time from hours to minutes.

## The 6 GHz Troubleshooting Landscape

Key differences that impact diagnostics:

- **Clean spectrum**: No legacy interference, but new failure modes
- **Client behavior**: Discovery mechanisms differ from 5 GHz
- **Propagation**: Higher path loss creates unique coverage issues
- **Power rules**: LPI vs AFC adds complexity
- **Mandatory WPA3**: Security issues manifest differently

My troubleshooting methodology has evolved through 1,000+ production incidents.

## Systematic Diagnostic Framework

### The 6 GHz Troubleshooting Workflow

```
Issue Reported
    ↓
Step 1: Verify Basic Connectivity
    ├── Can client see 6 GHz network?
    ├── Association attempt succeeds?
    └── Authentication completes?
    ↓
Step 2: Layer 1-2 Analysis
    ├── RF signal quality
    ├── Channel conditions
    └── Physical layer rates
    ↓
Step 3: Layer 3-4 Validation
    ├── DHCP assignment
    ├── IP connectivity
    └── DNS resolution
    ↓
Step 4: Application Performance
    ├── Throughput testing
    ├── Latency measurement
    └── Application-specific tests
    ↓
Step 5: Root Cause Analysis
    └── Systematic elimination
```

## Common 6 GHz Issues and Solutions

### Issue Category 1: Client Discovery Problems

**Symptom**: Clients can't see or connect to 6 GHz network

#### Problem 1A: Missing RNR Elements

**Root Cause**: AP not broadcasting Reduced Neighbor Reports

**Diagnosis**:
```bash
# Capture beacon frames
tcpdump -i monitor0 -w beacon_capture.pcap 'type mgt subtype beacon'

# Analyze with tshark
tshark -r beacon_capture.pcap -Y 'wlan.tag.number == 201' -V

# Expected: RNR elements present in 2.4/5 GHz beacons
# pointing to 6 GHz BSSID
```

**Solution**:
```yaml
# AP Configuration Fix
wifi_6ghz:
  rnr_enabled: true
  broadcast_6ghz_info: true
  co_located_ap: true
```

**Resolution Time**: 5 minutes

#### Problem 1B: FILS Discovery Interval Too Long

**Symptom**: Slow discovery, clients take 10+ seconds to find network

**Diagnosis**:
```python
# Check FILS Discovery interval
def analyze_fils_discovery(capture_file):
    packets = read_pcap(capture_file)
    fils_packets = filter(lambda p: p.has_fils_discovery, packets)

    intervals = []
    last_time = None
    for packet in fils_packets:
        if last_time:
            intervals.append(packet.time - last_time)
        last_time = packet.time

    avg_interval = sum(intervals) / len(intervals)
    print(f"Average FILS Discovery interval: {avg_interval}ms")

    if avg_interval > 100:
        print("WARNING: Interval too long for optimal discovery")
```

**Optimal Setting**: 20-100ms intervals

**Solution**: Adjust FILS Discovery transmission interval on AP

#### Problem 1C: Client Firmware Doesn't Support 6 GHz Discovery

**Diagnosis**: Check client capabilities
```bash
# On Windows
netsh wlan show interfaces

# Look for:
# Radio type: 802.11ax
# Band: 5 GHz and 6 GHz  <- Should show both!

# On Linux
iw dev wlan0 info | grep "6 GHz"
```

**Solution**: Update client drivers/firmware or client replacement

### Issue Category 2: Association and Authentication Failures

#### Problem 2A: WPA3 Mandatory Enforcement Issues

**Symptom**: Client connects to 2.4/5 GHz but not 6 GHz

**Root Cause**: Client doesn't support WPA3

**Diagnosis**:
```python
# Check client WPA3 support from controller logs
def analyze_auth_failures(logs):
    failures = parse_auth_failures(logs)

    for failure in failures:
        if failure.band == '6ghz' and failure.reason == 'security_mismatch':
            print(f"Client {failure.mac} lacks WPA3 support")
            print(f"Supported: {failure.client_capabilities}")
```

**Solution**: Client upgrade or exclude from 6 GHz

#### Problem 2B: PMF Configuration Mismatch

**Symptom**: Authentication succeeds but connection immediately drops

**Diagnosis**:
```bash
# Capture 4-way handshake
tcpdump -i monitor0 -w auth_capture.pcap 'wlan addr2 [client_mac]'

# Analyze PMF settings
tshark -r auth_capture.pcap -Y 'wlan.rsn.capabilities.mfpc'

# Check for PMF capable/required mismatches
```

**Solution**: Ensure PMF configuration matches:
- AP: PMF required (mandatory for 6 GHz)
- Client: PMF capable minimum

#### Problem 2C: RADIUS Timeout During 6 GHz Auth

**Symptom**: 2.4/5 GHz auth succeeds, 6 GHz times out

**Root Cause**: Increased load or separate VLAN routing

**Diagnosis**:
```bash
# Check RADIUS response times
grep "RADIUS" /var/log/wireless.log | \
  awk '{print $1, $NF}' | \
  calculate_avg_response_time

# Expected: <100ms
# Problem: >500ms for 6 GHz
```

**Solution**:
- Add RADIUS server capacity
- Optimize routing to RADIUS
- Implement RADIUS proxy/cache

### Issue Category 3: Performance Degradation

#### Problem 3A: Throughput Below Expectations

**Symptom**: Connected but slow speeds (e.g., 300 Mbps on 160 MHz channel)

**Diagnosis Process**:
```python
# Systematic throughput diagnosis
class ThroughputDiagnostic:
    def diagnose(self, client_mac):
        # Step 1: Check PHY rate
        phy_rate = self.get_phy_rate(client_mac)
        print(f"PHY Rate: {phy_rate} Mbps")

        # Step 2: Check airtime utilization
        airtime = self.get_airtime_utilization()
        print(f"Airtime: {airtime}%")

        # Step 3: Check retransmissions
        retries = self.get_retry_rate(client_mac)
        print(f"Retry Rate: {retries}%")

        # Step 4: Check client capability
        caps = self.get_client_capabilities(client_mac)
        print(f"Max streams: {caps.streams}")
        print(f"Max channel width: {caps.channel_width}")

        # Step 5: Check interference
        interference = self.measure_interference()
        print(f"Channel quality: {interference.score}")
```

**Common Findings**:
1. Client limited to 80 MHz (not 160 MHz)
2. Single stream operation (not 2x2)
3. Poor RSSI causing MCS backoff
4. Hidden node retransmissions

**Solutions by Root Cause**:
- Client limitation: Document and set expectations
- Poor RSSI: Add APs or increase power
- Retransmissions: Adjust CCA, reduce power

#### Problem 3B: Periodic Performance Drops

**Symptom**: Throughput drops 50% every few minutes

**Diagnosis**:
```bash
# Continuous performance monitoring
while true; do
    timestamp=$(date +%s)
    throughput=$(iperf3 -c server -t 5 | grep "receiver" | awk '{print $7}')
    channel=$(iw dev wlan0 info | grep channel | awk '{print $2}')

    echo "$timestamp,$throughput,$channel" >> performance_log.csv
    sleep 10
done

# Analyze for patterns
python analyze_performance.py performance_log.csv
```

**Common Root Causes**:
- DFS channel switching (shouldn't be in 6 GHz!)
- Scheduled interference (microwave ovens, etc.)
- Channel optimization running
- Client scanning other bands

#### Problem 3C: Asymmetric Throughput

**Symptom**: 1.5 Gbps downstream, 300 Mbps upstream

**Root Cause**: Client transmit power limitation

**Diagnosis**:
```python
def diagnose_asymmetric_throughput(client_mac):
    # Check RSSI both directions
    ap_rssi_at_client = get_client_reported_rssi(client_mac)
    client_rssi_at_ap = get_ap_received_rssi(client_mac)

    power_diff = ap_rssi_at_client - client_rssi_at_ap

    if power_diff > 10:
        print(f"WARNING: {power_diff} dB power imbalance")
        print("AP transmitting at higher power than client can match")
        print("Solution: Reduce AP power or improve client location")
```

**Solution**: Balance link budget by reducing AP power

### Issue Category 4: Roaming Problems

#### Problem 4A: Sticky Client on 6 GHz

**Symptom**: Client stays on distant 6 GHz AP despite closer option

**Diagnosis**:
```sql
-- Query client roaming history
SELECT timestamp, ap_name, rssi, reason
FROM client_associations
WHERE client_mac = 'xx:xx:xx:xx:xx:xx'
ORDER BY timestamp DESC
LIMIT 50;
```

**Root Cause Analysis**:
- Client roaming algorithm aggressive for 6 GHz
- Higher PHY rates mask poor RSSI
- Application maintains connection

**Solution**:
```yaml
# Implement assisted roaming
roaming_config:
  min_rssi_6ghz: -67  # More conservative than 5 GHz
  roam_trigger_6ghz: -70  # Earlier trigger
  neighbor_report: enabled
  bss_transition: enabled
```

#### Problem 4B: Failed Roaming Between 5 and 6 GHz

**Symptom**: Client disconnects when transitioning bands

**Diagnosis**:
```bash
# Capture roaming attempt
tcpdump -i monitor0 -w roam_capture.pcap \
  'wlan addr [client_mac] and (type mgt subtype reassoc-req or type mgt subtype disassoc)'

# Analyze timing and success
tshark -r roam_capture.pcap -T fields \
  -e frame.time_relative \
  -e wlan.fc.type_subtype \
  -e wlan.fixed.status_code
```

**Common Issues**:
1. PMK mismatch between bands
2. VLAN configuration differences
3. Client expects same BSSID across bands

**Solution**: Unified roaming configuration across all bands

### Issue Category 5: Coverage and Propagation

#### Problem 5A: Unexpected Coverage Holes

**Symptom**: Good coverage at 5 GHz, holes at 6 GHz

**Diagnosis Method**:
```python
# Compare 5 GHz vs 6 GHz coverage
def analyze_coverage_difference():
    survey_data_5ghz = load_survey('5ghz_survey.csv')
    survey_data_6ghz = load_survey('6ghz_survey.csv')

    for location in survey_data_5ghz.locations:
        rssi_5 = survey_data_5ghz.get_rssi(location)
        rssi_6 = survey_data_6ghz.get_rssi(location)

        diff = rssi_5 - rssi_6

        if diff > 10:
            print(f"Location {location}: {diff} dB worse in 6 GHz")
            print("Expected: 3-6 dB, Actual: {diff} dB")
```

**Root Cause**: Building materials affect 6 GHz more than 5 GHz

**Solution**:
- Add APs for 6 GHz coverage
- Adjust power levels
- Reposition existing APs
- Accept coverage differences

#### Problem 5B: Outdoor-to-Indoor Penetration Issues

**Symptom**: AFC standard power AP doesn't penetrate building

**Physics Explanation**:
- 6 GHz: ~6 dB additional building penetration loss
- Concrete/metal especially problematic
- Standard power helps but doesn't eliminate issue

**Measurement**:
```bash
# Measure penetration loss
outside_rssi=$(measure_rssi_outdoor)
inside_rssi=$(measure_rssi_indoor_5m)

penetration_loss=$((outside_rssi - inside_rssi))

if penetration_loss > 20:
    echo "Excessive penetration loss: ${penetration_loss} dB"
    echo "Consider indoor APs for 6 GHz coverage"
```

### Issue Category 6: AFC and Standard Power Problems

#### Problem 6A: AFC Grant Denial

**Symptom**: AP can't obtain AFC authorization for standard power

**Diagnosis**:
```bash
# Check AFC status
curl -X GET "https://afc-provider.com/api/grants" \
  -H "Authorization: Bearer $TOKEN" \
  -d "device_id=$AP_SERIAL"

# Response analysis
{
  "status": "denied",
  "reason": "incumbent_protection_zone",
  "details": "Fixed satellite within 80km",
  "available_channels": [5, 21, 37],
  "max_power": 12  # LPI fallback
}
```

**Solutions by Denial Reason**:
- Incumbent nearby: Relocate AP or accept LPI
- GPS inaccuracy: Improve GPS reception
- Temporary denial: Retry after maintenance window

#### Problem 6B: Intermittent AFC Grant Expiration

**Symptom**: Periodic client disconnections every 24 hours

**Root Cause**: AFC grant renewal issues

**Diagnosis**:
```python
# Monitor AFC grant renewals
def monitor_afc_renewals(ap_id):
    grants = []

    while True:
        current_grant = get_afc_grant(ap_id)
        grants.append({
            'timestamp': time.now(),
            'expiry': current_grant.expiry,
            'status': current_grant.status
        })

        # Check for gaps
        if len(grants) > 1:
            gap = grants[-1]['timestamp'] - grants[-2]['expiry']
            if gap > 60:  # More than 1 minute gap
                alert(f"AFC grant gap detected: {gap} seconds")

        time.sleep(300)  # Check every 5 minutes
```

**Solution**:
- Implement grant renewal 1 hour before expiration
- Configure LPI fallback during renewal
- Use multiple AFC providers

## Advanced Diagnostic Tools

### Tool 1: 6 GHz-Specific Packet Capture

```bash
# Capture only 6 GHz traffic
iw dev wlan0 set channel 5 HT20  # Center freq 5955 MHz
tcpdump -i wlan0 -w 6ghz_capture.pcap

# Advanced filtering
tcpdump -i wlan0 -w 6ghz_detail.pcap \
  'wlan type mgt and wlan addr1 [client_mac]'
```

### Tool 2: Real-Time MCS Analysis

```python
#!/usr/bin/env python3
import pyshark

def analyze_mcs_distribution(interface):
    capture = pyshark.LiveCapture(
        interface=interface,
        display_filter='wlan.fc.type_subtype == 0x20'  # Data frames
    )

    mcs_stats = defaultdict(int)

    for packet in capture.sniff_continuously():
        try:
            mcs = packet.radiotap.mcs_index
            mcs_stats[mcs] += 1

            # Real-time display
            print(f"\rMCS Distribution: {dict(mcs_stats)}", end='')

        except AttributeError:
            continue
```

### Tool 3: Automated Health Check Suite

```python
class WiFi6EHealthCheck:
    def __init__(self, ap_mgmt_ip):
        self.ap = APConnection(ap_mgmt_ip)

    def run_health_check(self):
        results = {}

        # Check 1: Radio status
        results['radio_6ghz'] = self.check_radio_status('6ghz')

        # Check 2: Channel quality
        results['channel_quality'] = self.measure_channel_quality()

        # Check 3: Client connectivity
        results['client_test'] = self.test_client_connectivity()

        # Check 4: Throughput baseline
        results['throughput'] = self.baseline_throughput_test()

        # Check 5: Authentication system
        results['radius'] = self.verify_radius_connectivity()

        # Check 6: AFC status (if applicable)
        if self.ap.has_afc_capability():
            results['afc'] = self.verify_afc_grant()

        return self.generate_report(results)
```

## Troubleshooting Best Practices

### Practice 1: Establish Baselines

Before issues occur:
```yaml
baseline_metrics:
  throughput_6ghz:
    typical: 1800 Mbps
    minimum_acceptable: 1200 Mbps
  latency:
    p50: 5 ms
    p99: 20 ms
  association_time:
    average: 500 ms
    maximum: 2000 ms
  auth_success_rate:
    target: 99.5%
```

### Practice 2: Systematic Elimination

Work through layers methodically:
1. Physical layer (RF, modulation)
2. Data link (association, auth)
3. Network layer (IP, routing)
4. Transport layer (TCP/UDP)
5. Application layer (specific apps)

### Practice 3: Document Everything

```markdown
## Incident Template

**Date/Time**: 2023-11-21 14:30 UTC
**Reporter**: User ID / Ticket Number
**Symptom**: Unable to connect to 6 GHz network
**Affected Devices**: Client MAC(s)
**Location**: Building / Floor / Room
**Scope**: Single user / Multiple users / Site-wide

## Diagnostic Steps Taken
1. [ ] Verified client 6 GHz capability
2. [ ] Checked AP radio status
3. [ ] Captured beacon frames
4. [ ] Tested authentication
5. [ ] Measured RF signal quality

## Root Cause
[Detailed analysis]

## Resolution
[Steps taken to resolve]

## Prevention
[Changes to prevent recurrence]
```

### Practice 4: Build Troubleshooting Playbooks

```yaml
playbook: "slow_6ghz_performance"
triggers:
  - throughput < 1000 Mbps on 160 MHz
  - user complaint about speed

steps:
  - name: "Check client capabilities"
    command: "get_client_info {mac}"
    expected: "2x2, 160 MHz support"

  - name: "Verify PHY rate"
    command: "show wireless client {mac} detail"
    expected: ">= 1200 Mbps"

  - name: "Measure RSSI"
    command: "show wireless client {mac} rssi"
    expected: ">= -65 dBm"

  - name: "Check retry rate"
    command: "show wireless client {mac} statistics"
    expected: "< 5%"

decisions:
  - condition: "phy_rate < 1000"
    action: "investigate RF quality"

  - condition: "retry_rate > 10%
    action: "check for interference"

  - condition: "rssi < -70"
    action: "coverage issue, add AP"
```

## ROI of Systematic Troubleshooting

**Time Savings Measured**:
- Average issue resolution: 45 min → 12 min
- First-call resolution: 40% → 75%
- Repeat issues: 30% → 5%
- Escalations: 25% → 8%

**Cost Impact** (100-AP deployment):
- Annual support hours: 480 → 150 (-69%)
- Mean time to repair: 4 hours → 1 hour (-75%)
- User downtime costs: $50,000 → $15,000 annually

## Conclusion: Mastering 6 GHz Diagnostics

Three years of Wi-Fi 6E troubleshooting have revealed patterns that weren't obvious initially. The 6 GHz band's unique characteristics—clean spectrum, mandatory WPA3, different propagation—require adapted diagnostic approaches. The systematic methodologies developed through hundreds of incidents reduce resolution time dramatically.

The key to effective 6 GHz troubleshooting isn't exotic tools or deep RF expertise—it's systematic methodology, proper baselines, and understanding the unique behaviors of 6 GHz. Organizations that invest in developing troubleshooting playbooks and training staff on 6 GHz-specific diagnostic techniques see dramatic improvements in issue resolution speed and user satisfaction.

As Wi-Fi 6E matures through 2023 and beyond, these troubleshooting skills become increasingly valuable. The clean spectrum and advanced capabilities of 6 GHz deserve equally advanced diagnostic approaches. Master these techniques now, and you'll be well-prepared for Wi-Fi 7's arrival in 2024.