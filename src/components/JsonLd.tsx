/**
 * Renders a JSON-LD block. Kept as one component so escaping is handled in a
 * single place — a stray `<` inside a description would otherwise break out of
 * the script tag.
 */
export default function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
