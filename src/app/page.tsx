import Image from 'next/image'
import styles from './page.module.css'
import '../styles/home.css'
import RatingIcon from '@/components/RatingIcon'
import NowPlaying from '@/components/NowPlaying'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="now-playing">
        <NowPlaying />
      </div>
      <div className="trending">
        
      </div>
    </main>
  )
}
