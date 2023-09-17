import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';
import Link from 'next/link';
const ScribeForm = dynamic(() => import('../components/ScribeForm'), {
  ssr: false,
});

const Upload: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Snowcap - upload</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Link className={styles.back} href="/">&larr;</Link>{'   Upload'}
        </h1>
        <ScribeForm />
      </main>
    </div>
  )
}

export default Upload