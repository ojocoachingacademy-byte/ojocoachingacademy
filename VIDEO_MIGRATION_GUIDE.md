# Video Migration Guide - Save Netlify Bandwidth Credits

## Problem
Your video file (`coach-tobi-training.mp4`) is being served directly from Netlify, which consumes bandwidth credits. With 232/300 credits used in one day, you need to reduce usage.

## Solution: Move Video to YouTube

### Step 1: Upload Video to YouTube
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click "Create" → "Upload video"
3. Select your `coach-tobi-training.mp4` file
4. Set video to **Unlisted** (so only people with the link can see it, but it won't appear in search)
   - Or set to **Public** if you want it searchable
5. Fill in title: "Coach Tobi Tennis Training - Ojo Coaching Academy"
6. Add description and tags for SEO
7. Click "Publish"

### Step 2: Get YouTube Video ID
After uploading, YouTube will give you a URL like:
- `https://www.youtube.com/watch?v=ABC123XYZ`
- Or: `https://youtu.be/ABC123XYZ`

The **VIDEO_ID** is the part after `v=` or after `youtu.be/` (e.g., `ABC123XYZ`)

### Step 3: Update Website Code
1. Open `index.html`
2. Find the line: `src="https://www.youtube.com/embed/VIDEO_ID"`
3. Replace `VIDEO_ID` with your actual YouTube video ID
4. Save the file

### Step 4: Remove Video File from Netlify (Optional but Recommended)
1. Delete `coach-tobi-training.mp4` from your project folder
2. Commit and push to GitHub
3. This prevents accidental re-uploads and saves storage

### Step 5: Verify
- Visit your website
- Check that the video plays from YouTube
- Verify it's responsive on mobile devices

## Benefits
✅ **Free unlimited bandwidth** - YouTube hosts videos for free  
✅ **Better performance** - YouTube's CDN is faster than Netlify for videos  
✅ **SEO benefits** - YouTube videos can appear in Google search results  
✅ **Analytics** - YouTube provides video view statistics  
✅ **Mobile optimized** - YouTube automatically optimizes for different devices  

## Alternative: Other Video Hosting Options
- **Vimeo** - Similar to YouTube, professional option
- **Cloudflare Stream** - Paid but very fast
- **AWS S3 + CloudFront** - For advanced users

## Important Notes
- **Credits already used cannot be refunded** - But this prevents future usage
- The video will still work on your website via YouTube embed
- YouTube embeds are free and don't count against Netlify bandwidth
- You can make the video unlisted so it's not publicly searchable on YouTube

