import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  ["Learn", "/learn"], ["Paths", "/paths"], ["Discover", "/discover"], ["Radar", "/radar"],
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="upbranch">
      <a className="ub-skip" href="#main-content">Skip to content</a>
      <header className="ub-header">
        <div className="ub-header-inner">
          <Link className="ub-logo" href="/" aria-label="Upbranch home"><span className="ub-logo-mark" aria-hidden="true">✳</span> upbranch<span className="ub-logo-dot">.</span></Link>
          <nav className="ub-desktop-nav" aria-label="Main navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
          <Link className="ub-nav-cta" href="/learn/first-agent">Start learning <span aria-hidden="true">↗</span></Link>
          <details className="ub-mobile-nav"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label} <span aria-hidden="true">↗</span></Link>)}<Link href="/labs">Labs <span aria-hidden="true">↗</span></Link><Link href="/studio">Studio <span aria-hidden="true">↗</span></Link><Link href="/learn/first-agent">Start learning <span aria-hidden="true">↗</span></Link></nav></details>
        </div>
      </header>
      {children}
      <footer className="ub-footer">
        <div className="ub-footer-top"><div><Link className="ub-logo ub-footer-logo" href="/"><span className="ub-logo-mark" aria-hidden="true">✳</span> upbranch<span className="ub-logo-dot">.</span></Link><p>Learn AI. Build what&apos;s next.</p></div><div className="ub-footer-links"><div><span>EXPLORE</span><Link href="/learn">Learn</Link><Link href="/paths">Paths</Link><Link href="/discover">Discover</Link><Link href="/radar">Radar</Link></div><div><span>GO FURTHER</span><Link href="/labs">Labs</Link><Link href="/studio">Studio</Link><Link href="/dashboard">Developer security ↗</Link></div></div></div>
        <div className="ub-footer-bottom"><span>Made for the curious, the careful, and the builders.</span><span>LEARN / PRACTICE / BUILD</span></div>
      </footer>
    </div>
  );
}
