import Head from "next/head";

export default function SEO({ title, description, type = "website" }) {
  const siteName = "World Cup Hub";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const image = siteUrl
    ? `${siteUrl}/assets/logo.png`
    : "/assets/logo.png";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="theme-color" content="#b5122b" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/assets/icon-192.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
