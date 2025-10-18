import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layout/layout";
import { CatalogProvider } from "./context/CatalogContext";
import { fetchShopifyProductsPaged } from "./api/shopify";
import { HeroSkeleton, ProductCardSkeleton, Skeleton} from "./components/prefix/Skeleton";



const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const ContactPage = lazy(() => import("./pages/Contact/Contact"));
const AboutPage = lazy(() => import("./pages/About/About"));
const CustomePage = lazy(() => import("./pages/CustomePage/CustomePage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage/ProductDetailsPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const SearchResults = lazy(() => import("./pages/SearchResults/SearchResults"));
const Contact = lazy(() => import("./pages/policies/Contact"));
const Exchange = lazy(() => import("./pages/policies/Exchange"));
const Privacy = lazy(() => import("./pages/policies/Privacy"));
const Terms = lazy(() => import("./pages/policies/Terms"));
const Shipping = lazy(() => import("./pages/policies/Shipping"));
const Legal = lazy(() => import("./pages/policies/Legal"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const NewsletterPage = lazy(() => import("./pages/NewsletterPage/NewsletterPage"));

function loadCatalog() {
  const pageSize = 100;
  let after = null;
  let items = [];
  return (async () => {
    for (let i = 0; i < 3; i++) {
      const { items: page, hasNextPage, endCursor } =
        await fetchShopifyProductsPaged(pageSize, after);
      items = items.concat(page);
      if (!hasNextPage) break;
      after = endCursor;
    }
    return items;
  })();
}

function GridSkeleton(n = 8) {
  return (
    <section className="ske-grid">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="ske-card">
          <Skeleton className="ske-card-img" />
          <Skeleton className="h12 w70 mt8" />
          <Skeleton className="h10 w40 mt6" />
        </div>
      ))}
    </section>
  );
}

function TextSkeleton() {
  return (
    <section style={{ padding: 24 }}>
      <Skeleton className="h24 w60 mb12" />
      <Skeleton className="h14 w80 mb8" />
      <Skeleton className="h14 w50 mb8" />
      <Skeleton className="h10 w40" />
    </section>
  );
}

export default function App() {
  return (
    <CatalogProvider loader={loadCatalog}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<><HeroSkeleton /><GridSkeleton /></>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/custom"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <CustomePage />
              </Suspense>
            }
          />
          <Route
            path="/newsletter"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <NewsletterPage />
              </Suspense>
            }
          />
          <Route
            path="/products"
            element={
              <Suspense fallback={<GridSkeleton />}>
                <ProductPage />
              </Suspense>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <ProductDetailsPage />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<GridSkeleton />}>
                <SearchResults />
              </Suspense>
            }
          />

          <Route
            path="/policies/privacy"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <Privacy />
              </Suspense>
            }
          />
          <Route
            path="/policies/terms"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <Terms />
              </Suspense>
            }
          />
          <Route
            path="/policies/shipping"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <Shipping />
              </Suspense>
            }
          />
          <Route
            path="/policies/exchange"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <Exchange />
              </Suspense>
            }
          />
          <Route
            path="/policies/legal"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <Legal />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<TextSkeleton />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </CatalogProvider>
  );
}
