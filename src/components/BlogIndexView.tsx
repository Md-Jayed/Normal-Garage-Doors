import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Tag, Search, PhoneCall, ShieldCheck } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { getAllPosts, getAllCategories } from '../lib/blog';
import { BlogPost } from '../types';

interface BlogIndexViewProps {
  onNavigate: (path: string) => void;
}

export default function BlogIndexView({ onNavigate }: BlogIndexViewProps) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs paths={[{ label: 'Blog' }]} onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 md:py-16 px-4 md:px-6 relative overflow-hidden border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block text-xs md:text-sm font-black text-amber-400 uppercase tracking-widest bg-amber-950/70 px-3 py-1.5 rounded-full border border-amber-800/50 mb-4">
            ★ Overhead Door Repair & Maintenance Guides ★
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Normal Garage Door Repair Blog
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Expert troubleshooting advice, seasonal maintenance checklists, and safety guidelines for homeowners in Normal, Bloomington, and McLean County, IL.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
        {/* Search & Category Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Articles ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Featured Banner Post (If no active filters) */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-blue-300 transition-all">
            <div className="lg:col-span-7 aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.featuredImageAlt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-blue-900 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                Featured Guide
              </span>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {featuredPost.date}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 text-xs md:text-sm mt-3 line-clamp-3 leading-relaxed">
                {featuredPost.description}
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  {featuredPost.author}
                </span>
                <button
                  onClick={() => onNavigate(`blog/${featuredPost.slug}`)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer border border-amber-600"
                >
                  Read Full Guide
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                onClick={() => onNavigate(`blog/${post.slug}`)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col cursor-pointer group"
              >
                {/* Article Image */}
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md backdrop-blur-xs tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-grow flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {post.date}
                      </span>
                      {post.updatedDate && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">Updated {post.updatedDate}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-black text-slate-900 group-hover:text-blue-900 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-xs mt-2.5 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="text-slate-500 text-[11px] font-normal flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Article &rarr;
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-8">
            <h3 className="text-lg font-bold text-slate-800">No Articles Found</h3>
            <p className="text-slate-500 text-xs mt-2">
              Try adjusting your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* CTA Banner at Bottom */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 my-16 shadow-xl border-l-8 border-amber-500 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Need Professional Hands-On Repair?
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Having Overhead Garage Door Troubles in Normal, IL?
            </h3>
            <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed max-w-2xl">
              Don't risk injury with high-tension springs or heavy doors. Our local certified technicians are available 24/7 with fully loaded service vehicles.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <a
              href="tel:3095558240"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 px-6 rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-amber-600"
            >
              <PhoneCall className="w-4 h-4 fill-current animate-pulse" />
              CALL NOW: (309) 555-8240
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl text-xs text-center border border-blue-700 transition-colors cursor-pointer"
            >
              Request Free On-Site Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
