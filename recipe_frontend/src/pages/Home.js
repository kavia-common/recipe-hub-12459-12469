import React, { useEffect, useMemo, useState } from "react";
import { listRecipes } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import "../components/recipes.css";
import { useToast } from "../components/Toast";
import NoteTitleRecommender from "../components/NoteTitleRecommender";

/**
 * Home/Browse page with search and pagination.
 */
export default function Home() {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  // Note title recommender state
  const [showRecommender, setShowRecommender] = useState(false);
  const onUseRecommendedTitle = (title) => {
    // Provide quick feedback; on Home page we don’t have a title field to fill
    notify({ type: "success", message: `Suggested title: "${title}" copied.` });
    try {
      navigator.clipboard?.writeText(title);
    } catch {
      // ignore
    }
  };

  const skip = useMemo(() => (page - 1) * pageSize, [page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listRecipes({ q: term, skip, limit: pageSize });
      setRecipes(Array.isArray(data) ? data : []);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, page]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const next = q.trim();
    setTerm(next);
    if (next) {
      notify({ type: "info", message: `Searching for "${next}"...`, duration: 1500 });
    }
  };

  const onFavChange = () => {
    // no-op; backend doesn't return favorite state in list; local UI only
  };

  const isEnd = recipes.length < pageSize;

  // Global event to open the recommender from Navbar
  useEffect(() => {
    const handler = () => setShowRecommender(true);
    window.addEventListener("open-note-title-recommender", handler);
    return () => window.removeEventListener("open-note-title-recommender", handler);
  }, []);

  return (
    <div className="page">
      <form className="filters" onSubmit={onSearch}>
        <input
          placeholder="Search recipes by title or ingredient..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}><span className="spinner" /> Loading...</p>
      ) : (
        <>
          <div className="grid">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} onFavoritedChanged={onFavChange} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} onPageChange={setPage} isEnd={isEnd} />
        </>
      )}
      {/* Quick access to Note Title Recommender */}
      <div style={{ position: "fixed", right: 16, bottom: 156, zIndex: 15 }}>
        <button className="btn outline" onClick={() => setShowRecommender(true)} title="Open Note Title Recommender">
          ✨ Recommend Title
        </button>
      </div>
      <NoteTitleRecommender
        open={showRecommender}
        onClose={() => setShowRecommender(false)}
        onUseTitle={onUseRecommendedTitle}
        initialContent=""
      />
    </div>
  );
}
