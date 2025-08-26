import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Red Dragon',
  tagline: 'Cross-chain ERC-20 compatible token with Chainlink VRF',
  favicon: 'img/favicon-32x32.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.omnidragon.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'omnidragon-io', // GitHub org/user
  projectName: 'docs', // Repo name
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/omnidragon-io/docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/red-dragon-social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    announcementBar: {
      id: 'relaunch',
      content:
        'Red Dragon will relaunch soon! Join our <a target="_blank" rel="noopener noreferrer" href="https://t.me/SonicRedDragon">Telegram</a> for updates.',
      backgroundColor: '#ff4757',
      textColor: '#fff',
      isCloseable: true,
    },
    navbar: {
      title: 'Red Dragon',
      logo: {
        alt: 'Red Dragon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Concepts',
        },
        {
          to: '/integrations/frontend-integrations',
          position: 'left',
          label: 'Frontend',
        },
        {
          href: 'https://github.com/omnidragon-io/docs',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://t.me/SonicRedDragon',
          label: 'Telegram',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Red Dragon',
          items: [
             {
              label: 'Documentation',
              to: '/integrations/frontend-integrations',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/omnidragon-io/docs',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/SonicRedDragon',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Red Dragon. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
