# Content TODO - What Needs to Be Added

This guide lists all the content that needs to be filled in for your portfolio.

---

## 🔒 Security Note

**NEVER** add the following to public files:
- ❌ Personal email addresses
- ❌ Phone numbers
- ❌ Home addresses
- ❌ Any private/sensitive information

Instead:
- ✅ Use contact form (will be implemented)
- ✅ Link to LinkedIn/GitHub for professional contact
- ✅ Use professional social media only

---

## 📝 Content Checklist

### ✅ Already Have (Placeholders)
- [x] Basic project structure (2 projects)
- [x] Basic testimonials (2 testimonials)
- [x] Basic blog post (1 placeholder)
- [x] Basic certifications (4 certs)
- [x] Basic timeline (3 milestones)

### ❌ Need to Add/Update

#### 1. **Projects** (`src/content/projects/projects.json`)
**Current:** 2 placeholder projects
**Need:** Your actual portfolio projects

**Add projects like:**
- Network automation tools you've built
- Security projects
- Animation/video projects
- Consulting case studies (public ones)
- Open source contributions
- Technical writing/documentation

**Template:**
```json
{
  "id": "project-slug",
  "title": "Project Name",
  "description": "Brief 1-2 sentence description",
  "link": "https://github.com/... or project URL",
  "featured": true,
  "tags": ["React", "Python", "Networking", "Security"]
}
```

---

#### 2. **Blog Posts** (`src/content/blog/blog-posts.json`)
**Current:** 1 placeholder post
**Need:** Your actual technical articles

**Add posts about:**
- Network troubleshooting case studies
- Security insights
- Wireless best practices
- Animation tutorials
- Technical how-tos
- Industry commentary

**Template:**
```json
{
  "id": "post-slug",
  "title": "Article Title",
  "excerpt": "Brief summary (1-2 sentences)",
  "date": "2024-11-11",
  "author": "Kris Armstrong",
  "tags": ["Networking", "Tutorial", "Case Study"],
  "featured": true,
  "contentFile": "post-slug.md"
}
```

Then create `src/content/blog/post-slug.md` with full article content.

---

#### 3. **Testimonials** (`src/content/testimonials/testimonials.json`)
**Current:** 2 fake testimonials with random avatars
**Need:** Real testimonials from clients/colleagues

**How to get testimonials:**
1. Ask past clients for permission to use their feedback
2. Get LinkedIn recommendations
3. Ask colleagues for professional references
4. Get permission to use company names

**Template:**
```json
{
  "id": "person-slug",
  "name": "Full Name",
  "quote": "Their actual testimonial quote",
  "avatar": "https://url-to-professional-photo.jpg",
  "company": "Company Name",
  "position": "Their Job Title"
}
```

**Avatar options:**
- Use LinkedIn profile photos (with permission)
- Use professional headshots
- Use placeholder service: `https://ui-avatars.com/api/?name=First+Last&size=200`

---

#### 4. **Certifications** (`src/content/certifications/certifications.json`)
**Current:** 4 certifications (CWNA, CWDP, CWSP, CISSP)
**Need:** Complete list with details

**Add:**
- All your certifications
- Dates earned
- Credential IDs (if public)
- Links to verify

**Enhanced template:**
```json
{
  "id": "cert-slug",
  "name": "CWNA",
  "fullName": "Certified Wireless Network Administrator",
  "issuer": "CWNP",
  "dateEarned": "2020-05",
  "expiresDate": "2023-05",
  "credentialId": "12345",
  "verifyUrl": "https://verify-link.com",
  "logo": "/assets/certs/cwna-logo.png"
}
```

---

#### 5. **Timeline** (`src/components/Timeline.tsx`)
**Current:** 3 placeholder milestones
**Need:** Your actual career timeline

**Add milestones like:**
- Current role/business
- Major career changes
- Certifications earned
- Major projects launched
- Speaking engagements
- Publications

**Update the array in `src/components/Timeline.tsx`:**
```tsx
const items: TimelineItem[] = [
  {
    year: "2024",
    title: "Your milestone",
    desc: "What happened and why it matters",
  },
  // Add more...
];
```

---

#### 6. **Resume** (`src/assets/resume.md`)
**Current:** Needs to be created/updated
**Need:** Your full resume in Markdown format

**Structure:**
```markdown
# Kris Armstrong

## Professional Summary
Your 2-3 sentence summary

## Experience

### Job Title - Company Name
**Dates:** Month Year - Present
- Bullet point achievement
- Bullet point achievement

### Previous Job Title - Company
**Dates:** Month Year - Month Year
- Achievements
- Technologies used

## Education
- Degree, School, Year

## Certifications
- CWNA - CWNP - 2020
- CISSP - ISC2 - 2018

## Skills
- Wireless Networking: WiFi 6, 802.11ax, RF Design
- Security: Network Security, Penetration Testing
- Tools: Wireshark, NetAlly, Ekahau
```

