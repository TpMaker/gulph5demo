var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    http = require('http'),
    mkdirp = require('mkdirp'),
    exec = require('child_process').exec; //execSync 同步方法

var options = {
    host: '192.168.4.220',
    port: 80,
    projectId: '1',
    mock: '/mockjs/'
};

/**
 * 编译ftl文件
 * @param  {[type]} src [ftl文件]
 * @return {[type]}     [null]
 */
function execFmpp(src, template, fmppData, proxyConfig) {
    options = Object.assign(options, proxyConfig.fmpp);
    if (fmppData === 'remote') {
        execFmpp_Remote(src, template);
    } else {
        execFmpp_Local(src, template);
    }
}

/**
 * 编译ftl文件
 * @param  {[type]} src [ftl文件]
 * @return {[type]}     [null]
 */
function execFmpp_Local(src, template) {
    src = src.replace(/\\/g, '/');

    console.log(chalk.blue('------- fmpp compiling ' + src + ' -------'))
    var mockdata = './' + src.replace('template', 'data/ftl').replace('.ftl', '.tdd');
    var distHtml = src.replace(template, 'dist').replace('.ftl', '.html');
    var mockdata_D = src.replace(template, '../data/ftl').replace('.ftl', '.tdd');

    //将global_library自动导入，并生成临时文件进行处理
    var tempSrc = src.replace('.ftl', '.tmp.ftl')
    src = mergeGlobal(src, tempSrc);

    var path2fmpp = path.join(__dirname, "./other/fmpp/bin/fmpp" + (process.platform === 'win32' ? '.bat' : ''));

    // 使用-D  src/assets/template -s -D tdd(' + mockdata + ')
    // fmpp 命令行 参考：http://fmpp.sourceforge.net/commandline.html
    var args = path2fmpp + '   ' + src + ' -o ' + distHtml + ' -D tdd(' + mockdata_D + ') -S  ' + template + '  -s';

    exec(args, function(err, stdout, stderr) {
        if (stdout) {
            console.log(chalk.blue('------- fmpp compiled ' + src + ' ended-------'))
            console.log(chalk.green(stdout))
            unLinkFile(tempSrc); //移除临时文件
        }

        if (err) {
            console.log(chalk.red('exec error: ', err));
        }
    });
}

/**
 * 编译ftl文件
 * @param  {[type]} src [ftl文件]
 * @return {[type]}     [null]
 */
function execFmpp_Remote(src, template) {
    src = src.replace(/\\/g, '/');

    console.log(chalk.blue('------- fmpp compiling ' + src + ' -------'))
    var mockdata = './' + src.replace('template', 'data/ftl_remote').replace('.ftl', '.tdd');
    var mockUrl = src.replace(template, '').replace('.ftl', '.tdd');
    var distHtml = src.replace(template, 'dist').replace('.ftl', '.html');
    var mockdata_D = src.replace(template, '../data/ftl_remote').replace('.ftl', '.tdd');

    var dirname = path.dirname(mockdata);
    mkdirp.sync(dirname);

    downloadRapData(mockUrl, mockdata, function() {

        //将global_library自动导入，并生成临时文件进行处理
        var tempSrc = src.replace('.ftl', '.tmp.ftl')
        src = mergeGlobal(src, tempSrc);

        var path2fmpp = path.join(__dirname, "./other/fmpp/bin/fmpp" + (process.platform === 'win32' ? '.bat' : ''));

        // fmpp 命令行 参考：http://fmpp.sourceforge.net/commandline.html
        var args = path2fmpp + '   ' + src + ' -o ' + distHtml + ' -D tdd(' + mockdata_D + ') -S  ' + template + '  -s';
        //console.log(mockdata, args);

        exec(args, function(err, stdout, stderr) {
            if (stdout) {
                console.log(chalk.blue('------- fmpp compiled ' + src + ' ended-------'))
                console.log(chalk.green(stdout))
                unLinkFile(tempSrc); //移除临时文件
            }

            if (err) {
                console.log(chalk.red('exec error: ', err));
            }
        });
    });
}

/**
 * 遍历文件夹
 * @param  {[type]}   dir      [文件夹]
 * @param  {Function} callback [回调方法]
 * @return {[type]}            [description]
 */
function travelDir(dir, callback) {
    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory() && pathname.indexOf('common') < 0) {
            travelDir(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

/**
 * 合并global_library as model, 页面可以用model变量
 * @param  {[type]} input  [description]
 * @param  {[type]} output [description]
 * @return {[type]}        [description]
 */
function mergeGlobal(input, output) {
    var content = fs.readFileSync(input, 'utf-8');
    content = '<#import "*/global_library.ftl" as model>' + content;
    var dirname = path.dirname(output);

    if (!fs.existsSync(dirname)) {
        mkdir(dirname);
    }
    fs.appendFileSync(output, content);
    return output;
}

//拷贝文件
function copyfile(sourceFile, targetFile) {
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
}

//创建文件夹
function mkdir(dir) {
    if (fs.existsSync(dir)) {
        return;
    }
    var dirname = path.dirname(dir);
    if (!fs.existsSync(dirname)) {
        arguments.callee(dirname);
    }
    fs.mkdirSync(dir);
}

//删除文件
function unLinkFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

/**
 * 检查生成的静态文件路径
 * @return {[type]} [description]
 */
function checkPath(config) {
    var msg = `config.output.remote:${config.output.remote}不存在，请检查您的config/config.js下的路径是否设置正确`
    try {
        if (!fs.statSync(config.output.remote).isDirectory()) {
            throw new Error(msg)
        }
    } catch (err) {
        console.log(chalk.red(msg));
        throw new Error(msg)
    }
}

/**
 * 把rap上的json数据下载到本地
 * @param  {[type]} url      [description]
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
function downloadRapData(url, filePath, callback) {

    var _options = {
        host: options.host,
        port: options.port,
        path: '/mockjs/' + options.projectId + url
    };
    var req = http.get(_options, function(response) {
        if (response.statusCode != 200) {
            console.log(chalk.red("没有找到url:" + _options.path));
            //process.exit();
            return;
        };
        response.setEncoding('utf8');
        var data = '';
        response.on('data', function(chunk) {
            data += chunk;
        });
        response.on('end', function() {
            var file = fs.createWriteStream(filePath);
            data = unescape(data.replace(/\\u/g, "%u"));
            file.write(data);
        });

        /*var streams = fs.createWriteStream(filePath, {
            defaultEncoding: 'utf-8'
        });
        response.pipe(streams);*/

        if (typeof callback === 'function') {
            callback.call(null, filePath);
        }

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    req.end();

}

module.exports.execFmpp = execFmpp;
module.exports.travelDir = travelDir;
module.exports.checkPath = checkPath;
module.exports.downloadRapData = downloadRapData;
