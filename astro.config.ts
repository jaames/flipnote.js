import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export default defineConfig({
  site: 'https://flipnote.js.org',
  publicDir: './www/public',
  srcDir: './www/src',
  outDir: './www/dist',
  integrations: [
    starlight({
      title: 'Flipnote.js',
      logo: {
        light: './www/src/assets/logo_light.svg',
        dark: './www/src/assets/logo_dark.svg',
        replacesTitle: true,
      },
      customCss: [
        // Relative path to your custom CSS file
        './www/src/styles/theme.css',
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
            {
              label: 'GitHub', 
              link: 'https://github.com/jaames/flipnote.js'
            },
            {
              label: 'Flipnote Player',
              link: 'https://flipnote.rakujira.jp',
              attrs: {
                target: '_blank'
              },
            },
            {
              label: 'Flipnote Studio Docs',
              link: 'https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki',
              attrs: {
                target: '_blank'
              },
            },
            {
              label: 'Flipnote Studio 3D Docs',
              link: 'https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki',
              attrs: {
                target: '_blank'
              },
            },
          ],
        },
        {
          label: 'Follow me',
          items: [
            {
              label: 'Website',
              link: 'https://jamesdaniel.dev',
              attrs: {
                target: '_blank'
              }
            },
            {
              label: 'GitHub',
              link: 'https://github.com/jaames',
              attrs: {
                target: '_blank'
              }
            },
            {
              label: 'Bluesky',
              link: 'https://bsky.app/profile/jaames.co.uk',
              attrs: {
                target: '_blank'
              }
            },
            // {
            //   label: 'Mastodon',
            //   link: 'https://mastodon.gamedev.place/@jaames',
            //   attrs: {
            //     target: '_blank'
            //   }
            // },
          ],
        },
      ],
      plugins: [
        starlightTypeDoc({
          tsconfig: './tsconfig.json',
          entryPoints: [
            './src/flipnote.webcomponent.ts',
          ],
          output: 'api',
          // watch: true,
          sidebar: {
            collapsed: true,
            label: 'API (auto-generated)',
          },
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
            // https://typedoc-plugin-markdown.org/docs/options/display-options#tablecolumnsettings
            parametersFormat: 'table',
            enumMembersFormat: 'table',
            interfacePropertiesFormat: 'table',
            propertyMembersFormat: 'table',
            typeDeclarationVisibility: 'compact',
            tableColumnSettings: {
              hideDefaults: false,
              hideInherited: false,
              hideModifiers: false,
              hideOverrides: false,
              hideSources: true,
              hideValues: false,
              leftAlignHeaders: true
            }
          }
        }),
      ],
    }),
  ],
});