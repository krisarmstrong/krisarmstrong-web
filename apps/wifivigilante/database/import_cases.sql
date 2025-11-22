-- Wi-Fi Vigilante Case Files Import
-- Run this AFTER CLEAN_START.sql

-- Case 1: Shadows Over Serenity Wing
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    1,
    'b5a2c895-27ed-4ed4-abea-d41fc3bca53a',
    'Shadows Over Serenity Wing',
    1,
    1,
    'EtherScope nXG (Wi-Fi App, AirMapper App)',
    'Serenity Wing, St. Lumina Medical Center',
    'Wi-Fi Interference',
    '2025-04-15',
    '#WiFiVigilante,#EtherScopeNXG,#AirMapper,#HospitalTech,#Cybersecurity',
    'Nurses in Serenity Wing reported Wi-Fi dropouts disrupting cardiac monitors. A clinician muttered, "The signal’s fading like a ghost." Connectivity faltered on the 5GHz band, stalling real-time patient data feeds during peak hours.',
    'Using the Wi-Fi App on EtherScope nXG, I detected elevated noise levels on 5GHz channels 36–48. AirMapper App generated detailed heatmaps, revealing signal degradation near the wing’s imaging suite. Cross-referencing with Spectrum App, I identified non-802.11 interference spikes correlating with equipment activation times.',
    'A malfunctioning MRI machine’s shielding had degraded, leaking RF interference into the 5GHz Wi-Fi spectrum, disrupting access points.',
    'Reconfigured APs to use unaffected channels (149–161) based on Wi-Fi App data. Coordinated with maintenance to repair the MRI’s shielding.',
    'Network stability restored.',
    'AirMapper and Wi-Fi Apps pinpointed MRI-induced interference. Channel reassignment and equipment repair ensured uninterrupted patient monitoring.',
    'Dr. Elena Voss',
    'Critical',
    'Resolved',
    'Serenity Wing telemetry',
    240,
    'Wi-Fi Vigilante'
);

-- Case 2: The IP Thief of Horizon Admin
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    2,
    '1cfe4e83-4f9e-43ce-85c8-eb744f8f6e0e',
    'The IP Thief of Horizon Admin',
    1,
    1,
    'EtherScope nXG (AutoTest App, Discovery App)',
    'Horizon Administrative Hub, Crescent Vale Hospital',
    'DHCP',
    '2025-05-01',
    '#WiFiVigilante,#EtherScopeNXG,#AutoTest,#HospitalTech,#Cybersecurity',
    'Admin staff in Horizon Hub couldn’t access electronic health records, with devices failing to obtain IP addresses. A sysadmin grumbled, "Something’s stealing our IPs." The issue paralyzed documentation during a busy shift.',
    'AutoTest App revealed DHCP response failures, with devices receiving invalid IP offers. Discovery App mapped the network, identifying an unauthorized DHCP server broadcasting from a device in the staff lounge. Packet analysis showed the rogue server assigning IPs outside the hospital’s subnet, causing conflicts.',
    'A misconfigured smart coffee maker, recently installed, was running an unauthorized DHCP service, clashing with the hospital’s primary DHCP server.',
    'Isolated the coffee maker using Discovery App’s topology view. Reconfigured the hospital’s DHCP server to enforce stricter lease policies and blocked unauthorized servers.',
    'Network access restored.',
    'AutoTest and Discovery Apps exposed a rogue DHCP server in a smart device. Isolation and server hardening resolved the issue, restoring EHR access.',
    'Javier Torres',
    'Medium',
    'Resolved',
    'Horizon Hub VLAN',
    150,
    'Wi-Fi Vigilante'
);

