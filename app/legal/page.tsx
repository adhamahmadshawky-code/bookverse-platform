import { books } from "@/lib/catalog";
export const metadata = { title: "Sources & reading rights" };
export default function Page() {
  return (
    <article className="container section prose">
      <p className="eyebrow gold">READ RESPONSIBLY</p>
      <h1 className="page-title">Sources & reading rights</h1>
      <h2>A catalog is not a download license.</h2>
      <p>
        Search results come from Open Library. Catalog entries may describe
        copyrighted books. Bookverse does not host or distribute those books,
        and does not promise a preview. Availability links lead to the source.
      </p>
      <h2>The classics collection</h2>
      <p>
        The six bundled English texts come from Project Gutenberg’s GITenberg
        mirrors. They are public domain in the United States. Copyright laws
        vary by country. Check the law where you are before using a text. All
        original text files retain their full source license. Downloading a text
        also downloads that license.
      </p>
      <p>
        This eBook is for the use of anyone anywhere in the United States and
        most other parts of the world at no cost and with almost no restrictions
        whatsoever. You may copy it, give it away or re-use it under the terms
        of the{" "}
        <a href="https://www.gutenberg.org/policy/license.html">
          Project Gutenberg License
        </a>{" "}
        included with this eBook or online at www.gutenberg.org. If you are not
        located in the United States, you’ll have to check the laws of the
        country where you are located before using this ebook.
      </p>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <a href={`https://www.gutenberg.org/ebooks/${b.gutenbergId}`}>
              {b.title}, {b.author}
            </a>
          </li>
        ))}
      </ul>
      <h2>Metadata & covers</h2>
      <p>
        Open Library metadata and cover images are retrieved from{" "}
        <a href="https://openlibrary.org/developers/api">Open Library APIs</a>.
        The classics collection uses original typographic covers. Edition page
        counts are approximate and vary. No invented user ratings or live
        trending statistics are displayed.
      </p>
      <h2>Your information</h2>
      <p>
        Guest reading data is stored in this browser. Signed-in accounts use
        Supabase for authentication and private bookshelf sync. Public reviews
        are visible to other readers, without your email address. Newsletter
        subscriptions store your email address. You can unsubscribe in account
        settings. Your data is not sold by this application. Contact the
        deployment operator for account or data deletion; configure a support
        contact before public launch.
      </p>
      <h2>Formats</h2>
      <p>
        The built-in reader supports plain text. Verified source pages offer
        EPUB and other formats where available. Embedded EPUB/PDF rendering is
        not included.
      </p>
    </article>
  );
}
