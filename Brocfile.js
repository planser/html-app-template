var concat = require('broccoli-concat');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var less = require("broccoli-less-single");
var uglifyJs = require('broccoli-uglify-js');

/* broccoli-less-single is not installed from its original location as we need less 1.7 */

var APP_NAME = "the-app";
var ENV_DEVELOPMENT = process.argv.indexOf("serve") >= 0;

var app = "app"

var appJsFiles = pickFiles(app, {
	srcDir: "js",
	destDir: "/"
});

var jQueryJsFiles = pickFiles(app, {
	srcDir: "bower_components/jquery/dist",
	files: ["**/*.js"],
	destDir: "/"
});

/* Consider to import only needed js files */
var boostrapJsFiles = pickFiles(app, {
	srcDir: "bower_components/bootstrap/dist/js",
	files: ["**/*.js"],
	destDir: "/"
});

var jsFiles = mergeTrees([appJsFiles, jQueryJsFiles, boostrapJsFiles]);

if (ENV_DEVELOPMENT) {
	jsFiles = mergeTrees([jsFiles, pickFiles(app, {
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

var bootstrapLessFiles = pickFiles(app, {
	srcDir: "bower_components/bootstrap/less",
	files: ["**/*.less"],
	destDir: "/"
})

var appLessFiles = pickFiles(app, {
	srcDir: "less",
	files: ["**/*.less"],
	destDir: "/"
});

var css = less([bootstrapLessFiles, appLessFiles], "app.less", APP_NAME + ".css", {
	compress: !ENV_DEVELOPMENT
});

module.exports = mergeTrees([js, css, "public"]);