---

#### 7. **About Page** (`src/pages/About.tsx`)
**Current:** Generic placeholder content
**Need:** Your actual bio and story

**Update the content sections:**
- Who you are (personalize the bio)
- What drives you (your real motivations)
- Key achievements (your actual accomplishments)

---

#### 8. **Home Page** (`src/pages/Home.tsx`)
**Current:** Generic feature cards
**Need:** Personalized descriptions

**Update the FeatureCard content:**
- Certifications card description
- Animations card description (what you actually do)
- Contact card description

---

## 📂 Recommended File Organization

### Add these directories (optional):
```
src/
  assets/
    images/
      projects/        # Project screenshots
      certs/          # Certification logos
      headshots/      # Professional photos
    videos/           # Animation demos
```

---

## 🎨 Media Assets Needed

### Images to Collect:
1. **Professional headshot** - For about page (not required but nice)
2. **Project screenshots** - For each portfolio project
3. **Certification badges** - Official logos (if you want to display them)
4. **Company logos** - For testimonials (with permission)

### Videos to Create (Optional):
1. **Demo reels** - Show your animation work
2. **Project walkthroughs** - Screen recordings
3. **Technical tutorials** - If you want video content

---

## 🔐 Contact Form Implementation

**Current:** Form doesn't actually send (demo only)
**Options for real implementation:**

### Option 1: Formspree (Easiest)
```tsx
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
- Sign up at https://formspree.io
- Free tier: 50 submissions/month
- No backend needed

### Option 2: Netlify Forms (If hosting on Netlify)
```tsx
<form name="contact" method="POST" data-netlify="true">
```
- Automatic form handling
- Free tier: 100 submissions/month

### Option 3: EmailJS (Client-side)
- Sends emails directly from browser
- Free tier: 200 emails/month
- https://www.emailjs.com/

### Option 4: Custom Backend (Most secure)
- Build API endpoint (Node.js/Python)
- Use SendGrid/AWS SES for email
- Full control but more work

**Recommended:** Start with Formspree - it's secure, easy, and free.

---

## 📋 Content Collection Workflow

### Step 1: Gather Existing Content
- [ ] Collect LinkedIn profile info
- [ ] Export resume from current source
- [ ] Find project URLs/repos
- [ ] Locate certification credentials
- [ ] Find testimonials/recommendations

### Step 2: Create New Content
- [ ] Write new blog posts
- [ ] Take project screenshots
- [ ] Request new testimonials
- [ ] Write compelling project descriptions
- [ ] Create professional bio

### Step 3: Update Files
- [ ] Update all JSON files in `src/content/`
- [ ] Create Markdown files for blog posts
- [ ] Update component files with real data
- [ ] Test that everything displays correctly

### Step 4: Review for Privacy
- [ ] Search for personal email addresses → Remove
- [ ] Search for phone numbers → Remove
- [ ] Check for private information → Remove
- [ ] Verify only professional links remain

---

## 🚀 Quick Start Guide

### To Add a Project:
1. Open `src/content/projects/projects.json`
2. Copy the template structure
3. Fill in your project details
4. Save and refresh the site

### To Add a Blog Post:
1. Add metadata to `src/content/blog/blog-posts.json`
2. Create `src/content/blog/your-post.md`
3. Write your content in Markdown
4. Save and refresh

### To Update Your Bio:
1. Open `src/pages/About.tsx`
2. Find the text content in the JSX
3. Replace with your real story
4. Save and refresh

---

## ✅ Priority Order

**Do these first:**
1. ✅ Remove all email addresses (DONE)
2. Add real projects (3-5 minimum)
3. Update About page with real bio
4. Add real certifications
5. Update resume.md

**Do these next:**
6. Get real testimonials (2-3 minimum)
7. Write 1-2 blog posts
8. Update timeline with real milestones
9. Collect project screenshots
10. Set up working contact form

**Nice to have:**
11. Add more blog posts
12. Add project demos/videos
13. Add certification badges
14. Create case studies
15. Add speaking engagements section

---

## 📧 Need Help?

Check these files:
- Content structure: `src/content/README.md`
- Migration guide: `MIGRATION_SUMMARY.md`
- TypeScript guide: `TYPESCRIPT_MIGRATION.md`

All content files are in `src/content/` - just edit the JSON files!
