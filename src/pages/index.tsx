import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Red Dragon
          </Heading>
          <p className={styles.heroSubtitle}>
            Next-Generation Cross-Chain Protocol
          </p>
          <p className={styles.heroDescription}>
            Revolutionary ERC-20 compatible token protocol built on LayerZero V2, 
            delivering secure cross-chain functionality with cryptographically 
            verifiable randomness through Chainlink VRF integration.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <strong>5+</strong>
              <span>Supported Chains</span>
            </div>
            <div className={styles.statItem}>
              <strong>100%</strong>
              <span>Verifiable</span>
            </div>
            <div className={styles.statItem}>
              <strong>24/7</strong>
              <span>Active Protocol</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <Link
              className={styles.primaryButton}
              to="/intro">
              Explore Documentation
            </Link>
            <Link
              className={styles.secondaryButton}
              href="https://github.com/wenakita/reddragon">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Built for the Future of DeFi
        </Heading>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Cross-Chain Architecture</h3>
            <p>
              Seamless token transfers across Sonic, Ethereum, Arbitrum, Base, 
              and Avalanche networks powered by LayerZero V2 infrastructure.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Verifiable Randomness</h3>
            <p>
              Cryptographically secure randomness through Chainlink VRF integration, 
              ensuring transparent and fair lottery mechanisms.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Enterprise Security</h3>
            <p>
              Multi-layered protection with emergency controls, audited smart contracts, 
              and role-based access control for maximum security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageCallToAction() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to Build the Future?
          </Heading>
          <p className={styles.ctaDescription}>
            Join the Red Dragon ecosystem and start building with our comprehensive 
            documentation, developer tools, and community support.
          </p>
          <div className={styles.ctaActions}>
            <Link
              className={styles.primaryButton}
              to="/concepts/overview">
              Start Building
            </Link>
            <Link
              className={styles.secondaryButton}
              href="https://t.me/RedDragon">
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Next-Generation Cross-Chain Protocol`}
      description="Red Dragon is a revolutionary ERC-20 compatible token protocol built on LayerZero V2 with verifiable randomness through Chainlink VRF integration.">
      <HomepageHero />
      <main>
        <HomepageFeatures />
        <HomepageCallToAction />
      </main>
    </Layout>
  );
}
