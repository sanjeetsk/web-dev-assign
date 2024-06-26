// PostsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Table, Select, Input } from 'antd';
import queryString from 'query-string';

const { Content } = Layout;
const { Option } = Select;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const { skip, limit } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parse skip and limit from URL params, use defaults if not present
        const skipParam = parseInt(skip) || 0;
        const limitParam = parseInt(limit) || 10;
        const response = await fetch(`https://dummyjson.com/posts?skip=${skipParam}&limit=${limitParam}`);
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [skip, limit]);

  useEffect(() => {
    const params = queryString.parse(search);
    if (params.page) setPagination({ ...pagination, current: parseInt(params.page) });
    if (params.filters) setFilters(params.filters.split(','));
    if (params.searchQuery) setSearchQuery(params.searchQuery);
  }, [search]);

  const handlePaginationChange = (page) => {
    setPagination({ ...pagination, current: page });
    navigate(`/?page=${page}&filters=${filters.join(',')}&searchQuery=${searchQuery}`);
  };

  const handleFilterChange = (values) => {
    setFilters(values);
    navigate(`/?page=${pagination.current}&filters=${values.join(',')}&searchQuery=${searchQuery}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    navigate(`/?page=${pagination.current}&filters=${filters.join(',')}&searchQuery=${e.target.value}`);
  };

  const filteredPosts = posts.filter(post => {
    // Filter by tags
    const tagFilter = filters.length === 0 || filters.every(filter => post.tags.includes(filter));
    // Filter by search query
    const searchFilter = searchQuery === '' || post.body.toLowerCase().includes(searchQuery.toLowerCase());
    return tagFilter && searchFilter;
  });

  return (
    <Content>
      <Select
        mode="multiple"
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Select tags"
        onChange={handleFilterChange}
        value={filters}
      >
        {/* Options for tags */}
      </Select>
      <Input
        placeholder="Search posts"
        onChange={handleSearch}
        value={searchQuery}
        style={{ marginBottom: '1rem' }}
      />
      <Table
        dataSource={filteredPosts}
        pagination={{ ...pagination, total: filteredPosts.length }}
        onChange={handlePaginationChange}
        rowKey="id"
      // Columns for table
      />
    </Content>
  );
};

export default PostsPage;
