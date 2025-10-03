import { useNavigate } from "react-router-dom";
import ErrorLayout from "./ErrorLayout";

const popularLinks = [
    { label: "Home", path: "/" },
    { label: "Quiz Categories", path: "/" },
    { label: "Badges", path: "/badges" },
    { label: "Bookmarked Questions", path: "/bookmarks" },
];

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <ErrorLayout
            tone="warning"
            title="Oops! Page not found"
            description="The page you're looking for flew the coop. Let's help you get back on track."
            illustration={<span role="img" aria-label="astronaut">🧑‍🚀</span>}
        >
            <div className="flex flex-col gap-6">
                <div className="rounded-2xl bg-white/10 p-6 shadow-inner">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            const query = new FormData(event.currentTarget).get("query");
                            if (query) {
                                navigate(`/?search=${encodeURIComponent(query)}`);
                            }
                        }}
                        className="flex flex-col gap-4 md:flex-row"
                    >
                        <input
                            name="query"
                            type="search"
                            placeholder="Search for quizzes, categories, or badges"
                            className="w-full rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white placeholder-white/60 backdrop-blur-md focus:border-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                        Popular destinations
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {popularLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-left font-semibold text-white transition hover:-translate-y-[2px] hover:bg-white/20"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-medium text-white/80">
                        Think this link should work? Let us know so we can fix it.
                    </p>
                    <div className="flex flex-col gap-3 md:flex-row">
                        <button
                            onClick={() => navigate("/")}
                            className="rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
                        >
                            Go Home
                        </button>
                        <button
                            onClick={() =>
                                window.open(
                                    "https://github.com/FSOC-OSS/Fsoc-level-hard/issues/new?labels=bug&title=Broken+link+report",
                                    "_blank",
                                )
                            }
                            className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400"
                        >
                            Report broken link
                        </button>
                    </div>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default NotFoundPage;
