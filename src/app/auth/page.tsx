import AuthPage from "@/components/AuthPage";

export default function Product() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black relative min-h-screen">
      {/* Background gradients - allow clicks to pass through */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none"></div>

      {/* Actual content - clickable */}
      <AuthPage />
    </div>
  );
}
