import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, User, Clock, PhoneCall, ArrowLeft, ArrowRight, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { getPostBySlug, getRelatedPosts } from '../lib/blog';
import { servicesData } from '../data/servicesData';

interface BlogPostViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function BlogPostView({ slug, onNavigate }: BlogPostViewProps) {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="bg-slate-50 min-h-screen font-sans py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Article Not Found</h1>
          <p className="text-slate-600 text-xs mt-3">
            The blog post you requested does not exist or may have been moved.
          </p>
          <button
            onClick={() => onNavigate('blog')}
            className="mt-6 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </button>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  // Custom component mapping for ReactMarkdown to handle custom link routing and custom styles
  const MarkdownComponents = {
    a: ({ href, children }: any) => {
      const isInternal = href && (href.startsWith('/') || !href.startsWith('http'));
      if (isInternal) {
        const route = href.replace(/^\//, '');
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(route);
            }}
            className="text-blue-900 font-bold underline hover:text-amber-600 transition-colors cursor-pointer"
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 font-bold underline hover:text-amber-600 transition-colors"
        >
          {children}
        </a>
      );
    },
    h2: ({ children }: any) => (
      <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2.5 tracking-tight flex items-center gap-2">
        <span className="w-2 h-6 bg-amber-500 rounded-full inline-block shrink-0"></span>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-6 mb-3 tracking-tight">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-slate-700 text-sm md:text-base leading-relaxed my-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="my-4 space-y-2 text-slate-700 text-sm md:text-base pl-2">
        {children}
      </ul>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-4 border-amber-500 bg-amber-50/70 p-4 rounded-r-2xl text-slate-800 italic text-sm md:text-base shadow-xs">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-slate-200" />,
  };

  return (
    <article className="bg-slate-50 min-h-screen font-sans pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        paths={[
          { label: 'Blog', route: 'blog' },
          { label: post.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Main Post Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('blog')}
          className="text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors flex items-center gap-1.5 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Index
        </button>

        {/* Article Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm mb-8 text-left">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mb-4">
            <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-amber-200">
              <Tag className="w-3 h-3 text-amber-700" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published: {post.date}
            </span>
            {post.updatedDate && (
              <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                Updated: {post.updatedDate}
              </span>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author & Reading Info */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                NG
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{post.author}</span>
                <span className="text-[10px] text-slate-400 block">Licensed Garage Door Specialist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md mb-10">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full max-h-[480px] object-cover object-center"
            loading="eager"
          />
          {post.featuredImageAlt && (
            <p className="text-[11px] text-slate-400 p-2.5 text-center bg-slate-50 border-t border-slate-100 italic">
              {post.featuredImageAlt}
            </p>
          )}
        </div>

        {/* Article Body Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm mb-12 text-left">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 my-10 shadow-xl border-l-8 border-amber-500 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                24/7 Normal, IL Service Dispatch
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Need Help With Your Garage Door?
              </h3>
              <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl">
                Our local technicians are standing by in Normal and McLean County. Get fast, reliable service and upfront pricing today.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href="tel:3095558240"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-6 rounded-xl text-center text-sm shadow transition-all flex items-center justify-center gap-2 border border-amber-600"
              >
                <PhoneCall className="w-4 h-4 fill-current" />
                (309) 555-8240
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs text-center border border-blue-700 transition-colors cursor-pointer"
              >
                Schedule Free Estimate
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="my-12 text-left">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-900 rounded-full inline-block"></span>
              Related Articles & Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => onNavigate(`blog/${rel.slug}`)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col group p-4"
                >
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit mb-2">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {rel.description}
                  </p>
                  <span className="text-blue-900 text-xs font-bold mt-3 block">
                    Read More &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