-- Case 3: The Wired Wraith of Eclipse ICU
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    3,
    'a68a3eea-13a4-4322-84c6-0c2653f2c568',
    'The Wired Wraith of Eclipse ICU',
    1,
    1,
    'EtherScope nXG (LANBERT App)',
    'Eclipse Intensive Care Unit, Nova General Hospital',
    'Wired Connectivity',
    '2025-05-10',
    '#WiFiVigilante,#EtherScopeNXG,#LANBERT,#HospitalTech,#Cybersecurity',
    'ICU monitors in Eclipse Unit lagged, dropping critical alerts. A nurse snapped, "The cables are cursed." Ethernet links showed intermittent packet loss, risking delayed responses to patient emergencies.',
    'LANBERT App tested the Cat6 cabling infrastructure, revealing intermittent signal degradation on a 2.5Gbps link to the ICU’s central switch. Bit-error rate tests showed errors spiking during high traffic. Physical inspection of the wiring closet uncovered a partially unplugged cable with frayed shielding.',
    'A damaged Cat6 cable, loosened during recent maintenance, caused intermittent packet loss under heavy load, disrupting monitor connectivity.',
    'Replaced the faulty cable and retested with LANBERT App, confirming stable 2.5Gbps performance. Secured wiring closet to prevent future tampering.',
    'Wired connectivity restored.',
    'LANBERT App identified a damaged cable causing packet loss. Replacement and securing infrastructure ensured reliable ICU monitoring.',
    'Dr. Mei Chen',
    'Critical',
    'Resolved',
    'Eclipse ICU monitors',
    300,
    'Wi-Fi Vigilante'
);

-- Case 4: The Rogue Breach in Aurora Clinic
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    4,
    '9b8f7b96-80ec-472a-aa6c-38130b1cabe4',
    'The Rogue Breach in Aurora Clinic',
    1,
    1,
    'EtherScope nXG (Capture App, Spectrum App)',
    'Aurora Outpatient Clinic, Zenith Medical Complex',
    'Cybersecurity',
    '2025-05-20',
    '#WiFiVigilante,#EtherScopeNXG,#CaptureApp,#HospitalTech,#Cybersecurity',
    'An unknown SSID appeared in Aurora Clinic, raising alarms of a security breach. A guard hissed, "Someone’s hijacking our airwaves." Unauthorized Wi-Fi traffic threatened patient data confidentiality.',
    'Spectrum App with NXT-2000 adapter detected a rogue AP on the 2.4GHz band, broadcasting a spoofed SSID mimicking the hospital’s. Capture App recorded packets, revealing connection attempts to a malicious server. Triangulation with Spectrum App localized the AP to a public waiting area.',
    'A rogue access point, hidden in a waiting room power strip, was deployed to execute a man-in-the-middle attack, capturing credentials from unsuspecting users.',
    'Removed the rogue AP using Spectrum App’s localization data. Upgraded to WPA3 encryption and implemented MAC filtering to prevent future attacks.',
    'Security threat neutralized.',
    'Spectrum and Capture Apps uncovered a rogue AP orchestrating a credential theft attempt. Removal and enhanced security measures safeguarded patient data.',
    'Liam O’Connor',
    'Critical',
    'Resolved',
    'Aurora Clinic Wi-Fi',
    200,
    'Wi-Fi Vigilante'
);

-- Case 5: The Data Choke in Radiant Imaging
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    5,
    '15e1aa29-8f43-44fa-9029-af2a9158b19b',
    'The Data Choke in Radiant Imaging',
    1,
    1,
    'EtherScope nXG (Path Analysis App, AutoTest App)',
    'Radiant Imaging Department, Solace Health Center',
    'Network Performance',
    '2025-05-28',
    '#WiFiVigilante,#EtherScopeNXG,#PathAnalysis,#HospitalTech,#Cybersecurity',
    'Radiology imaging uploads in Radiant Department slowed to a crawl, delaying diagnoses. A tech cursed, "The network’s suffocating." High latency and packet loss plagued the wired path to the imaging server.',
    'Path Analysis App traced the network path from the radiology workstation to the server, identifying a switch port with 80ms latency spikes. AutoTest App confirmed throughput drops to 10Mbps on a 1Gbps link. Switch logs revealed QoS misconfiguration prioritizing non-critical traffic.',
    'A switch port’s QoS settings were misconfigured, prioritizing guest Wi-Fi over critical imaging traffic, causing a bottleneck during peak usage.',
    'Reconfigured QoS to prioritize imaging traffic and retested with Path Analysis App, achieving sub-10ms latency and full 1Gbps throughput.',
    'Network performance optimized.',
    'Path Analysis and AutoTest Apps exposed a QoS misconfiguration throttling imaging traffic. Reconfiguration restored timely diagnostic workflows.',
    'Zara Iqbal',
    'High',
    'Resolved',
    'Radiant Imaging servers',
    270,
    'Wi-Fi Vigilante'
);

