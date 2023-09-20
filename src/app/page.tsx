import '../styles/home.css'
// import NowPlaying from '@/components/NowPlaying'
import { lazy } from 'react'

const NowPlaying = lazy(()=>import('@/components/NowPlaying'))
const Trending = lazy(()=>import('@/components/Trending'))

export default function Home() {
  return (
    <main>
      <div className="now-playing">
        <NowPlaying />
      </div>
      <div className="trending">
        <Trending />
      </div>
    </main>
  )
}
