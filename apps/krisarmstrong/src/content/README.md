# Content Management Guide

This directory contains all the editable content for your portfolio site. You can easily update content without touching the source code!

## Directory Structure

```
src/content/
├── projects/
│   └── projects.json          # Your portfolio projects
├── blog/
│   ├── blog-posts.json        # Blog post metadata
│   └── *.md                   # Blog post content (markdown)
├── testimonials/
│   └── testimonials.json      # Client testimonials
└── certifications/
    └── certifications.json    # Your certifications (coming soon)
```

## How to Add/Edit Content

### Adding a New Project

Edit `src/content/projects/projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Name",
  "description": "Brief description of the project",
  "link": "https://project-url.com",
  "featured": true,
  "tags": ["React", "TypeScript", "API"]
}
```

### Adding a New Blog Post

1. **Add metadata** to `src/content/blog/blog-posts.json`:
```json
{
  "id": "my-new-post",
  "title": "My Awesome Blog Post",
  "excerpt": "A brief summary...",
  "date": "2024-11-11",
  "author": "Kris Armstrong",
  "tags": ["Networking", "Tutorial"],
  "featured": true,
  "contentFile": "my-new-post.md"
}
```

2. **Create the content file** at `src/content/blog/my-new-post.md`:
```markdown
# My Awesome Blog Post

Your content here in Markdown format...

## Headings work
- Lists work
- **Bold** and *italic* work

[Links work too](https://example.com)
```

### Adding a Testimonial

Edit `src/content/testimonials/testimonials.json`:

```json
{
  "id": "unique-person-id",
  "name": "Full Name",
  "quote": "Their testimonial quote here",
  "avatar": "https://url-to-image.jpg",
  "company": "Company Name",
  "position": "Job Title"
}
```

## Benefits of This Approach

✅ **No code changes needed** - Just edit JSON/Markdown files
✅ **Version controlled** - All content changes are tracked in git
✅ **Easy to backup** - Simple file-based system
✅ **Portable** - Can migrate to a CMS later if needed
✅ **Fast** - No database queries, content bundled at build time

## Tips

- Keep IDs lowercase with dashes (e.g., `my-project-name`)
- Use ISO date format for dates: `YYYY-MM-DD`
- Keep file names matching their IDs for consistency
- Images can be stored in `src/assets/` or use external URLs
- Test your changes with `npm run dev`

## Future Enhancements

Consider adding:
- Markdown frontmatter support
- Image optimization
- CMS integration (Contentful, Sanity, etc.)
- MDX for interactive content
- Search functionality
