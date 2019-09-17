#!/usr/bin/env node

require('../dist/cli/index.js').run()
  .catch((error) => {
    require('consola').fatal(error)
    process.exit(2)
  })
