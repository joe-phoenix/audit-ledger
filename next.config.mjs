// Set BASE_PATH when the site is served from a sub-path, e.g. "/audit-ledger" on GitHub Pages.
const basePath = process.env.BASE_PATH || "";

/** Static export: the whole site is plain files, hostable on GitHub Pages / Netlify / Vercel. */
export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
