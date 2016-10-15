#/bin/bash
babel core/ --out-dir build/
babel main.js -o main-build.js --presets es2015