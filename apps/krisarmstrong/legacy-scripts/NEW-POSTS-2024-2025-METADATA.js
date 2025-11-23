// NEW BLOG POSTS FOR 2024-2025
// 23 total posts: 12 for 2024, 11 for 2025
// All dates avoid the 15th (existing posts) and fall on weekdays

export const newPosts2024 = [
  {
    id: 'beamforming-enterprise-wifi6-performance-jan2024',
    title: 'Beamforming in Enterprise Wi-Fi 6: Optimizing Coverage and Throughput',
    excerpt:
      'Beamforming technology in Wi-Fi 6 dramatically improves signal quality and range, but enterprise deployments require careful configuration. My field testing reveals how explicit beamforming, combined with MU-MIMO, transforms coverage patterns in challenging RF environments.',
    date: '2024-01-22',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Beamforming', 'Enterprise', 'RF Engineering', 'Performance'],
    featured: true,
    contentFile: 'beamforming-enterprise-wifi6-performance-jan2024.md',
  },
  {
    id: 'wifi6-client-device-compatibility-feb2024',
    title: 'Wi-Fi 6 Client Device Compatibility: Real-World Testing Results',
    excerpt:
      "Not all Wi-Fi 6 clients deliver the same performance. After testing hundreds of enterprise devices—from laptops to smartphones to IoT sensors—I've identified critical compatibility patterns that affect real-world deployment success.",
    date: '2024-02-21',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Client Devices', 'Compatibility', 'Testing', 'Enterprise'],
    featured: false,
    contentFile: 'wifi6-client-device-compatibility-feb2024.md',
  },
  {
    id: 'high-density-wifi6-conference-venues-mar2024',
    title: 'High-Density Wi-Fi 6 Design for Conference Centers and Auditoriums',
    excerpt:
      'Conference venues present extreme wireless challenges: thousands of simultaneous users in confined spaces demanding reliable connectivity. My Wi-Fi 6 deployments at major conference centers demonstrate how OFDMA, BSS Coloring, and spatial reuse solve density problems that defeated previous generations.',
    date: '2024-03-20',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'High Density', 'Conference Venues', 'Network Design', 'Enterprise'],
    featured: true,
    contentFile: 'high-density-wifi6-conference-venues-mar2024.md',
  },
  {
    id: 'network-slicing-wifi6-enterprise-apr2024',
    title: 'Network Slicing in Wi-Fi 6 Enterprise Environments',
    excerpt:
      "Network slicing enables logical network partitioning for different application classes, ensuring critical traffic receives guaranteed resources. My 2024 implementations show how Wi-Fi 6's enhanced QoS mechanisms enable true network slicing for voice, video, and IoT traffic.",
    date: '2024-04-18',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Network Slicing', 'QoS', 'Enterprise', 'Architecture'],
    featured: false,
    contentFile: 'network-slicing-wifi6-enterprise-apr2024.md',
  },
  {
    id: '6ghz-propagation-characteristics-may2024',
    title: '6 GHz Propagation Characteristics: Coverage Planning for Wi-Fi 6E',
    excerpt:
      'Higher frequency signals in the 6 GHz band exhibit different propagation characteristics than 2.4 and 5 GHz. My extensive field measurements quantify 6 GHz attenuation through common building materials, revealing critical insights for accurate coverage design.',
    date: '2024-05-23',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6E', '6 GHz', 'RF Propagation', 'Coverage Planning', 'Network Design'],
    featured: false,
    contentFile: '6ghz-propagation-characteristics-may2024.md',
  },
  {
    id: 'wifi6-manufacturing-industrial-automation-jun2024',
    title: 'Wi-Fi 6 for Manufacturing and Industrial Automation',
    excerpt:
      'Manufacturing environments demand deterministic wireless performance for industrial IoT, robotics, and real-time control systems. My Wi-Fi 6 deployments in factories demonstrate how Target Wake Time, OFDMA, and enhanced QoS deliver the reliability industrial automation requires.',
    date: '2024-06-19',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Manufacturing', 'Industrial IoT', 'Automation', 'Enterprise'],
    featured: true,
    contentFile: 'wifi6-manufacturing-industrial-automation-jun2024.md',
  },
  {
    id: 'spectrum-analysis-wifi6e-deployment-jul2024',
    title: 'Spectrum Analysis for Wi-Fi 6E Deployments: Tools and Techniques',
    excerpt:
      "The pristine 6 GHz band won't stay interference-free forever. Professional spectrum analysis identifies potential interference sources before they impact production networks. My field methodology covers essential tools, techniques, and interpretation strategies for 6 GHz deployments.",
    date: '2024-07-22',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6E', 'Spectrum Analysis', 'RF Engineering', 'Tools', 'Best Practices'],
    featured: false,
    contentFile: 'spectrum-analysis-wifi6e-deployment-jul2024.md',
  },
  {
    id: 'wifi6-roaming-optimization-aug2024',
    title: 'Wi-Fi 6 Roaming Optimization: 802.11k/r/v Implementation',
    excerpt:
      'Fast, reliable roaming remains critical for mobile enterprise applications. Wi-Fi 6 enhances 802.11k/r/v protocols, but proper implementation requires careful tuning. My production deployments reveal configuration strategies that achieve sub-50ms roaming times.',
    date: '2024-08-20',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Roaming', '802.11k/r/v', 'Optimization', 'Enterprise'],
    featured: false,
    contentFile: 'wifi6-roaming-optimization-aug2024.md',
  },
  {
    id: 'outdoor-wifi6e-campus-networks-sep2024',
    title: 'Outdoor Wi-Fi 6E for Campus and Stadium Networks',
    excerpt:
      'Outdoor wireless deployments benefit tremendously from 6 GHz spectrum, but environmental challenges intensify. My campus and stadium Wi-Fi 6E implementations address weatherproofing, power delivery, backhaul capacity, and the unique RF characteristics of outdoor 6 GHz propagation.',
    date: '2024-09-18',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6E', 'Outdoor', 'Campus Networks', 'Stadiums', 'Network Design'],
    featured: true,
    contentFile: 'outdoor-wifi6e-campus-networks-sep2024.md',
  },
  {
    id: 'power-consumption-wifi6-sustainability-oct2024',
    title: 'Power Consumption and Sustainability in Wi-Fi 6 Networks',
    excerpt:
      "Enterprise networks increasingly prioritize sustainability alongside performance. Wi-Fi 6's Target Wake Time and power-saving features reduce energy consumption, but infrastructure choices significantly impact total power usage. My analysis quantifies the sustainability advantages of modern wireless architectures.",
    date: '2024-10-23',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Sustainability', 'Power Consumption', 'TWT', 'Enterprise'],
    featured: false,
    contentFile: 'power-consumption-wifi6-sustainability-oct2024.md',
  },
  {
    id: 'cloud-managed-wifi6-comparison-nov2024',
    title: 'Cloud-Managed Wi-Fi 6: Platform Comparison and Best Practices',
    excerpt:
      'Cloud management has become standard for enterprise wireless, but platforms differ significantly in capabilities, architecture, and operational model. My extensive experience across major cloud-managed Wi-Fi 6 platforms reveals critical selection criteria and implementation best practices.',
    date: '2024-11-21',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Cloud Management', 'Enterprise', 'Platform Comparison', 'Best Practices'],
    featured: false,
    contentFile: 'cloud-managed-wifi6-comparison-nov2024.md',
  },
  {
    id: 'wifi6-wifi6e-2024-deployment-retrospective-dec2024',
    title: '2024 Wi-Fi 6/6E Deployment Retrospective: Maturity and Wi-Fi 7 Preparation',
    excerpt:
      "2024 marked Wi-Fi 6/6E's peak maturity year, with enterprise adoption reaching saturation as Wi-Fi 7 products emerged. This retrospective analyzes deployment patterns, lessons learned, and strategic positioning for the Wi-Fi 7 transition beginning in 2025.",
    date: '2024-12-18',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7', 'Retrospective', 'Industry Trends'],
    featured: true,
    contentFile: 'wifi6-wifi6e-2024-deployment-retrospective-dec2024.md',
  },
];

