var concat = require("broccoli-concat");
var pickFiles = require("broccoli-static-compiler");
var mergeTrees = require("broccoli-merge-trees");
var less = require("broccoli-less-single");
var uglifyJs = require("broccoli-uglify-js");
var sprite = require("broccoli-sprite");

/* broccoli-less-single is not installed from its original location as we need less 1.7 */

var APP_NAME = "my-site";
var ENV_DEVELOPMENT = process.argv.indexOf("serve") >= 0;

/**
 * JavaScript
 */

var appJsFiles = pickFiles("app", {
	srcDir: "js",
	destDir: "/"
});

var jQueryJsFiles = pickFiles("bower_components", {
	srcDir: "jquery/dist",
	files: ["jquery.js"],
	destDir: "/"
});

/* Consider to import only needed js files */
var boostrapJsFiles = pickFiles("bower_components", {
	srcDir: "bootstrap/dist/js",
	files: ["bootstrap.js"],
	destDir: "/"
});

var jsFiles = mergeTrees([appJsFiles, jQueryJsFiles, boostrapJsFiles]);

if (ENV_DEVELOPMENT) {
	jsFiles = mergeTrees([jsFiles, pickFiles("app", {
		srcDir: "env",
		files: ["livereload.js"],
		destDir: "/"
	})])
} else {
	jsFiles = uglifyJs(jsFiles);
}

var js = concat(jsFiles, {
	// force jquery.js to defined at first
	inputFiles: ["jquery.js", "**/*.js"],
	outputFile: "/" + APP_NAME + ".js"
});

/**
 * Sprites
 */

var sprites = sprite("app", {
	src: ["sprites/**/*.png"],
	spritePath: "assets/sprites.png",
	stylesheetPath: "sprites.less",
	stylesheet: "less",
});

/**
 * CSS
 */

var bootstrapLessFiles = pickFiles("bower_components", {
	srcDir: "bootstrap/less",
	files: ["**/*.less"],
	destDir: "/"
})

var appLessFiles = pickFiles("app", {
	srcDir: "less",
	files: ["**/*.less"],
	destDir: "/"
});

var css = less([bootstrapLessFiles, appLessFiles, pickFiles(sprites, { srcDir: "/", files: ["**/*.less"], destDir: "/" })], "app.less", APP_NAME + ".css", {
	compress: !ENV_DEVELOPMENT
});

module.exports = mergeTrees([js, css, "public", pickFiles(sprites, { srcDir: "/", files: ["**/*.png"], destDir: "/" })]);
