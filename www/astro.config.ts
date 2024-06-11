import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Flipnote.js',
      logo: {
        light: './src/assets/logo_light.svg',
        dark: './src/assets/logo_dark.svg',
        replacesTitle: true,
      },
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/theme.css',
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/flipnote.webcomponent.min.js',
            defer: true,
          }
        }
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Overview', link: '/overview' },
            { label: 'Get Started', link: '/get-started' },
            { label: 'Web Components', link: '/web-components' },
            { label: 'Recipes', link: '/recipes' },
            { label: 'Acknowledgements', link: '/acknowledgements' },
          ],
        },
        typeDocSidebarGroup,
        {
          label: 'Links',
          items: [
            { label: 'GitHub', link: 'https://github.com/jaames/flipnote.js' },
            { label: 'Flipnote Studio Docs', link: 'https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki' },
            { label: 'Flipnote Studio 3D Docs', link: 'https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki' },
          ],
        },
        {
          label: 'Follow me',
          items: [
            { label: 'Twitter', link: 'https://twitter.com/rkgkjr' },
            { label: 'Bluesky', link: 'https://bsky.app/profile/jaames.co.uk' },
            { label: 'Mastodon', link: 'https://mastodon.gamedev.place/@jaames' },
          ],
        },
      ],
      plugins: [
        starlightTypeDoc({
          tsconfig: '../tsconfig.json',
          entryPoints: [
            '../src/flipnote.webcomponent.ts',
          ],
          // watch: true,
          sidebar: {
            collapsed: true,
            label: 'API (auto-generated)',
          },
          output: 'api',
          typeDoc: {
            watch: true,
            plugin: ['typedoc-plugin-mdn-links'],
            excludePrivate: true,
            excludeProtected: true,
            excludeInternal: true,
            categorizeByGroup: true,
            sortEntryPoints: false,
            sort: [
              'kind',
              'source-order',
              'static-first',
              'enum-value-descending',
            ],
            groupOrder: [
              // Builtin
              'Constructors',
              'Static',
              'Accessors',
              'Properties',
              'Methods',
              // Parser
              'Meta',
              'Image',
              'Audio',
              'Verification',
              'Utility',
              'Other',
              // Player
              'Lifecycle',
              'Playback Control',
              'Frame Control',
              'Display Control',
              'Audio Control',
              'Audio Control',
              'Event API',
              'Events',
              'HTMLVideoElement compatibility',
              '*'
            ],
            defaultCategory: 'Other',
          }
        }),
      ],
    }),
  ],
});