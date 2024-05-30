import Header from '@/components/Header'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/store/provider';
import {Suspense} from "react";
import Spinner from "react-bootstrap/Spinner";
import { ViewTransitions } from 'next-view-transitions'
import {ToastContainer} from "react-toastify";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { CookiesProvider } from 'next-client-cookies/server';
import 'react-toastify/dist/ReactToastify.css';
import App from "@/app/App";
import {NavigationBlockerProvider} from "@/components/Blocker";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nerdflicks',
  description: 'Cùng bạn xem phim.',
}

const Loading = () => {
  return <Spinner animation="grow" />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <CookiesProvider>
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <title>Nerdflicks</title>
          <link rel="icon" href="https://icons8.com/icon/XPEgm3Fx2rpW/netflix" sizes="any" />
          <link rel="preconnect" href="https://api.themoviedb.org" />
          {/*<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">*/}
          <link rel="dns-prefetch" href="https://api.themoviedb.org" />
          <link rel="preconnect" href="https://image.tmdb.org" />
          <link rel="dns-prefetch" href="https://image.tmdb.org" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css"
          />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
          <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch&family=Dancing+Script:wght@600&family=Space+Grotesk:wght@600&family=Fjalla+One&family=Bebas+Neue&family=Montserrat:wght@600&display=swap" rel="stylesheet" />
        </head>
        <body className={inter.className}>
        <NavigationBlockerProvider>
          <Suspense fallback={<Loading></Loading>}>
            <Providers>
              <Header></Header>
              <GoogleOAuthProvider clientId={'597403208777-feq6em3ni4f0cg1vbg45t6c9qstonffe.apps.googleusercontent.com'}>
                <App>
                  {children}
                </App>
              </GoogleOAuthProvider>
            </Providers>
            <ToastContainer
                style={{zIndex: '1000000000000'}}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
          </Suspense>
        </NavigationBlockerProvider>
        </body>
      </html>
    </ViewTransitions>
      </CookiesProvider>
  )
}