-- Case 6: The Silent Smartboards of Willow Creek
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    26,
    '707565af-8ce1-4f74-891d-df5b4b1f6e3a',
    'The Silent Smartboards of Willow Creek',
    4,
    14,
    'EtherScope nXG (Wi-Fi App, AirMapper App)',
    'Willow Creek Middle School, Classroom B-12',
    'Wi-Fi Interference',
    '2025-05-01',
    '#WiFiVigilante,#EtherScopeNXG,#AirMapper,#K12Tech,#Cybersecurity',
    'Teachers reported smartboards freezing during lessons, disrupting student engagement. A frustrated educator snapped, "These boards are mute when we need them most." Wi-Fi on the 2.4GHz band was unstable, affecting classroom interactivity.',
    'Using the Wi-Fi App on EtherScope nXG, I scanned the 2.4GHz band, detecting high channel utilization on channels 1, 6, and 11. AirMapper App’s heatmaps showed overlapping signals from adjacent classrooms. Analysis confirmed co-channel interference from nearby access points.',
    'Overlapping Wi-Fi channels from neighboring classroom APs caused interference, degrading smartboard performance.',
    'Reconfigured APs to non-overlapping channels (1, 6, 11) using Wi-Fi App recommendations. Verified signal strength with AirMapper to ensure coverage.',
    'Classroom connectivity restored.',
    'Wi-Fi App and AirMapper resolved channel overlap, enabling seamless smartboard operation.',
    'Ms. Clara Nguyen',
    'High',
    'Resolved',
    'Classroom B-12 smartboards',
    180,
    'Wi-Fi Vigilante'
);

-- Case 7: The Ghostly Guest Network of Pineview Elementary
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    27,
    '13de91ea-4d85-43e6-ac7e-28d6721969cb',
    'The Ghostly Guest Network of Pineview Elementary',
    4,
    14,
    'EtherScope nXG (Spectrum App, Capture App)',
    'Pineview Elementary School, Cafeteria',
    'Cybersecurity',
    '2025-05-05',
    '#WiFiVigilante,#EtherScopeNXG,#SpectrumApp,#K12Tech,#Cybersecurity',
    'Students accessed an unauthorized guest Wi-Fi network, bypassing school content filters. A librarian muttered, "Kids are on some rogue network!" The breach risked exposure to unfiltered content during recess.',
    'Spectrum App detected a non-802.11 signal broadcasting a suspicious SSID, "Pineview_Guest," on the 2.4GHz band. Capture App recorded packets, revealing the rogue AP’s MAC address and connection attempts to an external server. Triangulation localized the AP to the cafeteria.',
    'A rogue access point, hidden in a cafeteria vending machine, broadcast a fake guest SSID to bypass school security.',
    'Removed the rogue AP using Spectrum App’s localization. Implemented MAC address filtering and updated SSID authentication to WPA3.',
    'Security breach neutralized.',
    'Spectrum and Capture Apps identified and eliminated a rogue AP, securing the school’s Wi-Fi.',
    'Mr. Ethan Patel',
    'Critical',
    'Resolved',
    'School-wide Wi-Fi',
    150,
    'Wi-Fi Vigilante'
);

