import { AppProps } from 'next/app';
import Head from 'next/head';
import { NavBar, NavLink } from '@cb-common/ui-tailwind';
import './styles.css';
import Footer from '../components/footer';

/* ---------------------------- Define navigation items ---------------------------- */
const navItems: NavLink[] = [
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
  { label: 'Projects', href: 'projects' },
  {
    label: 'Resume',
    href: 'SoftwareEngineer_Charles_Brady_Resume.pdf',
    target: '_blank',
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to Charles Brady's portfolio site!</title>
      </Head>
      <main className="app">
        <NavBar brandName={'Charles Brady'} links={navItems} />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
