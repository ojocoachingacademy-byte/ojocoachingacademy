# Review Approval Guide

## How to Approve and Add Reviews to the Website

When a student submits a review through the review form, you'll receive it via Netlify Forms. Here's how to approve and add it to your website:

### Step 1: Receive the Review
- Reviews will appear in your Netlify dashboard under "Forms"
- You'll receive an email notification (if configured) with the review details
- The review will include:
  - Reviewer Name
  - Rating (1-5 stars)
  - Review Text
  - Email (optional)
  - Timestamp

### Step 2: Review the Submission
- Review the content for appropriateness
- Check that it's a legitimate review from a student
- Verify the rating and review text

### Step 3: Add Approved Review to Website

#### Option A: Add to Existing Testimonials Carousel

1. Open `index.html` in your code editor
2. Find the testimonials section (look for `<section id="testimonials"`)
3. Find the testimonials carousel track (look for `<div class="testimonials-track">`)
4. Add a new testimonial card before the closing `</div>` tag of the testimonials-track

Here's the template to use:

```html
<div class="testimonial-card">
    <div class="testimonial-header">
        <div class="testimonial-author">[REVIEWER_NAME]</div>
        <div class="testimonial-date">[TIME_AGO]</div>
    </div>
    <div class="testimonial-text">"[REVIEW_TEXT]"</div>
</div>
```

**Example:**
If you received a review from "John D." with 5 stars saying "Tobi is an amazing coach! My game improved significantly." and it was submitted 1 week ago:

```html
<div class="testimonial-card">
    <div class="testimonial-header">
        <div class="testimonial-author">John D.</div>
        <div class="testimonial-date">1 week ago</div>
    </div>
    <div class="testimonial-text">"Tobi is an amazing coach! My game improved significantly."</div>
</div>
```

#### Option B: Add to Floating Side Reviews

If you want the review to also appear in the floating side reviews:

1. Open `script.js`
2. Find the `testimonials` array in the "Floating Side Reviews" section
3. Add a new object to the array:

```javascript
const testimonials = [
    // ... existing reviews ...
    { text: '[SHORTENED_REVIEW_TEXT]', author: '[REVIEWER_NAME]' }
];
```

### Step 4: Update Review Count

After adding reviews, you may want to update the review count in the testimonials section:

1. In `index.html`, find: `5.0 ⭐ Rating with 40+ Reviews`
2. Update the number to reflect your new total (e.g., "41+ Reviews")

### Step 5: Commit and Push Changes

1. Save your changes
2. Commit to Git: `git add .` then `git commit -m "Add new review from [Reviewer Name]"`
3. Push to GitHub: `git push`
4. Netlify will automatically deploy the changes

### Tips for Time Stamps

When adding timestamps, use natural language relative to the current date:
- "Just now" (same day)
- "1 day ago" / "2 days ago"
- "1 week ago" / "2 weeks ago"
- "1 month ago" / "3 months ago"
- "6 months ago" / "1 year ago"

Mix up the timestamps naturally across your reviews to show ongoing engagement.

### Review Guidelines

Only approve reviews that:
- ✅ Are from actual students
- ✅ Are respectful and appropriate
- ✅ Provide genuine feedback
- ✅ Match the rating given

You can reject or ignore reviews that:
- ❌ Are spam or inappropriate
- ❌ Contain offensive language
- ❌ Are clearly not from actual students
- ❌ Don't align with your service quality

### Alternative: Manual Review Management

If you prefer, you can also:
1. Keep a spreadsheet of approved reviews with timestamps
2. Batch add multiple reviews at once
3. Update the website periodically with new reviews

---

**Need Help?** If you have questions about adding reviews, refer to the existing testimonial structure in `index.html` for reference.

