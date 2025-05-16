import express from 'express';
const router = express.Router();
import Blog from '../models/blog.js';
import authenticate from '../middleware/auth.js';

router.post('/save-draft', authenticate, async (req, res) => {
  const { id, title, content, tags } = req.body;
  const userId = req.user._id;

  try {
    let blog;

    if (id) {
      // Update existing draft
      blog = await Blog.findOneAndUpdate(
        { _id: id, user: userId },
        {
          title,
          content,
          tags,
          updated_at: new Date()
        },
        { new: true }
      );
    } else {
      // Check if user already has a draft (optional: depends on business logic)
      blog = await Blog.findOne({ user: userId, status: 'draft' });
      if (blog) {
        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        blog.updated_at = new Date();
        await blog.save();
      } else {
        blog = new Blog({
          user: userId,
          title,
          content,
          tags,
          status: 'draft',
          created_at: new Date(),
          updated_at: new Date()
        });
        await blog.save();
      }
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

router.post('/publish', authenticate, async (req, res) => {
  const { id, title, content, tags } = req.body;
  const userId = req.user._id;

  try {
    let blog;

    if (id) {
      // Update existing blog (likely a draft)
      blog = await Blog.findOneAndUpdate(
        { _id: id, user: userId },
        {
          title,
          content,
          tags,
          status: 'published',
          updated_at: new Date()
        },
        { new: true }
      );

      // Remove other drafts for the same user
      await Blog.deleteMany({
        user: userId,
        status: 'draft',
        _id: { $ne: id }
      });

    } else {
      // Create a new published blog
      blog = new Blog({
        user: userId,
        title,
        content,
        tags,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date()
      });

      await blog.save();

      // Remove all drafts by the user (since this is a fresh publish)
      await Blog.deleteMany({
        user: userId,
        status: 'draft'
      });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish blog' });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, user: req.user._id });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

export default router;
