import React, { useEffect, useMemo, useState } from "react";
import { listRecipes } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import "../components/recipes.css";

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
    setTerm(q.trim());
  };

  const onFavChange = () => {
    // no-op; backend doesn't return favorite state in list; local UI only
  };

  const isEnd = recipes.length < pageSize;

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
        <p style={{ textAlign: "center" }}>Loading...</p>
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
    </div>
  );
}
