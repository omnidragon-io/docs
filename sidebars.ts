import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Red Dragon documentation sidebar - simplified structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        { type: 'doc', id: 'guides/quickstart', label: 'Quick Start' },
      ],
    },
    {
      type: 'category',
      label: 'Frontend',
      collapsed: false,
      items: [
        { type: 'doc', id: 'integrations/sonic-frontend-integration', label: 'Overview' },
        { type: 'link', label: 'Setup (viem client)', href: '/docs/integrations/sonic-frontend-integration#viem-client-and-helpers-ready-to-paste' },
        { type: 'link', label: 'Network & Addresses', href: '/docs/integrations/sonic-frontend-integration#network' },
        { type: 'link', label: 'Price & Oracle', href: '/docs/integrations/sonic-frontend-integration#price-and-oracle' },
        { type: 'link', label: 'Lottery', href: '/docs/integrations/sonic-frontend-integration#lottery-omnidragonlotterymanager' },
        { type: 'link', label: 'Boost', href: '/docs/integrations/sonic-frontend-integration#boost-system-vedragonboostmanager' },
        { type: 'link', label: 'Partners & Gauges', href: '/docs/integrations/sonic-frontend-integration#partner-registry-and-gauges' },
        { type: 'link', label: 'Bribes', href: '/docs/integrations/sonic-frontend-integration#bribes-partnerbribedistributor' },
        { type: 'link', label: 'Revenue Distributor', href: '/docs/integrations/sonic-frontend-integration#vedragonrevenuedistributor' },
        { type: 'link', label: 'OFT Send (ethers.js)', href: '/docs/integrations/sonic-frontend-integration#minimal-oft-send-ethers-js' },
        { type: 'link', label: 'OFT Send (Foundry)', href: '/docs/integrations/sonic-frontend-integration#minimal-oft-send-foundry' },
        { type: 'link', label: 'Display helpers', href: '/docs/integrations/sonic-frontend-integration#display-helpers' },
      ],
    },
    { type: 'doc', id: 'omnidragon-project-status', label: 'Current Status' },
    { type: 'doc', id: 'contracts/overview', label: 'Contracts' },
  ],
};

export default sidebars;
