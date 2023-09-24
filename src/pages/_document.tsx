import Document, { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => {
  return (
    <Html>
      <Head>
      </Head>
      <body style={{ background: "#D4D6FF !important", marginRight: "0 !important" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;