-- Case 8: The Stalled Tablets of Oakridge High
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    28,
    'af082a8a-815e-44a8-b4b6-a881e7f45547',
    'The Stalled Tablets of Oakridge High',
    4,
    14,
    'EtherScope nXG (AutoTest App, Discovery App)',
    'Oakridge High School, Testing Center',
    'DHCP',
    '2025-05-10',
    '#WiFiVigilante,#EtherScopeNXG,#AutoTest,#K12Tech,#Cybersecurity',
    'Tablets used for state testing failed to connect, showing "No IP address" errors. A proctor groaned, "We’re losing time!" The issue threatened to delay critical assessments.',
    'AutoTest App identified DHCP request failures, with tablets receiving no IP offers. Discovery App mapped the network, revealing a DHCP server overload. Logs showed the DHCP scope had run out of available addresses due to excessive device connections.',
    'A misconfigured DHCP scope with a limited address pool was exhausted by concurrent tablet connections.',
    'Expanded the DHCP scope using Discovery App’s network map. Configured lease timeouts to recycle IPs faster, verified with AutoTest.',
    'Testing resumed.',
    'AutoTest and Discovery Apps resolved DHCP exhaustion, ensuring tablet connectivity for exams.',
    'Mrs. Olivia Grant',
    'Critical',
    'Resolved',
    'Testing Center tablets',
    200,
    'Wi-Fi Vigilante'
);

-- Case 9: The Wired Whispers of Maple Grove
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    29,
    '095f0a69-af84-46c2-a767-4c15e80bb4c4',
    'The Wired Whispers of Maple Grove',
    4,
    14,
    'EtherScope nXG (LANBERT App)',
    'Maple Grove Junior High, Computer Lab',
    'Wired Connectivity',
    '2025-05-15',
    '#WiFiVigilante,#EtherScopeNXG,#LANBERT,#K12Tech,#Cybersecurity',
    'Wired classroom computers lagged during online assessments, frustrating students. A teacher sighed, "The network’s whispering, not working." Ethernet connections showed intermittent delays.',
    'LANBERT App tested Cat5e cabling, detecting high packet loss on a 1Gbps link to the lab’s switch. Bit-error rate tests pinpointed a faulty port. Inspection revealed a corroded switch port connector.',
    'A faulty Ethernet switch port caused packet loss, slowing computer lab connectivity.',
    'Replaced the switch port and retested with LANBERT App, confirming stable 1Gbps performance. Secured cabling to prevent future issues.',
    'Wired performance restored.',
    'LANBERT App identified a faulty switch port, restoring lab connectivity.',
    'Mr. Diego Morales',
    'High',
    'Resolved',
    'Computer Lab Ethernet',
    240,
    'Wi-Fi Vigilante'
);

-- Case 10: The Bandwidth Bottleneck of Cedar Lane
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    30,
    'be91c114-e669-48a0-b0c1-3947c3454b28',
    'The Bandwidth Bottleneck of Cedar Lane',
    4,
    14,
    'EtherScope nXG (Path Analysis App, AutoTest App)',
    'Cedar Lane Elementary, Digital Classroom',
    'Network Performance',
    '2025-05-20',
    '#WiFiVigilante,#EtherScopeNXG,#PathAnalysis,#K12Tech,#Cybersecurity',
    'Video lessons in a digital classroom buffered endlessly, halting instruction. A student complained, "The videos are stuck!" High latency disrupted e-learning.',
    'Path Analysis App traced the path from classroom devices to the server, identifying a 100ms latency spike at a core switch. AutoTest App confirmed throughput drops to 5Mbps on a 100Mbps link. Switch logs revealed a QoS policy prioritizing non-educational traffic.',
    'A misconfigured QoS policy throttled educational traffic, prioritizing guest Wi-Fi.',
    'Reconfigured QoS to prioritize classroom traffic, verified with Path Analysis App for sub-10ms latency and 100Mbps throughput.',
    'E-learning optimized.',
    'Path Analysis and AutoTest Apps resolved a QoS bottleneck, ensuring smooth video lessons.',
    'Ms. Aisha Khan',
    'Medium',
    'Resolved',
    'Digital Classroom servers',
    180,
    'Wi-Fi Vigilante'
);

