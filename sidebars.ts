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
  // Concepts-focused sidebar
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        { type: 'doc', id: 'concepts/overview', label: 'Overview' },
        { type: 'doc', id: 'omnidragon-project-status', label: 'System Status' },
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      items: [
        { type: 'doc', id: 'guides/quickstart', label: 'Quick Start' },
        { type: 'doc', id: 'integrations/sonic-frontend-integration', label: 'Frontend' },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        { type: 'doc', id: 'deployments/overview', label: 'Architecture & Deployments' },
        { type: 'doc', id: 'reference/addresses', label: 'Addresses (Sonic)' },
      ],
    },
  ],
};

export default sidebars;
