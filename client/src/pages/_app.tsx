import { NavBar } from "@/components/components.common/Navbar";
import { EffectorNext } from "@effector/next";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import type { AppProps } from "next/app";
import './global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <EffectorNext values={pageProps.values}>
      <AppCacheProvider {...pageProps}>
          <NavBar />
          <Component {...pageProps} />
      </AppCacheProvider>
    </EffectorNext>
  </>
}
