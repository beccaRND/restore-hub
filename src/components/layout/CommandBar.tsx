import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, BookOpen, Loader2 } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import type { Funder } from '../../types/funder';
import { processQuery, type QueryResult } from '../../lib/queryEngine';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: FarmProject[];
  funders: Funder[];
}

const SUGGESTIONS_BY_PAGE: Record<string, string[]> = {
  '/': [
    'How many projects are we managing across all states?',
    "What's the total carbon estimate across all projects?",
    'Show me a grant deployment summary',
    'Which practices are most common?',
  ],
  '/projects': [
    'How many projects in Colorado right now?',
    'Show me all compost application projects over 50 acres',
    'What is the project availability breakdown?',
    'Which practices are most common in California?',
  ],
  '/stories': [
    "Generate an impact summary for Bob's Red Mill",
    'How much have all corporate partners contributed?',
    'Show me Tillamook partnership details',
    'List all corporate partners',
  ],
  '/fund': [
    'How much has been deployed in grants?',
    'What is the average grant size?',
    'Show grant breakdown by fund source',
    'How many projects have buyer interest?',
  ],
  '/compost': [
    'Show me all compost application projects',
    "What's the carbon impact of compost projects?",
    'How many acres use compost application?',
    'Which states have the most compost projects?',
  ],
  '/grants': [
    'Show me the current grant round status',
    'How much has been deployed vs requested?',
    'What is the average grant size by state?',
    'Which fund sources have the most projects?',
  ],
};

const DEFAULT_SUGGESTIONS = [
  'How many projects are we managing across all states?',
  "What's the total carbon estimate across all projects?",
  'Show me all compost application projects over 50 acres',
  "Generate an impact summary for Bob's Red Mill",
  'Which practices are most common in California?',
];

