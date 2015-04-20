
#
# Task args.
#

PORT ?= 0
BROWSER ?= ie:9
TESTS = $(wildcard test/*.js)
SRC = $(wildcard src/*.coffee)
MINIFY = $(BINS)/uglifyjs
PID = test/server/pid.txt
BINS = node_modules/.bin
BUILD = build.js
DUO = $(BINS)/duo
DUOT = $(BINS)/duo-test -p test/server -R spec -P $(PORT) -c "make build.js"

#
# Default target.
#

default: gmodal.js
default: lib/index.js

#
# Clean.
#

clean:
	@rm -rf components $(BUILD)
	@rm -f gmodal.js gmodal.min.js
	@rm -rf lib
	@rm -rf node_modules npm-debug.log
#
# Test with phantomjs.
#

test: $(BUILD)
	@$(DUOT) phantomjs

#
# Test with saucelabs
#

test-sauce: $(BUILD)
	@$(DUOT) saucelabs \
		--browsers $(BROWSER) \
		--title lib/index.js

#
# Test in the browser.
#
# On the link press `cmd + doubleclick`.
#

test-browser: $(BUILD)
	@$(DUOT) browser

#
# Phony targets.
#

.PHONY: clean
.PHONY: test
.PHONY: test-browser
.PHONY: test-coverage
.PHONY: test-sauce

#
# Target for `gmodal.js` file.
#

gmodal.js: node_modules $(SRC)
	@$(DUO) --use duo-coffee src/index.coffee > gmodal.js
	@$(MINIFY) gmodal.js --output gmodal.min.js

#
# Target for `*.js` file.
#

lib/%.js: node_modules $(SRC)
	node_modules/coffee-script/bin/coffee --bare -c -o $(@D) $(patsubst lib/%,src/%,$(patsubst %.js,%.coffee,$@))
#
#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install

#
# Target for build files.
#

$(BUILD): $(TESTS) lib/index.js
	@$(DUO) --development test/tests.js > $(BUILD)

#
# Phony build target
#

build: build.js

.PHONY: build