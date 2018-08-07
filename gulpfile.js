var gulp = require("gulp");
var sever = require("gulp-webserver");
var mincss = require("gulp-clean-css");
var scss = require("gulp-scss");
var uglify = require('gulp-uglify');
var miniHtml = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var url = require("url");
var path = require("path");
var fs = require("fs");
var data = require("./data/data.json").data;

gulp.task("scss", function() {
    return gulp.src('./src/css/*.scss')
        .pipe(scss())
        .pipe(gulp.dest('./src/css/'));
})

gulp.task('mincss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('uglify', function() {
    gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('miniHTML', function() {
    gulp.src('./src/index.html')
        .pipe(miniHtml({
            collapseWhitespace: true //压缩HTML
        }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('minImage', function() {
    gulp.src('./src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./build/images'));
});
gulp.task("server", function() {
    gulp.src("./src/")
        .pipe(sever({
            port: 8585,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (req.url === "/favicon.ico") {
                    return;
                }
                pathname = pathname === "/" ? "index.html" : pathname;
                if (pathname === "/api/list") {
                    res.end(JSON.stringify(data))
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));
                }
            }
        }))
})