var fs = require('fs');

function convertListToMap(list) {
    var termToTranslationMap = {};

    list.forEach(function (t) {
        var form = t.definition.form;
        var term = t.term;
        var context = t.context.replace(/^"(.*)"$/, '$1');

        if (context && !termToTranslationMap[context]) {
            termToTranslationMap[context] = {};
        }

        context
            ? termToTranslationMap[context][term] = form
            : termToTranslationMap[term] = form;
    });

    return termToTranslationMap;
}

module.exports = function (config, files, callback) {
    if (config.exportSingleFileTarget) {
        var out = fs.createWriteStream(config.targetDir + config.exportSingleFileTarget);
        out.write(JSON.stringify(files, null, 4));
        out.end();

        if (callback) callback();
    } else {

        files.forEach(function (f) {
            var fileName = config.targetDir + f.lang + '.json';
            var out = fs.createWriteStream(fileName);
            out.write(JSON.stringify(convertListToMap(f.terms), null, 4));
            out.end();
        });

        if (callback) callback();
    }
};