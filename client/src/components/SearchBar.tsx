import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

type SearchResult = {
  id: number;
  title: string;
  description?: string;
  subject?: string;
  type: "Course" | "Lesson";
};

function SearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await api.get("/api/search", {
          params: { q: trimmedQuery },
        });

        const courses: SearchResult[] = (res.data.courses || []).map(
          (course: any) => ({
            ...course,
            type: "Course",
          }),
        );

        const lessons: SearchResult[] = (res.data.lessons || []).map(
          (lesson: any) => ({
            ...lesson,
            type: "Lesson",
          }),
        );

        setResults([...courses, ...lessons]);
        setOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.type === "Course" ? `/course/${result.id}` : `/lesson/${result.id}`);
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-white/80 px-4 py-3 shadow-xl shadow-slate-950/5 backdrop-blur transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/15 dark:bg-white/6">
        <Search className="text-muted-foreground" size={18} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search courses and lessons..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {loading && <Loader2 className="animate-spin text-blue-500" size={18} />}
      </div>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-14 z-40 max-h-80 overflow-y-auto rounded-3xl border border-border bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur dark:bg-slate-950/95"
        >
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="flex w-full items-center justify-between gap-4 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-primary/8"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {result.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {result.description || result.subject || "Open result"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                  {result.type}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No matching courses or lessons found.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default SearchBar;
