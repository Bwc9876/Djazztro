#!/usr/bin/env node

import("./dist/main.js").catch(console.error).then(({main}) => main());
