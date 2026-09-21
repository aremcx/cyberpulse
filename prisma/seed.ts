// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient, Role, ArticleStatus, ContentType, DifficultyLevel,
  VulnerabilitySeverity, CvssVersion, EventCategory, WorkMode, JobType,
  ExperienceLevel, ThreatActorType, MalwareType, IndicatorType, LabDifficulty,
  CourseStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })


async function main() {
  console.log('🌱 Seeding CyberPulse database...')

  // ============================================================
  // USERS
  // ============================================================
  const passwordHash = await bcrypt.hash('CyberPulse2026!', 12)

  const superAdmin = await db.user.upsert({
    where: { email: 'admin@cyberpulse.io' },
    update: {},
    create: {
      email: 'admin@cyberpulse.io',
      name: 'CyberPulse Admin',
      username: 'admin',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      bio: 'Platform administrator',
      emailVerified: new Date(),
    },
  })

  const editor = await db.user.upsert({
    where: { email: 'editor@cyberpulse.io' },
    update: {},
    create: {
      email: 'editor@cyberpulse.io',
      name: 'Sarah Okonkwo',
      username: 'sarah_okonkwo',
      password: passwordHash,
      role: Role.EDITOR,
      bio: 'Senior cybersecurity editor with 8 years of experience in threat intelligence and security journalism.',
      skills: ['Threat Intelligence', 'OSINT', 'Malware Analysis', 'Incident Response'],
      certifications: ['CISSP', 'CEH', 'GCTI'],
      location: 'Lagos, Nigeria',
      emailVerified: new Date(),
    },
  })

  const author1 = await db.user.upsert({
    where: { email: 'author1@cyberpulse.io' },
    update: {},
    create: {
      email: 'author1@cyberpulse.io',
      name: 'Emeka Adeyemi',
      username: 'emeka_adeyemi',
      password: passwordHash,
      role: Role.AUTHOR,
      bio: 'Penetration tester and security researcher. OSCP certified. Passionate about web application security and red teaming.',
      skills: ['Penetration Testing', 'Web Security', 'Network Security', 'Python', 'Burp Suite'],
      certifications: ['OSCP', 'eJPT'],
      location: 'Abuja, Nigeria',
      emailVerified: new Date(),
    },
  })

  const author2 = await db.user.upsert({
    where: { email: 'author2@cyberpulse.io' },
    update: {},
    create: {
      email: 'author2@cyberpulse.io',
      name: 'Amina Bello',
      username: 'amina_bello',
      password: passwordHash,
      role: Role.AUTHOR,
      bio: 'SOC analyst and threat hunter. Passionate about detection engineering, SIEM, and building robust security operations centres across Africa.',
      skills: ['SOC Analysis', 'SIEM', 'Threat Hunting', 'KQL', 'Splunk'],
      certifications: ['CompTIA Security+', 'SC-200', 'BTL1'],
      location: 'Accra, Ghana',
      emailVerified: new Date(),
    },
  })

  const regularUser = await db.user.upsert({
    where: { email: 'user@cyberpulse.io' },
    update: {},
    create: {
      email: 'user@cyberpulse.io',
      name: 'Chidi Nwosu',
      username: 'chidi_nwosu',
      password: passwordHash,
      role: Role.USER,
      bio: 'Cybersecurity student and CTF enthusiast. Learning my way into the industry.',
      location: 'Port Harcourt, Nigeria',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // ============================================================
  // CATEGORIES
  // ============================================================
  const categories = await Promise.all([
    db.category.upsert({ where: { slug: 'fundamentals' }, update: {}, create: { name: 'Cybersecurity Fundamentals', slug: 'fundamentals', description: 'Core concepts and principles of cybersecurity', color: '#00d4ff', icon: 'Shield', order: 1 } }),
    db.category.upsert({ where: { slug: 'blue-team' }, update: {}, create: { name: 'Blue Team', slug: 'blue-team', description: 'Defensive security, detection, and response', color: '#3b82f6', icon: 'Shield', order: 2 } }),
    db.category.upsert({ where: { slug: 'red-team' }, update: {}, create: { name: 'Red Team', slug: 'red-team', description: 'Offensive security and penetration testing', color: '#ef4444', icon: 'Sword', order: 3 } }),
    db.category.upsert({ where: { slug: 'soc' }, update: {}, create: { name: 'SOC', slug: 'soc', description: 'Security Operations Center', color: '#f59e0b', icon: 'Monitor', order: 4 } }),
    db.category.upsert({ where: { slug: 'threat-intelligence' }, update: {}, create: { name: 'Threat Intelligence', slug: 'threat-intelligence', description: 'Cyber threat intelligence and analysis', color: '#8b5cf6', icon: 'Radio', order: 5 } }),
    db.category.upsert({ where: { slug: 'dfir' }, update: {}, create: { name: 'DFIR', slug: 'dfir', description: 'Digital Forensics and Incident Response', color: '#06b6d4', icon: 'Search', order: 6 } }),
    db.category.upsert({ where: { slug: 'malware' }, update: {}, create: { name: 'Malware', slug: 'malware', description: 'Malware analysis and research', color: '#dc2626', icon: 'Bug', order: 7 } }),
    db.category.upsert({ where: { slug: 'network-security' }, update: {}, create: { name: 'Network Security', slug: 'network-security', description: 'Network protocols, firewalls, and security', color: '#10b981', icon: 'Network', order: 8 } }),
    db.category.upsert({ where: { slug: 'cloud-security' }, update: {}, create: { name: 'Cloud Security', slug: 'cloud-security', description: 'AWS, Azure, GCP security', color: '#0ea5e9', icon: 'Cloud', order: 9 } }),
    db.category.upsert({ where: { slug: 'web-security' }, update: {}, create: { name: 'Web Security', slug: 'web-security', description: 'Web application security and OWASP', color: '#f97316', icon: 'Globe', order: 10 } }),
    db.category.upsert({ where: { slug: 'careers' }, update: {}, create: { name: 'Cybersecurity Careers', slug: 'careers', description: 'Career paths, certifications, and job market', color: '#84cc16', icon: 'Briefcase', order: 11 } }),
    db.category.upsert({ where: { slug: 'nigeria-cybersecurity' }, update: {}, create: { name: 'Nigeria Cybersecurity', slug: 'nigeria-cybersecurity', description: 'Nigerian cybersecurity landscape', color: '#22c55e', icon: 'MapPin', order: 12 } }),
    db.category.upsert({ where: { slug: 'africa-cybersecurity' }, update: {}, create: { name: 'African Cybersecurity', slug: 'africa-cybersecurity', description: 'Pan-African cybersecurity news and analysis', color: '#a3e635', icon: 'Globe', order: 13 } }),
    db.category.upsert({ where: { slug: 'security-awareness' }, update: {}, create: { name: 'Security Awareness', slug: 'security-awareness', description: 'Practical security tips for everyone', color: '#fbbf24', icon: 'AlertTriangle', order: 14 } }),
    db.category.upsert({ where: { slug: 'grc' }, update: {}, create: { name: 'Governance, Risk & Compliance', slug: 'grc', description: 'GRC, NDPR, ISO 27001, and compliance frameworks', color: '#94a3b8', icon: 'FileText', order: 15 } }),
  ])

  const [fundamentals, blueTeam, redTeam, soc, threatIntel, dfir, malwareCat,
    networkSec, cloudSec, webSec, careers, nigeriaCS, africaCS, awareness, grc] = categories

  console.log('✅ Categories created')

  // ============================================================
  // TAGS
  // ============================================================
  const tagNames = [
    'OWASP', 'SQL Injection', 'XSS', 'CSRF', 'Active Directory', 'Kerberos',
    'PowerShell', 'Linux', 'Windows', 'SIEM', 'Splunk', 'Elastic', 'Microsoft Sentinel',
    'MITRE ATT&CK', 'Ransomware', 'Phishing', 'Social Engineering', 'CVE',
    'Zero-Day', 'Patch Management', 'Threat Hunting', 'Digital Forensics',
    'Memory Forensics', 'Network Forensics', 'OSINT', 'Metasploit', 'Nmap',
    'Wireshark', 'Burp Suite', 'Python', 'Bash', 'CTF', 'Bug Bounty',
    'ISO 27001', 'NDPR', 'GDPR', 'AWS Security', 'Azure Security', 'GCP',
    'API Security', 'Container Security', 'Kubernetes', 'DevSecOps', 'SAST',
    'DAST', 'Certifications', 'CompTIA', 'CISSP', 'OSCP',
  ]

  const tags: Record<string, { id: string; slug: string }> = {}
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const tag = await db.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    })
    tags[name] = tag
  }

  console.log('✅ Tags created')

  // ============================================================
  // ARTICLES
  // ============================================================
  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)

  const articles = [
    {
      title: 'The Complete Guide to SQL Injection in 2026',
      slug: 'complete-guide-sql-injection-2026',
      excerpt: 'A comprehensive, hands-on guide to understanding, detecting, and preventing SQL injection attacks — from classic UNION-based to blind time-based techniques.',
      content: `# The Complete Guide to SQL Injection in 2026\n\nSQL injection remains one of the most prevalent and dangerous web application vulnerabilities despite being over two decades old. Understanding how it works is essential for every security professional.\n\n## What is SQL Injection?\n\nSQL injection (SQLi) is a web security vulnerability that allows attackers to interfere with the queries an application makes to its database.\n\n## Types of SQL Injection\n\n### 1. In-band SQLi\nThe most common and easy-to-exploit type. The attacker uses the same channel to both launch the attack and gather results.\n\n**UNION-based:**\n\`\`\`sql\n' UNION SELECT username, password FROM users--\n\`\`\`\n\n### 2. Blind SQLi\nThe application does not return the query results, but the attacker can infer information.\n\n**Boolean-based:**\n\`\`\`sql\n' AND 1=1-- (True condition)\n' AND 1=2-- (False condition)\n\`\`\`\n\n**Time-based:**\n\`\`\`sql\n'; IF (1=1) WAITFOR DELAY '0:0:5'--\n\`\`\`\n\n## Prevention\n\n1. **Use parameterized queries (prepared statements)**\n2. **Input validation and sanitization**\n3. **Use an ORM**\n4. **Principle of least privilege**\n5. **WAF as defense-in-depth**\n\n## Hands-on Lab\n\nPractice these techniques safely at our [SQL Injection Lab](/academy).\n`,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
      authorId: author1.id,
      categoryId: webSec.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTime: 12,
      status: ArticleStatus.PUBLISHED,
      featured: true,
      trending: true,
      publishedAt: daysAgo(2),
      viewCount: 3847,
      likeCount: 289,
      commentCount: 42,
      bookmarkCount: 156,
      seoTitle: 'SQL Injection Guide 2026: Types, Examples & Prevention',
      seoDescription: 'Master SQL injection attacks and defenses. Comprehensive guide covering UNION-based, blind, and time-based SQLi with real examples and prevention strategies.',
      keywords: ['SQL injection', 'SQLi', 'web security', 'OWASP', 'cybersecurity'],
      tagIds: ['OWASP', 'SQL Injection'],
    },
    {
      title: 'Active Directory Security: Kerberoasting Attack and Defense',
      slug: 'active-directory-kerberoasting-attack-defense',
      excerpt: 'Deep dive into the Kerberoasting technique — how attackers abuse Kerberos ticket granting to crack service account passwords offline.',
      content: `# Active Directory Security: Kerberoasting\n\nKerberoasting is one of the most common Active Directory attack techniques used by red teamers and threat actors alike.\n\n## How Kerberoasting Works\n\nAny domain user can request a Kerberos service ticket (TGS) for any service registered with an SPN. These tickets are encrypted with the service account's NTLM hash, which can be cracked offline.\n\n## Attack Execution\n\n\`\`\`powershell\n# Using Invoke-Kerberoast (PowerSploit)\nImport-Module .\\Invoke-Kerberoast.ps1\nInvoke-Kerberoast -OutputFormat Hashcat | Select-Object Hash | Out-File hashes.txt\n\n# Using Impacket\npython3 GetUserSPNs.py DOMAIN/user:password -dc-ip 10.0.0.1 -request\n\`\`\`\n\n## Cracking the Ticket\n\`\`\`bash\nhashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt\n\`\`\`\n\n## Detection\n\n- Monitor Event ID 4769 for TGS requests\n- Alert on high-encryption-type tickets (RC4-HMAC)\n- Use Microsoft Defender for Identity\n\n## Mitigation\n\n1. Use strong, complex passwords for service accounts (25+ characters)\n2. Use Group Managed Service Accounts (gMSA)\n3. Enable AES encryption for Kerberos\n4. Regularly audit service principal names (SPNs)\n`,
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
      authorId: author1.id,
      categoryId: redTeam.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.ADVANCED,
      readingTime: 15,
      status: ArticleStatus.PUBLISHED,
      featured: true,
      trending: true,
      publishedAt: daysAgo(5),
      viewCount: 5234,
      likeCount: 412,
      commentCount: 67,
      bookmarkCount: 298,
      seoTitle: 'Kerberoasting: Attack Techniques and Active Directory Defense',
      seoDescription: 'Complete guide to Kerberoasting attacks in Active Directory environments. Learn how attackers exploit Kerberos and how to defend your infrastructure.',
      keywords: ['Kerberoasting', 'Active Directory', 'Kerberos', 'red team', 'offensive security'],
      tagIds: ['Active Directory', 'Kerberos', 'PowerShell', 'MITRE ATT&CK'],
    },
    {
      title: 'Building a SOC on a Budget: Open Source SIEM Stack',
      slug: 'building-soc-budget-open-source-siem-stack',
      excerpt: 'Learn how to build a functional Security Operations Centre using open source tools — Elastic SIEM, Wazuh, and TheHive — for under $200/month.',
      content: `# Building a SOC on a Budget\n\nNot every organisation can afford enterprise security tools. Here is how to build a capable SOC using open source tools.\n\n## The Stack\n\n- **Wazuh** — SIEM, XDR, and compliance\n- **Elastic Stack** — Log aggregation and search\n- **TheHive** — Incident response platform\n- **MISP** — Threat intelligence sharing\n- **Shuffle** — SOAR automation\n\n## Architecture\n\n\`\`\`\nEndpoints → Wazuh Agents → Wazuh Manager → Elastic Stack → Kibana Dashboards\n                                                        ↓\n                                               TheHive (Alerts → Cases)\n\`\`\`\n\n## Setting Up Wazuh\n\n\`\`\`bash\n# Install Wazuh manager\ncurl -sO https://packages.wazuh.com/4.x/wazuh-install.sh\nbash ./wazuh-install.sh -a\n\`\`\`\n\n## Key Detection Rules\n\nConfigure detection rules for:\n- Failed login attempts\n- Privilege escalation\n- Lateral movement\n- Data exfiltration\n`,
      coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: soc.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTime: 18,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: true,
      publishedAt: daysAgo(7),
      viewCount: 7823,
      likeCount: 634,
      commentCount: 89,
      bookmarkCount: 445,
      tagIds: ['SIEM', 'Elastic', 'Linux'],
    },
    {
      title: 'Nigeria\'s Cybersecurity Act 2024: What You Need to Know',
      slug: 'nigeria-cybersecurity-act-2024-guide',
      excerpt: 'A plain-English breakdown of Nigeria\'s Cybersecurity Act 2024 and what it means for businesses, individuals, and the cybersecurity industry.',
      content: `# Nigeria's Cybersecurity Act 2024\n\nNigeria's cybersecurity legal landscape has evolved significantly. Here is what the industry needs to know.\n\n## Key Provisions\n\n### Critical Infrastructure Protection\nThe Act designates critical national information infrastructure (CNII) and imposes specific security obligations on operators.\n\n### Data Breach Notification\nOrganisations must notify the National Information Technology Development Agency (NITDA) within 72 hours of a data breach.\n\n### Cybercrime Offences\nThe Act strengthens penalties for cybercrime offences including hacking, cyberstalking, and electronic fraud.\n\n## Implications for Businesses\n\n1. Conduct security assessments\n2. Implement incident response plans\n3. Train employees on cybersecurity\n4. Engage a Data Protection Officer where required\n\n## Compliance Roadmap\n\nA practical checklist for Nigerian businesses to achieve compliance.\n`,
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop',
      authorId: editor.id,
      categoryId: nigeriaCS.id,
      contentType: ContentType.ARTICLE,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 10,
      status: ArticleStatus.PUBLISHED,
      featured: true,
      trending: false,
      publishedAt: daysAgo(1),
      viewCount: 2341,
      likeCount: 178,
      commentCount: 31,
      bookmarkCount: 89,
      tagIds: ['NDPR', 'ISO 27001'],
    },
    {
      title: 'Ransomware Response Playbook: From Detection to Recovery',
      slug: 'ransomware-response-playbook-detection-recovery',
      excerpt: 'A battle-tested incident response playbook for ransomware attacks — covering initial detection, containment, eradication, and recovery.',
      content: `# Ransomware Response Playbook\n\nWhen ransomware hits, every minute counts. This playbook walks your team through the critical steps.\n\n## Phase 1: Detection & Triage (0–1 hour)\n\n1. Identify affected systems\n2. Determine ransomware family (check ransom note, file extensions)\n3. Assess blast radius\n4. Activate your incident response team\n\n## Phase 2: Containment (1–4 hours)\n\n1. Isolate infected systems from the network\n2. Disable VPN access\n3. Reset compromised credentials\n4. Preserve forensic evidence\n\n\`\`\`powershell\n# Isolate a Windows host\nnetsh advfirewall set allprofiles state on\nnetsh advfirewall firewall add rule name="ISOLATE" dir=out action=block\n\`\`\`\n\n## Phase 3: Eradication\n\n1. Identify initial access vector\n2. Remove malware artifacts\n3. Patch exploited vulnerabilities\n\n## Phase 4: Recovery\n\n1. Restore from clean backups\n2. Verify integrity of restored systems\n3. Monitor for re-infection\n`,
      coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: dfir.id,
      contentType: ContentType.ARTICLE,
      difficulty: DifficultyLevel.ADVANCED,
      readingTime: 22,
      status: ArticleStatus.PUBLISHED,
      featured: true,
      trending: true,
      publishedAt: daysAgo(3),
      viewCount: 9456,
      likeCount: 823,
      commentCount: 134,
      bookmarkCount: 567,
      tagIds: ['Ransomware', 'Digital Forensics', 'MITRE ATT&CK'],
    },
    {
      title: 'How to Start Your Cybersecurity Career in Nigeria (2026 Guide)',
      slug: 'start-cybersecurity-career-nigeria-2026',
      excerpt: 'A comprehensive roadmap for breaking into cybersecurity in Nigeria — certifications, skills, platforms, and local opportunities.',
      content: `# Starting a Cybersecurity Career in Nigeria\n\nNigeria's cybersecurity job market is growing rapidly. Here is how to get in.\n\n## Step 1: Build Foundational Skills\n\n- **Networking**: CompTIA Network+ or Cisco CCNA\n- **OS**: Linux fundamentals (try Ubuntu, Kali)\n- **Security basics**: CompTIA Security+\n\n## Step 2: Choose a Specialisation\n\n| Path | Entry Certification | Time to Job |\n|------|---------------------|-------------|\n| SOC Analyst | BTL1, SC-200 | 6–12 months |\n| Penetration Tester | eJPT, OSCP | 12–18 months |\n| GRC Analyst | CRISC, ISO 27001 LA | 9–12 months |\n\n## Step 3: Get Hands-On Experience\n\n- TryHackMe and Hack The Box\n- Local CTF competitions (NCSC, OWASP Nigeria)\n- Bug bounty programs\n- Internships with Nigerian banks and fintechs\n\n## Step 4: Network\n\n- ISACA Lagos Chapter\n- Nigeria Cyber Alliance\n- Africa Cybersecurity Forum\n`,
      coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop',
      authorId: editor.id,
      categoryId: careers.id,
      contentType: ContentType.CAREER,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 14,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: true,
      publishedAt: daysAgo(4),
      viewCount: 12567,
      likeCount: 1023,
      commentCount: 189,
      bookmarkCount: 734,
      tagIds: ['Certifications', 'CompTIA', 'OSCP'],
    },
    {
      title: 'Understanding Phishing Attacks: A Guide for Employees',
      slug: 'understanding-phishing-attacks-guide-employees',
      excerpt: 'Simple, practical guide to recognizing and avoiding phishing emails, smishing, vishing, and social engineering attacks.',
      content: `# Understanding Phishing Attacks\n\nPhishing is the number one cause of data breaches worldwide. Learn to spot and avoid it.\n\n## What is Phishing?\n\nPhishing is a cyber attack that uses disguised email as a weapon. The goal is to trick the recipient into believing the message is something they want.\n\n## Red Flags to Watch For\n\n1. **Urgency** — "Your account will be suspended in 24 hours!"\n2. **Suspicious sender** — Check the actual email domain\n3. **Generic greeting** — "Dear Customer" instead of your name\n4. **Suspicious links** — Hover to see the real URL\n5. **Request for credentials or payment**\n\n## Types of Phishing\n\n- **Spear phishing**: Targeted at specific individuals\n- **Whaling**: Targeting executives (CEO fraud)\n- **Smishing**: Via SMS\n- **Vishing**: Voice phishing via phone calls\n\n## What to Do If You Suspect Phishing\n\n1. Do not click any links\n2. Do not open attachments\n3. Report to your IT/security team\n4. Delete the email\n`,
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop',
      authorId: editor.id,
      categoryId: awareness.id,
      contentType: ContentType.SECURITY_AWARENESS,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 6,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(6),
      viewCount: 4567,
      likeCount: 345,
      commentCount: 23,
      bookmarkCount: 198,
      tagIds: ['Phishing', 'Social Engineering'],
    },
    {
      title: 'Cloud Security Posture Management (CSPM) Explained',
      slug: 'cloud-security-posture-management-cspm-explained',
      excerpt: 'What is CSPM, why every cloud-first organisation needs it, and how to evaluate and implement a CSPM solution.',
      content: `# Cloud Security Posture Management (CSPM)\n\nAs organisations move to the cloud, misconfiguration has become the leading cause of cloud data breaches.\n\n## What is CSPM?\n\nCSPM continuously monitors cloud infrastructure for misconfigurations, compliance violations, and security risks.\n\n## Common Cloud Misconfigurations\n\n- Public S3 buckets\n- Overly permissive IAM roles\n- Unencrypted databases\n- Open security groups (0.0.0.0/0)\n- Disabled MFA on root accounts\n\n## Leading CSPM Tools\n\n| Tool | Type | Best For |\n|------|------|----------|\n| AWS Security Hub | Native | AWS environments |\n| Microsoft Defender for Cloud | Native | Azure environments |\n| Prisma Cloud | Commercial | Multi-cloud |\n| Wiz | Commercial | Enterprise multi-cloud |\n| Prowler | Open Source | AWS audit |\n\n## Implementation Steps\n\n1. Inventory all cloud assets\n2. Establish security baselines\n3. Deploy CSPM tooling\n4. Set up alerting and remediation\n5. Continuous compliance reporting\n`,
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: cloudSec.id,
      contentType: ContentType.ARTICLE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTime: 10,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(8),
      viewCount: 3211,
      likeCount: 267,
      commentCount: 38,
      bookmarkCount: 145,
      tagIds: ['AWS Security', 'Azure Security', 'Container Security'],
    },
    {
      title: 'OSINT Techniques for Threat Intelligence Analysts',
      slug: 'osint-techniques-threat-intelligence-analysts',
      excerpt: 'Practical OSINT methodologies, tools, and workflows for gathering actionable threat intelligence from open sources.',
      content: `# OSINT for Threat Intelligence Analysts\n\nOpen Source Intelligence (OSINT) is a critical skill for any threat intelligence professional.\n\n## OSINT Framework\n\nA structured approach:\n\n1. **Define collection requirements**\n2. **Identify sources**\n3. **Collect data**\n4. **Process and analyse**\n5. **Produce intelligence**\n\n## Essential OSINT Tools\n\n\`\`\`bash\n# Shodan - Internet-connected device search\nshodan search "default password" apache\n\n# theHarvester - Email and subdomain enumeration\ntheHarvester -d example.com -b google,bing,linkedin\n\n# Maltego - Visual link analysis\n# (GUI tool — ideal for mapping relationships)\n\`\`\`\n\n## Threat Actor Research\n\n- Dark web monitoring (with appropriate precautions)\n- Paste sites (Pastebin, GitHub gists)\n- Social media monitoring\n- Domain/IP pivot analysis\n- Certificate transparency logs\n\n## Automation\n\nBuild an OSINT pipeline:\n\n\`\`\`python\nimport requests\n\ndef check_ip_reputation(ip: str) -> dict:\n    """Check IP against AbuseIPDB"""\n    response = requests.get(\n        "https://api.abuseipdb.com/api/v2/check",\n        headers={"Key": "YOUR_API_KEY", "Accept": "application/json"},\n        params={"ipAddress": ip, "maxAgeInDays": 90}\n    )\n    return response.json()\n\`\`\`\n`,
      coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: threatIntel.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTime: 16,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: true,
      publishedAt: daysAgo(10),
      viewCount: 6789,
      likeCount: 567,
      commentCount: 78,
      bookmarkCount: 389,
      tagIds: ['OSINT', 'Threat Hunting', 'Python'],
    },
    {
      title: 'Memory Forensics with Volatility 3: A Practical Guide',
      slug: 'memory-forensics-volatility-3-practical-guide',
      excerpt: 'Learn to analyse Windows and Linux memory dumps using Volatility 3 to uncover malware, attacker tools, and forensic artifacts.',
      content: `# Memory Forensics with Volatility 3\n\nMemory forensics allows investigators to recover volatile data that would be lost upon system shutdown.\n\n## Setting Up Volatility 3\n\n\`\`\`bash\ngit clone https://github.com/volatilityfoundation/volatility3.git\ncd volatility3\npip install -r requirements.txt\n\`\`\`\n\n## Key Plugins\n\n\`\`\`bash\n# List running processes\npython3 vol.py -f memory.dmp windows.pslist\n\n# Detect process injection\npython3 vol.py -f memory.dmp windows.malfind\n\n# Extract network connections\npython3 vol.py -f memory.dmp windows.netstat\n\n# Dump a specific process\npython3 vol.py -f memory.dmp windows.dumpfiles --pid 1234\n\`\`\`\n\n## Hunting for Malware\n\n1. Check for suspicious process names and parents\n2. Look for processes injected into legitimate processes\n3. Extract and scan suspicious DLLs\n4. Analyse network connections\n5. Extract browser artifacts\n`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      authorId: author1.id,
      categoryId: dfir.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.ADVANCED,
      readingTime: 20,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(12),
      viewCount: 4123,
      likeCount: 345,
      commentCount: 56,
      bookmarkCount: 234,
      tagIds: ['Memory Forensics', 'Digital Forensics', 'Python'],
    },
    // News articles
    {
      title: 'Critical Zero-Day Vulnerability Affects Major Banking Apps Across West Africa',
      slug: 'critical-zero-day-banking-apps-west-africa',
      excerpt: 'Security researchers have disclosed a critical zero-day vulnerability affecting multiple banking applications used across West Africa, prompting urgent patches.',
      content: `# Critical Zero-Day in West African Banking Apps\n\n**[DEMO DATA — FICTIONAL INCIDENT]**\n\nSecurity researchers have responsibly disclosed a critical authentication bypass vulnerability affecting multiple mobile banking applications across West Africa.\n\n## Affected Applications\n\nThe vulnerability (fictional for demo purposes) affects several unnamed banking applications with an estimated 12 million active users.\n\n## Technical Details\n\nThe vulnerability stems from improper session token validation, allowing attackers to forge authentication tokens without valid credentials.\n\n## Impact\n\n- Potential unauthorised access to bank accounts\n- Risk of fraudulent transactions\n- Exposure of personal financial data\n\n## Response\n\nAffected vendors have been notified and patches are being fast-tracked.\n\n## Recommendations\n\n1. Update your banking apps immediately when patches are released\n2. Enable transaction notifications\n3. Monitor accounts for suspicious activity\n4. Report suspicious transactions immediately\n`,
      coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
      authorId: editor.id,
      categoryId: africaCS.id,
      contentType: ContentType.NEWS,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 5,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: true,
      publishedAt: daysAgo(0),
      viewCount: 8901,
      likeCount: 567,
      commentCount: 145,
      bookmarkCount: 312,
      tagIds: ['Zero-Day', 'CVE'],
    },
    {
      title: 'LockBit 3.0 Ransomware Analysis: Technical Breakdown',
      slug: 'lockbit-30-ransomware-analysis-technical-breakdown',
      excerpt: 'Deep technical analysis of LockBit 3.0 ransomware — its encryption mechanism, lateral movement techniques, and detection strategies.',
      content: `# LockBit 3.0 Ransomware Analysis\n\n**[DEMO DATA — EDUCATIONAL ANALYSIS]**\n\nLockBit 3.0 (also known as LockBit Black) represents a significant evolution in the ransomware landscape.\n\n## Key Capabilities\n\n- **Encryption**: Uses a combination of RSA-2048 and AES-256\n- **Speed**: Optimised for extremely fast encryption\n- **Anti-analysis**: Multiple anti-debugging techniques\n- **Lateral movement**: Leverages Windows APIs for propagation\n\n## Infection Chain\n\n\`\`\`\nInitial Access (Phishing/RDP) → Privilege Escalation → Credential Theft\n  → Lateral Movement → Data Exfiltration → Encryption → Ransom Note\n\`\`\`\n\n## MITRE ATT&CK Mapping\n\n- T1566: Phishing\n- T1078: Valid Accounts\n- T1021.001: Remote Desktop Protocol\n- T1486: Data Encrypted for Impact\n\n## Detection\n\nSIEM rules to detect LockBit 3.0 activity:\n\n\`\`\`\nevent_id:4624 AND logon_type:10 AND source_ip NOT IN whitelist → Alert: Suspicious RDP Login\n\`\`\`\n`,
      coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: malwareCat.id,
      contentType: ContentType.RESEARCH,
      difficulty: DifficultyLevel.EXPERT,
      readingTime: 25,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(15),
      viewCount: 5678,
      likeCount: 489,
      commentCount: 67,
      bookmarkCount: 356,
      tagIds: ['Ransomware', 'MITRE ATT&CK', 'SIEM'],
    },
    {
      title: 'Top 10 Password Managers Compared for Security Professionals',
      slug: 'top-10-password-managers-security-professionals',
      excerpt: 'Comprehensive comparison of the best password managers for security-conscious individuals and teams.',
      content: `# Top 10 Password Managers for Security Professionals\n\nA strong password manager is a foundational security tool. Here is how the top options compare.\n\n## Comparison Table\n\n| Manager | Open Source | Self-Hosted | Team Features | Price |\n|---------|-------------|-------------|----------------|-------|\n| Bitwarden | ✅ | ✅ | ✅ | Free/Premium |\n| 1Password | ❌ | ❌ | ✅ | $3/mo |\n| Dashlane | ❌ | ❌ | ✅ | $5/mo |\n| KeePass | ✅ | ✅ | ❌ | Free |\n| Keeper | ❌ | ❌ | ✅ | $5/mo |\n\n## Our Recommendations\n\n**For individuals**: Bitwarden (open source, zero-knowledge, affordable)\n**For teams**: 1Password Teams or Bitwarden Organisations\n**For maximum control**: KeePass + Syncthing\n\n## Security Considerations\n\n- Zero-knowledge architecture is essential\n- Check for third-party security audits\n- Enable MFA on your password manager account\n- Use a strong master password (passphrase recommended)\n`,
      coverImage: 'https://images.unsplash.com/photo-1614064548016-0b5c13ca2c85?w=800&auto=format&fit=crop',
      authorId: author1.id,
      categoryId: fundamentals.id,
      contentType: ContentType.TOOL_REVIEW,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 8,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(20),
      viewCount: 3456,
      likeCount: 289,
      commentCount: 45,
      bookmarkCount: 178,
      tagIds: ['Phishing'],
    },
    {
      title: 'Network Traffic Analysis: Detecting C2 Beaconing',
      slug: 'network-traffic-analysis-detecting-c2-beaconing',
      excerpt: 'Learn how to identify Command and Control (C2) beaconing patterns in network traffic using Wireshark and Zeek.',
      content: `# Detecting C2 Beaconing in Network Traffic\n\nCommand and Control (C2) beaconing is a telltale sign of an active compromise.\n\n## What is C2 Beaconing?\n\nMalware phones home to a C2 server at regular intervals to receive instructions, exfiltrate data, or maintain persistence.\n\n## Detection with Zeek\n\n\`\`\`zeek\nevent http_request(c: connection, method: string, original_URI: string, ...) {\n  if (method == "POST" && |original_URI| < 5) {\n    print fmt("Suspicious short URI POST: %s", original_URI);\n  }\n}\n\`\`\`\n\n## Detection with Wireshark\n\n\`\`\`\n# Filter for high-frequency connections\nhttp.request.method == "POST" && tcp.len < 100\n\`\`\`\n\n## Statistical Analysis\n\nLook for:\n- Regular time intervals (beaconing)\n- Fixed packet sizes\n- Low byte count per session\n- Connections to rare/new domains\n`,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
      authorId: author2.id,
      categoryId: networkSec.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.ADVANCED,
      readingTime: 14,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(18),
      viewCount: 4567,
      likeCount: 389,
      commentCount: 54,
      bookmarkCount: 267,
      tagIds: ['Wireshark', 'Network Forensics', 'Threat Hunting'],
    },
    {
      title: 'Introduction to Cybersecurity Fundamentals (Beginner\'s Roadmap)',
      slug: 'introduction-cybersecurity-fundamentals-beginners-roadmap',
      excerpt: 'The ultimate starting point for anyone new to cybersecurity — covering essential concepts, career paths, and free learning resources.',
      content: `# Introduction to Cybersecurity Fundamentals\n\nWelcome to cybersecurity! This guide will help you get started.\n\n## What is Cybersecurity?\n\nCybersecurity is the practice of protecting systems, networks, programs, and data from digital attacks.\n\n## Core Concepts\n\n### The CIA Triad\n- **Confidentiality**: Protect sensitive data from unauthorised access\n- **Integrity**: Ensure data is accurate and tamper-free\n- **Availability**: Ensure systems are accessible when needed\n\n### Common Threats\n1. Malware\n2. Phishing\n3. Ransomware\n4. Man-in-the-Middle attacks\n5. DDoS attacks\n6. Insider threats\n\n## Beginner Learning Path\n\n1. **Foundation**: CompTIA IT Fundamentals (ITF+)\n2. **Networking**: Network+ or CCNA\n3. **Security**: CompTIA Security+\n4. **Hands-on**: TryHackMe beginner paths\n5. **Specialise**: Choose SOC, Pentesting, GRC, or Cloud Security\n\n## Free Resources\n\n- TryHackMe.com\n- Cybrary.it\n- SANS Cyber Aces\n- Professor Messer (CompTIA)\n- CyberPulse Academy (right here!)\n`,
      coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
      authorId: editor.id,
      categoryId: fundamentals.id,
      contentType: ContentType.TUTORIAL,
      difficulty: DifficultyLevel.BEGINNER,
      readingTime: 10,
      status: ArticleStatus.PUBLISHED,
      featured: false,
      trending: false,
      publishedAt: daysAgo(25),
      viewCount: 15678,
      likeCount: 1234,
      commentCount: 234,
      bookmarkCount: 890,
      tagIds: ['Certifications', 'CompTIA'],
    },
  ]

  const createdArticles: string[] = []

  for (const articleData of articles) {
    const { tagIds: tagNames, ...data } = articleData
    const article = await db.article.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        tags: {
          create: (tagNames || []).map((name) => ({
            tagId: tags[name]?.id ?? '',
          })).filter((t) => t.tagId),
        },
      },
    })
    createdArticles.push(article.id)
  }

  console.log(`✅ ${createdArticles.length} articles created`)

  // ============================================================
  // VULNERABILITIES (Demo data — clearly labeled)
  // ============================================================
  await db.vulnerability.createMany({
    skipDuplicates: true,
    data: [
      {
        cveId: 'CVE-2026-0001',
        title: '[DEMO] Remote Code Execution in Example Web Framework',
        slug: 'demo-rce-example-web-framework-cve-2026-0001',
        description: 'DEMO DATA: A critical remote code execution vulnerability exists in the Example Web Framework v3.x due to improper deserialization of user-supplied data.',
        severity: VulnerabilitySeverity.CRITICAL,
        cvssScore: 9.8,
        cvssVersion: CvssVersion.V31,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        affectedVendor: 'Example Corp (DEMO)',
        affectedProduct: 'Example Web Framework',
        affectedVersions: '< 3.5.2',
        publishedAt: daysAgo(1),
        remediation: 'Upgrade to version 3.5.2 or later. Apply vendor patch.',
        isKev: true,
        kevDate: daysAgo(0),
      },
      {
        cveId: 'CVE-2026-0002',
        title: '[DEMO] SQL Injection in Open Source CMS Plugin',
        slug: 'demo-sql-injection-cms-plugin-cve-2026-0002',
        description: 'DEMO DATA: An SQL injection vulnerability in the ExampleCMS authentication plugin allows unauthenticated attackers to read and modify the database.',
        severity: VulnerabilitySeverity.HIGH,
        cvssScore: 8.8,
        cvssVersion: CvssVersion.V31,
        affectedVendor: 'OpenSource Example (DEMO)',
        affectedProduct: 'ExampleCMS Auth Plugin',
        affectedVersions: '< 2.1.0',
        publishedAt: daysAgo(3),
        remediation: 'Update to version 2.1.0. Temporarily disable the auth plugin if immediate update is not possible.',
      },
      {
        cveId: 'CVE-2026-0003',
        title: '[DEMO] Path Traversal in Network Monitoring Tool',
        slug: 'demo-path-traversal-network-monitoring-cve-2026-0003',
        description: 'DEMO DATA: A path traversal vulnerability in Example Network Monitor allows authenticated users with low privileges to read arbitrary files on the server.',
        severity: VulnerabilitySeverity.HIGH,
        cvssScore: 7.5,
        cvssVersion: CvssVersion.V31,
        affectedVendor: 'NetMonitor Corp (DEMO)',
        affectedProduct: 'Example Network Monitor',
        affectedVersions: '4.x < 4.8.1',
        publishedAt: daysAgo(5),
        remediation: 'Upgrade to 4.8.1. Restrict access to the monitoring interface.',
      },
      {
        cveId: 'CVE-2026-0004',
        title: '[DEMO] Authentication Bypass in IoT Router Firmware',
        slug: 'demo-auth-bypass-iot-router-cve-2026-0004',
        description: 'DEMO DATA: An authentication bypass vulnerability in ExampleRouter firmware allows remote attackers to gain admin access without credentials.',
        severity: VulnerabilitySeverity.CRITICAL,
        cvssScore: 9.1,
        cvssVersion: CvssVersion.V31,
        affectedVendor: 'ExampleRouter Inc (DEMO)',
        affectedProduct: 'ExampleRouter Home Series',
        affectedVersions: 'All versions < 1.9.0',
        publishedAt: daysAgo(7),
        remediation: 'Apply firmware update 1.9.0. If unavailable, disable remote management.',
        isKev: false,
      },
      {
        cveId: 'CVE-2026-0005',
        title: '[DEMO] XSS Vulnerability in Popular Help Desk Software',
        slug: 'demo-xss-help-desk-software-cve-2026-0005',
        description: 'DEMO DATA: A stored cross-site scripting vulnerability in ExampleDesk allows authenticated agents to inject malicious scripts affecting all users.',
        severity: VulnerabilitySeverity.MEDIUM,
        cvssScore: 5.4,
        cvssVersion: CvssVersion.V31,
        affectedVendor: 'ExampleDesk Ltd (DEMO)',
        affectedProduct: 'ExampleDesk',
        affectedVersions: '< 8.2.3',
        publishedAt: daysAgo(10),
        remediation: 'Upgrade to 8.2.3. Enable strict Content Security Policy.',
      },
    ],
  })

  console.log('✅ Vulnerabilities created')

  // ============================================================
  // TOOLS
  // ============================================================
  await db.tool.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Wazuh',
        slug: 'wazuh',
        description: 'Open source security platform providing unified XDR and SIEM capabilities. Supports threat detection, integrity monitoring, incident response, and compliance.',
        category: 'SIEM',
        platform: ['Linux', 'Windows', 'Docker'],
        isOpenSource: true,
        website: 'https://wazuh.com',
        documentation: 'https://documentation.wazuh.com',
        github: 'https://github.com/wazuh/wazuh',
        useCases: ['SIEM', 'File Integrity Monitoring', 'Vulnerability Detection', 'Compliance'],
        skillLevel: DifficultyLevel.INTERMEDIATE,
        featured: true,
      },
      {
        name: 'Metasploit',
        slug: 'metasploit',
        description: 'The world\'s most used penetration testing framework. Find, exploit, and validate vulnerabilities.',
        category: 'Penetration Testing',
        platform: ['Linux', 'Windows', 'macOS'],
        isOpenSource: true,
        website: 'https://metasploit.com',
        documentation: 'https://docs.metasploit.com',
        github: 'https://github.com/rapid7/metasploit-framework',
        useCases: ['Exploit Development', 'Penetration Testing', 'Post-Exploitation'],
        skillLevel: DifficultyLevel.ADVANCED,
        featured: true,
      },
      {
        name: 'Wireshark',
        slug: 'wireshark',
        description: 'The world\'s foremost network protocol analyser. Lets you see what\'s happening on your network at a microscopic level.',
        category: 'Network Security',
        platform: ['Linux', 'Windows', 'macOS'],
        isOpenSource: true,
        website: 'https://wireshark.org',
        documentation: 'https://wireshark.org/docs/',
        github: 'https://github.com/wireshark/wireshark',
        useCases: ['Packet Analysis', 'Network Forensics', 'Protocol Analysis', 'Troubleshooting'],
        skillLevel: DifficultyLevel.INTERMEDIATE,
        featured: true,
      },
      {
        name: 'Burp Suite',
        slug: 'burp-suite',
        description: 'Leading platform for web application security testing. Used by security professionals for manual and automated vulnerability discovery.',
        category: 'Web Security',
        platform: ['Linux', 'Windows', 'macOS'],
        isOpenSource: false,
        website: 'https://portswigger.net/burp',
        documentation: 'https://portswigger.net/burp/documentation',
        useCases: ['Web App Testing', 'API Testing', 'Vulnerability Scanning', 'Fuzzing'],
        skillLevel: DifficultyLevel.INTERMEDIATE,
        featured: true,
      },
      {
        name: 'MISP',
        slug: 'misp',
        description: 'Malware Information Sharing Platform. Open source threat intelligence platform for sharing structured threat information.',
        category: 'Threat Intelligence',
        platform: ['Linux', 'Docker'],
        isOpenSource: true,
        website: 'https://misp-project.org',
        documentation: 'https://misp-project.org/documentation/',
        github: 'https://github.com/MISP/MISP',
        useCases: ['Threat Intelligence Sharing', 'IOC Management', 'Incident Response'],
        skillLevel: DifficultyLevel.ADVANCED,
        featured: false,
      },
      {
        name: 'Nmap',
        slug: 'nmap',
        description: 'Free and open source utility for network discovery and security auditing. Industry standard for port scanning and network inventory.',
        category: 'Network Security',
        platform: ['Linux', 'Windows', 'macOS'],
        isOpenSource: true,
        website: 'https://nmap.org',
        documentation: 'https://nmap.org/docs/',
        github: 'https://github.com/nmap/nmap',
        useCases: ['Port Scanning', 'OS Detection', 'Service Enumeration', 'Network Inventory'],
        skillLevel: DifficultyLevel.BEGINNER,
        featured: false,
      },
      {
        name: 'TheHive',
        slug: 'thehive',
        description: 'Scalable, open source security incident response platform designed to make incident analysts\' life easy.',
        category: 'Digital Forensics',
        platform: ['Linux', 'Docker'],
        isOpenSource: true,
        website: 'https://thehive-project.org',
        github: 'https://github.com/TheHive-Project/TheHive',
        useCases: ['Incident Response', 'Case Management', 'SOAR', 'Alert Triage'],
        skillLevel: DifficultyLevel.INTERMEDIATE,
        featured: false,
      },
      {
        name: 'Volatility 3',
        slug: 'volatility-3',
        description: 'The world\'s most widely used framework for extracting digital artifacts from volatile memory samples.',
        category: 'Digital Forensics',
        platform: ['Linux', 'Windows', 'macOS'],
        isOpenSource: true,
        website: 'https://volatilityfoundation.org',
        github: 'https://github.com/volatilityfoundation/volatility3',
        useCases: ['Memory Forensics', 'Malware Analysis', 'Incident Response'],
        skillLevel: DifficultyLevel.ADVANCED,
        featured: false,
      },
    ],
  })

  console.log('✅ Tools created')

  // ============================================================
  // EVENTS
  // ============================================================
  await db.event.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Nigeria Cybersecurity Summit 2026',
        slug: 'nigeria-cybersecurity-summit-2026',
        description: 'Nigeria\'s flagship cybersecurity event bringing together industry leaders, government officials, and security professionals to address the evolving cyber threat landscape in Nigeria and West Africa.',
        organizer: 'Nigeria Cyber Alliance',
        location: 'Eko Hotel & Suites, Lagos',
        country: 'Nigeria',
        region: 'Africa',
        isOnline: false,
        startDate: new Date('2026-10-15'),
        endDate: new Date('2026-10-16'),
        registrationUrl: 'https://example.com/register',
        category: EventCategory.CONFERENCE,
        featured: true,
      },
      {
        name: 'Africa Cybersecurity Forum (ACF) 2026',
        slug: 'africa-cybersecurity-forum-2026',
        description: 'Pan-African cybersecurity forum covering threat intelligence, regulations, and regional security challenges across the continent.',
        organizer: 'Africa Cyber Alliance',
        location: 'Kigali Convention Centre, Rwanda',
        country: 'Rwanda',
        region: 'Africa',
        isOnline: false,
        startDate: new Date('2026-11-20'),
        endDate: new Date('2026-11-22'),
        registrationUrl: 'https://example.com/acf',
        category: EventCategory.CONFERENCE,
        featured: true,
      },
      {
        name: 'CyberPulse CTF Challenge — October 2026',
        slug: 'cyberpulse-ctf-october-2026',
        description: 'CyberPulse community Capture The Flag competition. Open to all skill levels with challenges across web, forensics, crypto, and reverse engineering.',
        organizer: 'CyberPulse',
        location: 'Online',
        isOnline: true,
        startDate: new Date('2026-10-25'),
        endDate: new Date('2026-10-27'),
        registrationUrl: 'https://example.com/ctf',
        category: EventCategory.CTF,
        featured: false,
      },
      {
        name: 'SOC Analyst Webinar: Threat Hunting with KQL',
        slug: 'soc-analyst-webinar-threat-hunting-kql',
        description: 'Live webinar on advanced threat hunting using Kusto Query Language (KQL) in Microsoft Sentinel. Hands-on demonstrations included.',
        organizer: 'CyberPulse Academy',
        isOnline: true,
        startDate: new Date('2026-09-30'),
        category: EventCategory.WEBINAR,
        featured: false,
      },
    ],
  })

  console.log('✅ Events created')

  // ============================================================
  // JOBS
  // ============================================================
  await db.job.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'SOC Analyst (Tier 2)',
        slug: 'soc-analyst-tier-2-lagos',
        company: 'First Bank of Nigeria (DEMO)',
        description: 'DEMO JOB: We are seeking an experienced SOC Analyst Tier 2 to join our security operations team. You will be responsible for investigating escalated alerts, threat hunting, and incident response.',
        location: 'Lagos, Nigeria',
        country: 'Nigeria',
        region: 'Africa',
        workMode: WorkMode.HYBRID,
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        skills: ['SIEM', 'Incident Response', 'Threat Hunting', 'Splunk', 'Network Analysis'],
        salaryMin: 350000,
        salaryMax: 600000,
        salaryCurrency: 'NGN',
        isActive: true,
        featured: true,
      },
      {
        title: 'Penetration Tester',
        slug: 'penetration-tester-remote-africa',
        company: 'CyberShield Africa (DEMO)',
        description: 'DEMO JOB: We are hiring penetration testers to join our growing team. You will conduct web application, network, and cloud penetration tests for clients across Africa.',
        location: 'Remote (Africa)',
        region: 'Africa',
        workMode: WorkMode.REMOTE,
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        skills: ['Penetration Testing', 'Burp Suite', 'Metasploit', 'Python', 'OSCP'],
        isActive: true,
        featured: true,
      },
      {
        title: 'Cybersecurity Intern',
        slug: 'cybersecurity-intern-abuja',
        company: 'Nigerian Communications Commission (DEMO)',
        description: 'DEMO JOB: Paid internship opportunity for cybersecurity students at the Nigerian Communications Commission. Gain exposure to national cybersecurity policy and operations.',
        location: 'Abuja, Nigeria',
        country: 'Nigeria',
        region: 'Africa',
        workMode: WorkMode.ONSITE,
        jobType: JobType.INTERNSHIP,
        experienceLevel: ExperienceLevel.ENTRY,
        skills: ['Networking', 'Linux', 'Security Fundamentals'],
        isActive: true,
        featured: false,
      },
      {
        title: 'Cloud Security Engineer',
        slug: 'cloud-security-engineer-remote',
        company: 'TechAfrique (DEMO)',
        description: 'DEMO JOB: We are seeking a Cloud Security Engineer to design, implement, and maintain cloud security controls across our AWS and Azure infrastructure.',
        location: 'Remote (Global)',
        workMode: WorkMode.REMOTE,
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.SENIOR,
        skills: ['AWS Security', 'Azure Security', 'Terraform', 'DevSecOps', 'CSPM'],
        isActive: true,
        featured: false,
      },
    ],
  })

  console.log('✅ Jobs created')

  // ============================================================
  // NEWSLETTER SUBSCRIBERS
  // ============================================================
  await db.newsletterSubscriber.createMany({
    skipDuplicates: true,
    data: [
      { email: 'subscriber1@example.com', confirmedAt: daysAgo(30), subNews: true, subThreatIntel: true },
      { email: 'subscriber2@example.com', confirmedAt: daysAgo(20), subNews: true, subVulns: true },
      { email: 'subscriber3@example.com', confirmedAt: daysAgo(10), subNews: true, subTutorials: true, subCareers: true },
      { email: regularUser.email, userId: regularUser.id, confirmedAt: daysAgo(5), subNews: true },
    ],
  })

  console.log('✅ Newsletter subscribers created')

  // ============================================================
  // COURSES (Phase 3 scaffold)
  // ============================================================
  const course = await db.course.upsert({
    where: { slug: 'soc-analyst-fundamentals' },
    update: {},
    create: {
      title: 'SOC Analyst Fundamentals',
      slug: 'soc-analyst-fundamentals',
      description: 'A comprehensive course for aspiring SOC analysts covering log analysis, SIEM, alert triage, and incident response fundamentals.',
      difficulty: DifficultyLevel.BEGINNER,
      duration: 900, // 15 hours
      status: CourseStatus.PUBLISHED,
      featured: true,
      modules: {
        create: [
          {
            title: 'Introduction to Security Operations',
            order: 1,
            lessons: {
              create: [
                { title: 'What is a SOC?', content: 'A Security Operations Centre (SOC) is...', order: 1, duration: 15 },
                { title: 'SOC Tiers and Roles', content: 'SOCs are typically structured in tiers...', order: 2, duration: 20 },
                { title: 'The Incident Response Lifecycle', content: 'The incident response lifecycle consists of...', order: 3, duration: 25 },
              ],
            },
          },
          {
            title: 'Log Analysis Fundamentals',
            order: 2,
            lessons: {
              create: [
                { title: 'Understanding Log Formats', content: 'Logs come in many formats...', order: 1, duration: 30 },
                { title: 'Windows Event Logs', content: 'Windows generates numerous event log types...', order: 2, duration: 35 },
                { title: 'Linux Syslog', content: 'Linux logging is centralised through syslog...', order: 3, duration: 30 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Course created')

  // ============================================================
  // LABS
  // ============================================================
  await db.lab.upsert({
    where: { slug: 'sql-injection-basics' },
    update: {},
    create: {
      title: 'SQL Injection: Basics',
      slug: 'sql-injection-basics',
      description: 'Practice SQL injection techniques in a safe, isolated environment. Learn to identify and exploit classic SQL injection vulnerabilities.',
      difficulty: LabDifficulty.EASY,
      objectives: [
        'Identify SQL injection points in a web application',
        'Perform a basic UNION-based SQL injection',
        'Extract database version and table names',
        'Retrieve user credentials from the database',
      ],
      duration: 60,
      points: 100,
      category: 'Web Security',
      featured: true,
    },
  })

  await db.lab.upsert({
    where: { slug: 'windows-privilege-escalation' },
    update: {},
    create: {
      title: 'Windows Privilege Escalation',
      slug: 'windows-privilege-escalation',
      description: 'Explore common Windows privilege escalation techniques including service misconfigurations, unquoted service paths, and token impersonation.',
      difficulty: LabDifficulty.MEDIUM,
      objectives: [
        'Identify privilege escalation vectors using WinPEAS',
        'Exploit an unquoted service path',
        'Achieve SYSTEM privileges via token impersonation',
        'Clean up traces after privilege escalation',
      ],
      duration: 90,
      points: 200,
      category: 'Penetration Testing',
      featured: true,
    },
  })

  console.log('✅ Labs created')

  // ============================================================
  // COMMENTS
  // ============================================================
  if (createdArticles.length > 0) {
    const firstArticleId = createdArticles[0]
    const parent = await db.comment.create({
      data: {
        content: 'Excellent breakdown! The section on time-based blind injection is particularly well explained. One thing to add: SQLMAP is also a great tool for automated detection during legitimate assessments.',
        articleId: firstArticleId,
        authorId: regularUser.id,
        isApproved: true,
        likeCount: 12,
      },
    })

    await db.comment.create({
      data: {
        content: 'Great point! SQLMAP is definitely worth mentioning. I\'ll add a note about it in a future update. Thanks for the feedback!',
        articleId: firstArticleId,
        authorId: author1.id,
        parentId: parent.id,
        isApproved: true,
        likeCount: 5,
      },
    })

    await db.comment.create({
      data: {
        content: 'This is exactly the type of content I\'ve been looking for. Clear, practical, and well-structured. Looking forward to more tutorials!',
        articleId: firstArticleId,
        authorId: regularUser.id,
        isApproved: true,
        likeCount: 8,
      },
    })
  }

  console.log('✅ Comments created')

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  await db.notification.create({
    data: {
      recipientId: author1.id,
      senderId: superAdmin.id,
      type: 'ARTICLE_APPROVED',
      title: 'Article Approved',
      message: 'Your article "The Complete Guide to SQL Injection in 2026" has been approved and published.',
      link: '/articles/complete-guide-sql-injection-2026',
    },
  })

  await db.notification.create({
    data: {
      recipientId: regularUser.id,
      senderId: author1.id,
      type: 'COMMENT_REPLY',
      title: 'Reply to your comment',
      message: 'Emeka Adeyemi replied to your comment on "The Complete Guide to SQL Injection in 2026".',
      link: '/articles/complete-guide-sql-injection-2026',
    },
  })

  console.log('✅ Notifications created')

  // ============================================================
  // AUDIT LOGS
  // ============================================================
  await db.auditLog.createMany({
    data: [
      { userId: superAdmin.id, action: 'LOGIN', resource: 'auth' },
      { userId: editor.id, action: 'LOGIN', resource: 'auth' },
      { userId: author1.id, action: 'ARTICLE_PUBLISHED', resource: 'article', resourceId: createdArticles[0] },
      { userId: superAdmin.id, action: 'SETTINGS_CHANGED', resource: 'settings', metadata: { key: 'siteName', value: 'CyberPulse' } },
    ],
  })

  console.log('✅ Audit logs created')

  console.log('\n🎉 Database seeding complete!')
  console.log('\n📋 Demo Accounts:')
  console.log('   Super Admin: admin@cyberpulse.io / CyberPulse2026!')
  console.log('   Editor:      editor@cyberpulse.io / CyberPulse2026!')
  console.log('   Author 1:    author1@cyberpulse.io / CyberPulse2026!')
  console.log('   Author 2:    author2@cyberpulse.io / CyberPulse2026!')
  console.log('   User:        user@cyberpulse.io / CyberPulse2026!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