-- Case 11: The Vanishing VLANs of Sterling Hall
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    31,
    '27aae6da-4285-43c7-8926-965dd770ae3a',
    'The Vanishing VLANs of Sterling Hall',
    4,
    13,
    'EtherScope nXG (NetTag App, AutoTest App)',
    'Sterling Hall Dormitory, Westview University',
    'Network Configuration',
    '2025-05-02',
    '#WiFiVigilante,#EtherScopeNXG,#NetTag,#UniversityTech,#Cybersecurity',
    'Dormitory Wi-Fi dropped, isolating students from e-learning platforms. A resident advisor grumbled, "The network’s vanished!" Devices failed to connect to the student VLAN.',
    'NetTag App scanned VLAN configurations, revealing missing VLAN assignments on the dormitory switch. AutoTest App confirmed no DHCP responses on the student subnet. Logs showed a recent switch update had erased VLAN settings.',
    'A switch misconfiguration during an update deleted student VLAN assignments.',
    'Restored VLAN configurations using NetTag App’s topology data. Validated connectivity with AutoTest App.',
    'Dormitory Wi-Fi restored.',
    'NetTag and AutoTest Apps fixed VLAN misconfigurations, reconnecting students.',
    'Sophia Lee',
    'High',
    'Resolved',
    'Sterling Hall Wi-Fi',
    210,
    'Wi-Fi Vigilante'
);

-- Case 12: The Rogue Streamer of Campus Commons
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    32,
    '2f90ad04-aba1-452c-b855-5eb42b33eb5e',
    'The Rogue Streamer of Campus Commons',
    4,
    13,
    'EtherScope nXG (Discovery App, Capture App)',
    'Campus Commons Lecture Hall, Crestwood University',
    'Bandwidth Abuse',
    '2025-05-08',
    '#WiFiVigilante,#EtherScopeNXG,#DiscoveryApp,#UniversityTech,#Cybersecurity',
    'Lecture hall Wi-Fi slowed, disrupting hybrid classes. A professor snapped, "The network’s crawling!" Students couldn’t stream live lectures.',
    'Discovery App mapped the network, identifying a high-bandwidth device in the lecture hall. Capture App analyzed traffic, revealing a student’s unauthorized streaming server consuming 50Mbps. The device was traced to a lecture hall outlet.',
    'A student’s unauthorized streaming server hogged bandwidth, slowing Wi-Fi.',
    'Blocked the device using Discovery App’s MAC address. Implemented bandwidth caps for non-academic devices.',
    'Lecture hall Wi-Fi stabilized.',
    'Discovery and Capture Apps stopped a rogue streaming server, restoring lecture connectivity.',
    'Dr. Marcus Evans',
    'Medium',
    'Resolved',
    'Lecture Hall Wi-Fi',
    160,
    'Wi-Fi Vigilante'
);

-- Case 13: The Echoes of Emerson Library
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    33,
    '4e3f8b1a-8a00-4352-b135-8811d651a1a4',
    'The Echoes of Emerson Library',
    4,
    13,
    'EtherScope nXG (Spectrum App, AirMapper App)',
    'Emerson Library, Riverstone University',
    'Wi-Fi Interference',
    '2025-05-12',
    '#WiFiVigilante,#EtherScopeNXG,#SpectrumApp,#UniversityTech,#Cybersecurity',
    'Wi-Fi in the library fluctuated, hindering research access. A student whispered, "The signal’s fading in and out." Connectivity on the 5GHz band was inconsistent.',
    'Spectrum App detected non-Wi-Fi interference on 5GHz channels 36–48. AirMapper App’s heatmaps showed signal drops near a study lounge. Interference spikes correlated with a nearby microwave oven’s operation.',
    'A microwave oven’s RF leakage interfered with the 5GHz Wi-Fi spectrum.',
    'Relocated the microwave and reconfigured APs to unaffected channels (149–161) using Spectrum App data.',
    'Library Wi-Fi stabilized.',
    'Spectrum and AirMapper Apps eliminated microwave interference, ensuring reliable research access.',
    'Lila Carter',
    'Medium',
    'Resolved',
    'Emerson Library Wi-Fi',
    190,
    'Wi-Fi Vigilante'
);

