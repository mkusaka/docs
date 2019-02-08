module.exports = {
  title: 'docs',
  description: 'documents place',
  dest: 'docs',
  base: '/docs/',
  serviceWorker: true,
  markdown: {
    // options for markdown-it-anchor
    anchor: {
      permalink: false
    },
    // options for markdown-it-toc
    toc: {
      includeLevel: [1, 2]
    },
    extendMarkdown: md => {
      // use more markdown-it plugins!
      md.use(require('markdown-it'))
    }
  },
  themeConfig: {
    sidebar: {
      '/': [
        ''
      ],
      '/Database/': [
        ''
      ],
      '/Languages/': [
        ''
      ]
    },
    displayAllHeaders: true
  }
}
