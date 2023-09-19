import '../styles/home.css'
// import NowPlaying from '@/components/NowPlaying'
import { lazy } from 'react'

const NowPlaying = lazy(()=>import('@/components/NowPlaying'))

export default function Home() {
  return (
    <main>
      <div className="now-playing">
        <NowPlaying />
      </div>
      <div className="trending">

      </div>
    </main>
  )
}
