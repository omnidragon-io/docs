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
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      items: [
        { type: 'doc', id: 'integrations/frontend-integrations', label: 'Frontend' },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        { type: 'doc', id: 'deployments/overview', label: 'Architecture & Deployments' },
        {
          type: 'category',
          label: 'Oracle',
          collapsed: false,
          items: [
            { type: 'doc', id: 'oracle/overview', label: 'Overview' },
            { type: 'doc', id: 'oracle/configuration', label: 'Configuration' },
            { type: 'doc', id: 'oracle/technical-reference', label: 'Technical Reference' },
            { type: 'doc', id: 'oracle/gpt-guide', label: 'Integration Guide' },
          ],
        },
        {
          type: 'category',
          label: 'Registry',
          collapsed: false,
          items: [
            { type: 'doc', id: 'registry/overview', label: 'Overview' },
            { type: 'doc', id: 'registry/configuration', label: 'Configuration' },
            { type: 'doc', id: 'registry/technical-reference', label: 'Technical Reference' },
          ],
        },
        {
          type: 'category',
          label: 'VRF',
          collapsed: false,
          items: [
            { type: 'doc', id: 'vrf/overview', label: 'Overview' },
            { type: 'doc', id: 'vrf/configuration', label: 'Configuration' },
            { type: 'doc', id: 'vrf/technical-reference', label: 'Technical Reference' },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Legal',
      collapsed: false,
      items: [
        { type: 'doc', id: 'legal/terms-of-service', label: 'Terms of Service' },
        { type: 'doc', id: 'legal/privacy-policy', label: 'Privacy Policy' },
      ],
    },
  ],
};

export default sidebars;
