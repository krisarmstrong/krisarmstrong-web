# Adding Blog Posts

This guide explains how to add new blog posts to your portfolio website.

## Quick Start

Adding a blog post involves **just 1 step** - the metadata is auto-generated!

### 1. Create Your Markdown Content File

Create a new markdown file in `/src/content/blog/posts/` using this naming convention:

**Format:** `topic-keywords-MonthYear.md`

**Examples:**
- `wifi6-ofdma-mumimo-jan2024.md`
- `wifi7-mlo-multi-link-feb2025.md`
- `network-security-best-practices-mar2025.md`

```bash
touch src/content/blog/posts/my-topic-keywords-jan2025.md
```

Write your blog post in markdown format (metadata is auto-extracted!):

```markdown
# My Awesome Blog Post Title

Brief introduction paragraph...

## Section 1

Content here...

## Section 2

More content...

### Subsection

Even more content...

- Bullet point 1
- Bullet point 2

```code
// Code examples work too!
const example = "Hello World";
```

## Conclusion

Wrap it up here.
```

### 2. Run the Build

That's it! When you run `npm run build`, the metadata is automatically generated from your markdown file:

```bash
npm run build
```

Or manually regenerate metadata:

```bash
npm run blog:metadata
```

The script automatically:
- Extracts the title from your first `# Heading`
- Creates an excerpt from the first paragraph
- Parses the date from your filename (e.g., `jan2024` → `2024-01-15`)
- Generates appropriate tags based on keywords in the filename
- Marks January posts as "featured"
- Creates a URL-friendly ID

**No manual JSON editing required!**

## File Structure

```
src/content/blog/
├── README.md                    # This file
├── blog-posts.json             # Blog post metadata
└── posts/
    ├── phantom-pump.md         # Example post
    └── my-new-post.md          # Your new post
```

## Blog Post Best Practices

### Writing Tips

1. **Start with a hook** - Grab attention in the first paragraph
2. **Use clear headings** - Break content into logical sections
3. **Add code examples** - Show don't just tell
4. **Include real data** - Metrics, screenshots, results
5. **End with takeaways** - What should readers remember?

### Formatting

- Use `##` for main sections (renders as H2)
- Use `###` for subsections (renders as H3)
- Use code blocks with language tags: ` ```python `, ` ```javascript `
- Add images: `![Alt text](path/to/image.png)`
- Use bold for **emphasis**
- Use *italics* for _definitions_

### Tags

Choose from existing tags or create new ones:
- Case Study
- Wi-Fi
- Troubleshooting
- Security
- Network Design
- Python
- Automation
- Best Practices
- Tutorial

### URL Structure

Your blog post will be available at:
```
https://yoursite.com/blog/my-new-post
```

Where `my-new-post` is the `id` you specified in `blog-posts.json`.

## Example: Complete Blog Post

**File:** `/src/content/blog/posts/solving-channel-interference.md`

```markdown
# Solving Channel Interference in Enterprise Wi-Fi

Channel interference is one of the most common—and frustrating—issues in enterprise wireless networks. Here's how we solved it at a Fortune 500 client.

## The Problem

The client reported constant disconnections in their main conference room during peak hours. Initial site survey showed:

- Channel utilization: 78%
- Co-channel interference: High
- Adjacent channel interference: Moderate

## Investigation

We used NetAlly AirCheck G3 to analyze the RF environment...

## Solution

Implemented channel bonding and adjusted power levels...

## Results

- Channel utilization: 32%
- Zero disconnections over 30-day period
- User satisfaction: 95%

## Key Takeaways

1. Always start with proper RF analysis
2. Don't rely on auto-channel selection alone
3. Document everything
```

**Entry in `blog-posts.json`:**

```json
{
  "id": "solving-channel-interference",
  "title": "Solving Channel Interference in Enterprise Wi-Fi",
  "excerpt": "How we reduced channel utilization by 60% and eliminated disconnections in a Fortune 500 conference room.",
  "date": "2025-01-15",
  "author": "Kris Armstrong",
  "tags": ["Wi-Fi", "Troubleshooting", "Case Study", "Enterprise"],
  "featured": true,
  "contentFile": "solving-channel-interference.md"
}
```

## Troubleshooting

**Blog post not showing up?**
- Check that the `id` in JSON matches the URL you're visiting
- Verify `contentFile` name matches the actual file name
- Ensure JSON is valid (no trailing commas)
- Clear browser cache and rebuild: `npm run build`

**Markdown not rendering correctly?**
- Check for unclosed code blocks (` ``` `)
- Verify heading levels start with `##` not `#`
- Ensure proper spacing around lists and code blocks

**Search not finding post?**
- Add entry to `Search.tsx` as shown in step 3
- Rebuild project: `npm run build`

## Need Help?

Reach out if you need assistance adding your first blog post!
