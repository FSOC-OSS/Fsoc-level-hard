import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const { sessionId, questionNumber } = useParams();

  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = [];
  let pathAcc = "";
  segments.forEach((seg, idx) => {
    pathAcc += `/${seg}`;
    crumbs.push({
      label: seg === "quiz" ? "Quiz" : seg === "setup" ? "Setup" : seg === "active" ? "Active" : seg === "results" ? "Results" : seg,
      path: pathAcc,
      isLast: idx === segments.length - 1,
    });
  });

  // Enhance labels
  const enhanced = crumbs.map(c => {
    if (c.label === sessionId) return { ...c, label: "Session" };
    if (c.label === questionNumber) return { ...c, label: `Q${questionNumber}` };
    return c;
  });

  if (enhanced.length === 0) return null;

  return (
    <div className="bg-purple-50 border-b border-purple-100 text-sm text-purple-800 px-4 py-2">
      <nav className="max-w-7xl mx-auto" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link className="hover:underline" to="/">Home</Link>
          </li>
          {enhanced.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>/</span>
              {c.isLast ? (
                <span className="font-medium">{c.label}</span>
              ) : (
                <Link className="hover:underline" to={c.path}>{c.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
