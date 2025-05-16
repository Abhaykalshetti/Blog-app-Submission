import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';

export default function EditorPage({ initialBlog = null }) {
  const [form, setForm] = useState(initialBlog || { title: '', content: '', tags: '' });
  const [blogId, setBlogId] = useState(initialBlog?._id || null);
  const token = localStorage.getItem('token');
  const hasShownAutoSaveToast = useRef(false); // ⬅️ Track if toast has been shown

  useEffect(() => {
    if (initialBlog) {
      setForm({
        title: initialBlog.title,
        content: initialBlog.content,
        tags: initialBlog.tags.join(', '),
      });
    }
  }, [initialBlog]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    hasShownAutoSaveToast.current = false; // Reset on any change
    debouncedAutoSave();
  };

  const autoSave = async () => {
    try {
      const res = await axios.post('/api/blogs/save-draft', {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()),
        id: blogId
      }, {
        headers: { Authorization: token }
      });

      if (!blogId) setBlogId(res.data._id);

      if (!hasShownAutoSaveToast.current) {
        toast.success('Draft auto-saved');
        hasShownAutoSaveToast.current = true;
      }
    } catch (err) {
      toast.error('Auto-save failed');
    }
  };

  const debouncedAutoSave = useCallback(debounce(autoSave, 5000), [form]);

  const publish = async () => {
    try {
      const res = await axios.post('/api/blogs/publish', {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()),
        id: blogId
      }, {
        headers: { Authorization: token }
      });
      toast.success('Blog published!');
    } catch (err) {
      toast.error('Publish failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{blogId ? 'Edit Blog' : 'New Blog'}</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        rows="10"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <input
        name="tags"
        placeholder="Tags (comma-separated)"
        value={form.tags}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-4">
        <button
          onClick={autoSave}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Save Draft
        </button>
        <button
          onClick={publish}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