-- Case 14: The Frozen Portals of Tech Tower
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    34,
    'a1e1ccc5-28ae-492d-abba-e8ba58b8a7d7',
    'The Frozen Portals of Tech Tower',
    4,
    13,
    'EtherScope nXG (Path Analysis App, AutoTest App)',
    'Tech Tower Computer Lab, Bayside University',
    'Wired Connectivity',
    '2025-05-18',
    '#WiFiVigilante,#EtherScopeNXG,#PathAnalysis,#UniversityTech,#Cybersecurity',
    'Wired lab computers failed to access cloud-based IDEs, stalling coding projects. A student cursed, "The portals are frozen!" Outbound traffic was blocked.',
    'Path Analysis App traced the path to the cloud server, identifying a firewall blocking port 443. AutoTest App confirmed no connectivity beyond the campus gateway. Firewall logs revealed a new rule mistakenly blocking HTTPS traffic.',
    'A misconfigured firewall rule blocked outbound HTTPS traffic.',
    'Corrected the firewall rule and retested with Path Analysis App, confirming full connectivity.',
    'Lab access restored.',
    'Path Analysis and AutoTest Apps fixed a firewall misconfiguration, enabling cloud access.',
    'Prof. Nadia Ali',
    'High',
    'Resolved',
    'Tech Tower Lab',
    220,
    'Wi-Fi Vigilante'
);

-- Case 15: The Shadow SSID of Union Plaza
INSERT INTO public.case_files (
    id, public_id, title, sector_id, subsector_id, tool, location, category,
    incident_date, tags, incident_overview, investigation_breakdown, root_cause,
    resolution, verdict, summary, detected_by, severity, status, impact_scope,
    duration_minutes, validated_by
) OVERRIDING SYSTEM VALUE VALUES (
    35,
    '5c158fdb-ec6e-4dee-8846-ee40cf5d437d',
    'The Shadow SSID of Union Plaza',
    4,
    13,
    'EtherScope nXG (Spectrum App, Capture App)',
    'Union Plaza, Hillcrest University',
    'Cybersecurity',
    '2025-05-25',
    '#WiFiVigilante,#EtherScopeNXG,#SpectrumApp,#UniversityTech,#Cybersecurity',
    'A fake university SSID appeared in Union Plaza, tricking students into sharing credentials. A security officer hissed, "We’ve got a shadow network!" The breach risked data theft.',
    'Spectrum App detected a rogue AP broadcasting "Hillcrest_FreeWiFi" on the 2.4GHz band. Capture App recorded packets, showing phishing attempts to a malicious server. Triangulation localized the AP to a plaza bench.',
    'A rogue access point, hidden in a public charger, conducted a phishing attack via a fake SSID.',
    'Removed the rogue AP using Spectrum App’s localization. Deployed WPA3 and educated students on SSID verification.',
    'Threat neutralized.',
    'Spectrum and Capture Apps stopped a phishing AP, protecting student data.',
    'Jamal Wright',
    'Critical',
    'Resolved',
    'Union Plaza Wi-Fi',
    170,
    'Wi-Fi Vigilante'
);


-- Reset case_files sequence
SELECT setval(pg_get_serial_sequence('public.case_files', 'id'), (SELECT MAX(id) FROM public.case_files));
