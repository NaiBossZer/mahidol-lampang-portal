import { Link } from "react-router-dom";

interface PublicPageHeaderProps {
  title: string;
  subtitle: string;
}

export function PublicPageHeader({ title, subtitle }: PublicPageHeaderProps) {
  return (
    <header className="bg-[#123B63] text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <Link
          to="/"
          className="text-xs font-semibold text-[#D6A84F] transition-colors hover:text-white hover:underline"
        >
          ← กลับหน้าหลัก
        </Link>
        <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">{subtitle}</p>
      </div>
    </header>
  );
}
