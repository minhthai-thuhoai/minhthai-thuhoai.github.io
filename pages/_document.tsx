import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description"
            content="Đám cưới Minh Thái & Thu Hoài - 14.06.2026. Website lưu giữ những khoảnh khắc đẹp trong ngày cưới, câu chuyện tình yêu, album ảnh, video cưới và lời chúc phúc từ gia đình, bạn bè." />
          <meta property="og:site_name" content="Minh Thái & Thu Hoài Wedding" />
          <meta property="og:description"
            content="Đám cưới Minh Thái & Thu Hoài - 14.06.2026. Nơi lưu giữ câu chuyện tình yêu, khoảnh khắc ngày cưới, album ảnh, video cưới và những lời chúc phúc ý nghĩa." />
          <meta property="og:title" content="Đám cưới Minh Thái & Thu Hoài - 14.06.2026" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Đám cưới Minh Thái & Thu Hoài - 14.06.2026" />
          <meta name="twitter:description"
            content="Website lưu giữ những khoảnh khắc hạnh phúc trong ngày cưới của Minh Thái & Thu Hoài, cùng album ảnh, video cưới và lời chúc phúc từ gia đình, bạn bè." />
        </Head>
        <body className="bg-black antialiased" suppressHydrationWarning>
          <script
            dangerouslySetInnerHTML={{
              __html: `(() => {
  const attr = "bis_skin_checked";
  const selector = "[" + attr + "]";

  const scrub = (root) => {
    if (!root || !root.querySelectorAll) return;
    if (root.hasAttribute && root.hasAttribute(attr)) {
      root.removeAttribute(attr);
    }
    root.querySelectorAll(selector).forEach((el) => el.removeAttribute(attr));
  };

  scrub(document.documentElement);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === attr) {
        mutation.target.removeAttribute(attr);
      }
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            scrub(node);
          }
        });
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [attr],
  });

  window.addEventListener("load", () => {
    setTimeout(() => observer.disconnect(), 3000);
  });
})();`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