export const newPosts2025 = [
  {
    id: 'wifi7-early-hardware-testing-jan2025',
    title: 'Wi-Fi 7 Early Hardware: Real-World Testing and Performance Analysis',
    excerpt:
      'First-generation Wi-Fi 7 access points and client devices arrived in late 2024, enabling real-world testing beyond lab environments. My comprehensive evaluation of early Wi-Fi 7 hardware reveals actual performance characteristics, MLO behavior, and compatibility with legacy clients.',
    date: '2025-01-22',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Hardware Testing', 'Performance Analysis', 'MLO', 'Early Adoption'],
    featured: true,
    contentFile: 'wifi7-early-hardware-testing-jan2025.md',
  },
  {
    id: 'mlo-configuration-strategies-feb2025',
    title: 'Multi-Link Operation Configuration Strategies for Production Networks',
    excerpt:
      "MLO represents Wi-Fi 7's most complex feature to implement correctly. My early production deployments reveal critical configuration decisions for link aggregation versus switching modes, channel selection across bands, and client compatibility management.",
    date: '2025-02-20',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'MLO', 'Configuration', 'Production Networks', 'Best Practices'],
    featured: false,
    contentFile: 'mlo-configuration-strategies-feb2025.md',
  },
  {
    id: 'preamble-puncturing-spectrum-efficiency-mar2025',
    title: 'Preamble Puncturing: Maximizing Spectrum Efficiency in Wi-Fi 7',
    excerpt:
      "Wi-Fi 7's preamble puncturing enables wide channels even when narrow interference exists, dramatically improving spectrum utilization. My testing demonstrates how this feature maintains 320 MHz channels in real-world environments where legacy technologies would require fallback to narrower bandwidths.",
    date: '2025-03-19',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Preamble Puncturing', 'Spectrum Efficiency', '320 MHz', 'RF Engineering'],
    featured: true,
    contentFile: 'preamble-puncturing-spectrum-efficiency-mar2025.md',
  },
  {
    id: 'wifi7-backward-compatibility-testing-apr2025',
    title: 'Wi-Fi 7 Backward Compatibility: Ensuring Seamless Legacy Client Support',
    excerpt:
      'Wi-Fi 7 networks must support legacy Wi-Fi 6, 6E, and older clients for years. My extensive compatibility testing across hundreds of client devices reveals how Wi-Fi 7 APs handle mixed client environments and identifies potential issues before production deployment.',
    date: '2025-04-22',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Backward Compatibility', 'Legacy Clients', 'Testing', 'Enterprise'],
    featured: false,
    contentFile: 'wifi7-backward-compatibility-testing-apr2025.md',
  },
  {
    id: 'emergency-preparedness-wifi7-resilience-may2025',
    title: "Emergency Preparedness Networks: Wi-Fi 7's Resilience Features",
    excerpt:
      "Wi-Fi 7's MLO and enhanced reliability features provide unprecedented resilience for emergency services and disaster recovery networks. My deployments for first responders demonstrate how multi-link redundancy and deterministic latency transform critical communications infrastructure.",
    date: '2025-05-21',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Emergency Services', 'Network Resilience', 'MLO', 'Critical Infrastructure'],
    featured: true,
    contentFile: 'emergency-preparedness-wifi7-resilience-may2025.md',
  },
  {
    id: 'wifi7-video-production-broadcasting-jun2025',
    title: 'Wi-Fi 7 for Professional Video Production and Broadcasting',
    excerpt:
      "Professional video workflows demand multi-gigabit wireless performance with deterministic latency. Wi-Fi 7's 320 MHz channels, MLO, and 4K-QAM finally enable wireless camera feeds, live editing, and broadcast-quality content transfer over Wi-Fi.",
    date: '2025-06-18',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Video Production', 'Broadcasting', 'Media', 'High Performance'],
    featured: false,
    contentFile: 'wifi7-video-production-broadcasting-jun2025.md',
  },
  {
    id: 'automated-testing-wifi7-validation-jul2025',
    title: 'Automated Testing Frameworks for Wi-Fi 7 Network Validation',
    excerpt:
      "Wi-Fi 7's complexity demands automated validation beyond manual testing capabilities. I've developed comprehensive testing frameworks that verify MLO behavior, 320 MHz channel operation, and 4K-QAM performance across diverse client populations and environmental conditions.",
    date: '2025-07-23',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Automated Testing', 'Validation', 'DevOps', 'Quality Assurance'],
    featured: false,
    contentFile: 'automated-testing-wifi7-validation-jul2025.md',
  },
  {
    id: 'wifi7-education-campus-deployment-aug2025',
    title: 'Wi-Fi 7 in Higher Education: Campus Network Transformation',
    excerpt:
      'University environments combine high-density residence halls, research labs requiring multi-gigabit throughput, and sprawling outdoor spaces. My Wi-Fi 7 campus deployments demonstrate how next-generation wireless finally delivers the capacity and performance modern educational institutions require.',
    date: '2025-08-20',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Education', 'Campus Networks', 'High Density', 'Deployment'],
    featured: true,
    contentFile: 'wifi7-education-campus-deployment-aug2025.md',
  },
  {
    id: 'thermal-management-wifi7-access-points-sep2025',
    title: 'Thermal Management in Wi-Fi 7 Access Points: Design Considerations',
    excerpt:
      'Wi-Fi 7 APs consume significantly more power than predecessors, especially when operating 320 MHz channels with MLO across multiple radios. My field experience reveals critical thermal considerations for plenum spaces, outdoor enclosures, and high-density ceiling deployments.',
    date: '2025-09-22',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Thermal Management', 'Hardware Design', 'Deployment', 'Best Practices'],
    featured: false,
    contentFile: 'thermal-management-wifi7-access-points-sep2025.md',
  },
  {
    id: 'wifi7-cost-benefit-analysis-oct2025',
    title: 'Wi-Fi 7 Cost-Benefit Analysis: ROI for Early Adopters',
    excerpt:
      "Wi-Fi 7 hardware costs significantly more than Wi-Fi 6E, requiring careful ROI analysis. My evaluation framework helps organizations determine whether Wi-Fi 7's performance advantages justify the investment premium based on specific use cases, client populations, and application requirements.",
    date: '2025-10-21',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'ROI', 'Cost Analysis', 'Business Value', 'Enterprise'],
    featured: false,
    contentFile: 'wifi7-cost-benefit-analysis-oct2025.md',
  },
  {
    id: 'wifi7-global-deployment-patterns-nov2025',
    title: 'Global Wi-Fi 7 Deployment Patterns: Regional Adoption and Regulatory Status',
    excerpt:
      'Wi-Fi 7 adoption varies dramatically by region due to spectrum regulation, hardware availability, and local market dynamics. My analysis of global deployment patterns through 2025 reveals regional leaders, regulatory barriers, and strategies for multi-national wireless infrastructure.',
    date: '2025-11-19',
    author: 'Kris Armstrong',
    tags: ['Wi-Fi 7', 'Global Deployment', 'Regulatory', 'Regional Analysis', 'Industry Trends'],
    featured: true,
    contentFile: 'wifi7-global-deployment-patterns-nov2025.md',
  },
];
