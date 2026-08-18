import { Suspense } from "react";
import CatalogPage from "./ui";

export default function Page() {
  return (
    <Suspense fallback={<div className="px-8 py-20">Загрузка каталога...</div>}>
      <CatalogPage />
    </Suspense>
  );
}
