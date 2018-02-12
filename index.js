var through2 = require('through2'),
    mime = require('mime'),
    css = require('css'),
    htmlparser2 = require('htmlparser2'),
    gutil = require('gulp-util'),
    path = require('path'),
    _ = require('lodash');

var PLUGIN_NAME = 'gulp-obsolete-images';

function obsoleteImages(options) {
    options = options || {log: true};
    function addUsed(imageUrl) {
        if (!imageUrl.match(/(data|http|https):/)) {
            
            var filename = (path.basename(imageUrl).match(/((?:((?:[^\(\\\'\"\r\n\t\f\/\s\.])+)\.(?:(png|gif|jpe?g|pdf|xml|apng|svg|mng)\b)))/gmi) || []).pop();
            if (filename) {
                usedImageNames.push(filename);
            }
        }
    }

    var imageNames = [];
    var usedImageNames = [];
    var ngUsedImages = [];

    var htmlParser = new htmlparser2.Parser({
        onopentag: function onopentag(name, attribs) {
            if (name === 'img') {
                if (attribs.src) {
                    addUsed(attribs.src);
                }
                if (attribs['ng-src']) {
                    ngUsedImages.push(attribs['ng-src']);
                }
            }
            // eg shortcut icon apple-touch-icon, it doesnt matter if we add extras that are not images
            else if (name === 'link' && attribs.href) {
                addUsed(attribs.href);
            }
            // eg msapplication-xxx
            else if (name === 'meta' && attribs.content) {
                addUsed(attribs.content);
            }
            // video posters
            else if (name == 'video' && attribs.poster) {
                addUsed(attribs.poster);
            }
        }
    });


    var transform = through2.obj(function (chunk, enc, callback) {
        var self = this;

        if (chunk.isNull()) {
            self.push(chunk);
            return callback();
        }

        if (chunk.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        if (mime.lookup(chunk.path).match(/image\//)) {
            imageNames.push(path.basename(chunk.path));
            return callback();
        }

        try {
            var ast = css.parse(String(chunk.contents));
            
            // main rules
            ast.stylesheet.rules.forEach(function (rule) {
                if (rule.type !== 'rule') {
                    return;
                }

                rule.declarations.forEach(function (declaration) {
                    var match = declaration.value.match(/url\(("|'|)(.+?)\1\)/);
                    if (match) {
                        console.log(match[2]);
                        addUsed(match[2]);
                    }
                });
            });

            // @media query declarations
            ast.stylesheet.rules.forEach(function (media) {
                if (media.type !== 'media') {
                    return;
                }
                media.rules.forEach(function (rule) {
                    if (rule.type !== 'rule') {
                        return;
                    }

                    rule.declarations.forEach(function (declaration) {
                        var match = declaration.value.match(/url\(("|'|)(.+?)\1\)/);
                        if (match) {
                            console.log(match[2]);
                            addUsed(match[2]);
                        }
                    });
                });
            });

        }
        catch (e) {
            htmlParser.write(String(chunk.contents));
        }

        self.push(chunk);
        callback();
    });

    transform.on('finish', function () {
        var unused = _.difference(imageNames, usedImageNames);
        if (unused.length && options.log) {
            this.emit( 'error', new Error('Unused images: ' + unused.join(', ')) );
        }
    });

    return transform;
}

module.exports = obsoleteImages;
