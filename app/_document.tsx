import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
 render() {
    return (
      <Html>
        <Head>
          <meta name="google-site-verification" content="jkaE8_ZMCGWXWIGC6qZ1Qzf9jiF3ZUFfrUDlaf2sAKs" />
          {/* Add other meta tags or link tags here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
 }
}

export default MyDocument;