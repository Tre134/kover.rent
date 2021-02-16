const {
    src,
    dest
} = require('gulp');
const gulp = require('gulp');
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const ttf2woff2 = require("gulp-ttf2woff2");
const concat = require('gulp-concat')
const browsersync = require("browser-sync").create();



/* Paths */
let path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/img/",
        fonts: "dist/assets/fonts/"
    },
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/style.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/fonts/*.ttf"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
    },
    clean: "./dist"
}

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
}


function html() {
    return src(path.src.html, {
            base: "src/"
        })
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, {
            base: "src/assets/sass/"
        })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserlist: ["Last 10 versions"]
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}


function js() {
    return src(path.src.js, {
            base: './src/assets/js/'
        })
        .pipe(plumber())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream()),

        src( 
        './src/assets/js/modules/*.js'
            
        )
            .pipe(dest(path.build.js))
}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts)
        .pipe(ttf2woff2())

        .pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);

}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);



/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.fonts = fonts;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;