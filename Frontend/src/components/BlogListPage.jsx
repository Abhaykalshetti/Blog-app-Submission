import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditorPage from './EditorPage';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs', {
        headers: { Authorization: token }
      });
      setBlogs(res.data);
    } catch (err) {
      toast.error('Failed to load blogs');
    }
  };

  const handleSearchByTitle = () => {
    const query = searchTitle.trim().toLowerCase();
    if (!query) {
      setFilteredBlogs([]);
      return;
    }

    const matched = blogs.filter(blog =>
      blog.title.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      toast.error('No blogs found with that title');
    }

    setFilteredBlogs(matched);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (editBlog) return <EditorPage initialBlog={editBlog} />;

  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : blogs;

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Search Blog by Title</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Enter Blog Title"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSearchByTitle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Drafts</h2>
        <div className="grid gap-4">
          {displayBlogs.filter(blog => blog.status === 'draft').map(blog => (
            <div key={blog._id} className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-yellow-800">{blog.title}</h4>
                </div>
                <div className="text-right text-sm text-gray-700">
                  <p>Created: {formatDate(blog.created_at)}</p>
                  <p>Updated: {formatDate(blog.updated_at)}</p>
                </div>
              </div>
              <button
                onClick={() => setEditBlog(blog)}
                className="mt-2 px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Published</h2>
        <div className="grid gap-4">
          {displayBlogs.filter(blog => blog.status === 'published').map(blog => (
            <div key={blog._id} className="p-4 border border-green-300 bg-green-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-green-800">{blog.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{blog.content.slice(0, 100)}...</p>
                </div>
                <div className="text-right text-sm text-gray-700">
                  <p>Created: {formatDate(blog.created_at)}</p>
                  <p>Updated: {formatDate(blog.updated_at)}</p>
                </div>
              </div>
              <button
                onClick={() => setEditBlog(blog)}
                className="mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
