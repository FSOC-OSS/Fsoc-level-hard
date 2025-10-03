const gradientMap = {
    danger: "from-rose-500 via-purple-600 to-indigo-700",
    warning: "from-amber-400 via-orange-500 to-rose-500",
    info: "from-sky-500 via-indigo-500 to-purple-600",
    success: "from-emerald-500 via-teal-500 to-cyan-500",
};

const ErrorLayout = ({
    title,
    description,
    illustration,
    children,
    tone = "danger",
}) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br ${gradientMap[tone]} flex items-center justify-center p-4`}>
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                    {illustration && <div className="mb-6 text-5xl" aria-hidden>{illustration}</div>}
                    <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-4 text-lg font-medium text-white/80">
                            {description}
                        </p>
                    )}
                    {children && <div className="mt-8 w-full">{children}</div>}
                </div>
            </div>
        </div>
    );
};

export default ErrorLayout;