export default function CommandBar({ isOpen, onClose, projects, funders }: CommandBarProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const suggestions = SUGGESTIONS_BY_PAGE[basePath] || DEFAULT_SUGGESTIONS;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResult(null);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        if (result) {
          setResult(null);
          setQuery('');
        } else {
          onClose();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, result]);

  const executeQuery = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setIsProcessing(true);
      setResult(null);

      // Simulate slight delay for realism (would be network call to KOI MCP)
      setTimeout(() => {
        const res = processQuery(q, projects, funders);
        setResult(res);
        setIsProcessing(false);
        setRecentQueries((prev) => {
          const next = [q, ...prev.filter((x) => x !== q)].slice(0, 5);
          return next;
        });
      }, 400);
    },
    [projects, funders]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    executeQuery(suggestion);
  };

  const handleAction = (action: string) => {
    if (action.startsWith('/')) {
      navigate(action);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(26, 26, 26, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Command bar modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-[680px] px-4"
          >
            <div
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: 'var(--zfp-white)',
                boxShadow: 'var(--shadow-modal)',
                maxHeight: '70vh',
              }}
            >
              {/* Search input */}
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
                  {isProcessing ? (
                    <Loader2 size={20} strokeWidth={1.75} className="animate-spin" style={{ color: 'var(--zfp-green)' }} />
                  ) : (
                    <Search size={20} strokeWidth={1.75} style={{ color: 'var(--zfp-text-muted)' }} />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (result) setResult(null);
                    }}
                    placeholder="Ask anything about ZFP projects, funders, or carbon data..."
                    className="flex-1 text-base bg-transparent outline-none placeholder:text-[var(--zfp-text-light)]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--zfp-text)' }}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => { setQuery(''); setResult(null); }}
                      className="p-1 rounded-md hover:bg-[var(--zfp-cream-dark)] transition-colors"
                      style={{ color: 'var(--zfp-text-muted)' }}
                    >
                      <X size={16} strokeWidth={1.75} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: 'var(--zfp-border-strong)',
                      backgroundColor: 'var(--zfp-cream)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--zfp-text-muted)',
                    }}
                  >
                    ESC
                  </button>
                </div>
              </form>

              {/* Content area */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 64px)' }}>
                {/* Result display */}
                {result && (
                  <div className="px-5 py-4">
                    <div className="mb-3">
                      <MarkdownContent content={result.answer} />
                    </div>

                    {/* Sources */}
                    {result.sources.length > 0 && (
                      <p className="text-[11px] mb-3" style={{ color: 'var(--zfp-text-light)' }}>
                        Sources: {result.sources.join(', ')}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: 'var(--zfp-border)' }}>
                      {result.suggestedActions?.map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleAction(action.action)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--zfp-green-pale)]"
                          style={{
                            backgroundColor: 'var(--zfp-cream)',
                            color: 'var(--zfp-green)',
                            border: '1px solid var(--zfp-green-light)',
                          }}
                        >
                          <BookOpen size={12} strokeWidth={1.75} />
                          {action.label}
                        </button>
                      ))}
                      <button
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--zfp-cream-dark)]"
                        style={{
                          backgroundColor: 'var(--zfp-cream)',
                          color: 'var(--zfp-text-muted)',
                          border: '1px solid var(--zfp-border)',
                        }}
                      >
                        <FileText size={12} strokeWidth={1.75} />
                        Export
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggestions when no query */}
                {!query && !result && (
                  <div className="px-3 py-3">
                    {/* Recent queries */}
                    {recentQueries.length > 0 && (
                      <>
                        <p
                          className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                          style={{ color: 'var(--zfp-text-light)' }}
                        >
                          Recent
                        </p>
                        {recentQueries.slice(0, 3).map((q) => (
                          <SuggestionRow key={q} text={q} onClick={() => handleSuggestionClick(q)} />
                        ))}
                        <div className="h-px my-2" style={{ backgroundColor: 'var(--zfp-border)' }} />
                      </>
                    )}

                    <p
                      className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--zfp-text-light)' }}
                    >
                      Suggested
                    </p>
                    {suggestions.map((suggestion) => (
                      <SuggestionRow
                        key={suggestion}
                        text={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      />
                    ))}
                  </div>
                )}

                {/* Loading state */}
                {isProcessing && (
                  <div className="px-5 py-8 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: 'var(--zfp-green)' }} />
                    <p className="text-sm" style={{ color: 'var(--zfp-text-muted)' }}>
                      Searching across ZFP data...
                    </p>
                  </div>
                )}

                {/* Typed query but no result yet (haven't pressed Enter) */}
                {query && !result && !isProcessing && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm" style={{ color: 'var(--zfp-text-muted)' }}>
                      Press <kbd className="px-1.5 py-0.5 rounded border text-[11px]" style={{ borderColor: 'var(--zfp-border-strong)', fontFamily: 'var(--font-mono)' }}>Enter</kbd> to search
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-2.5 flex items-center justify-between border-t"
                style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
              >
                <span className="text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                  Powered by Regen KOI
                </span>
                <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--zfp-text-light)' }}>
                  <span><kbd className="font-mono">Enter</kbd> to search</span>
                  <span><kbd className="font-mono">Esc</kbd> to close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SuggestionRow({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-[var(--zfp-cream)]"
      style={{ color: 'var(--zfp-text)' }}
    >
      <ArrowRight size={13} strokeWidth={1.75} className="flex-shrink-0" style={{ color: 'var(--zfp-text-light)' }} />
      <span className="text-sm">{text}</span>
    </button>
  );
}

// Simple markdown renderer for bold and lists
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        // Headers
        if (line.startsWith('**') && line.endsWith('**') && !line.includes('- **')) {
          return (
            <p
              key={i}
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}
            >
              {stripBold(line)}
            </p>
          );
        }

        // List items
        if (line.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 text-sm pl-1" style={{ color: 'var(--zfp-text)' }}>
              <span style={{ color: 'var(--zfp-green)' }}>-</span>
              <span dangerouslySetInnerHTML={{ __html: parseBold(line.slice(2)) }} />
            </div>
          );
        }

        // Italic
        if (line.startsWith('*') && line.endsWith('*')) {
          return (
            <p key={i} className="text-xs italic" style={{ color: 'var(--zfp-text-light)' }}>
              {line.replace(/^\*|\*$/g, '')}
            </p>
          );
        }

        // Regular text
        return (
          <p
            key={i}
            className="text-sm"
            style={{ color: 'var(--zfp-text)' }}
            dangerouslySetInnerHTML={{ __html: parseBold(line) }}
          />
        );
      })}
    </div>
  );
}

function stripBold(text: string): string {
  return text.replace(/\*\*/g, '');
}

function parseBold(text: string): string {
  return text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="font-weight:600;color:var(--zfp-text)">$1</strong>'
  );
}
