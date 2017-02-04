var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');
var program = require('commander');

program
  .version(pkg.version)
  .usage('[options]')
  .option('-f, --file <path>', '*set srt file path', '')
  .option('-o, --output <path>', 'set output file path', '')
  .option('-l, --linenumber', 'show line number')
  .option('-t, --timeline', 'show timeline')
  .option('-e, --extname <extname>', 'set output file extname', '.txt')
  .on('--help', function() {
		console.log('  Examples:');
		console.log('');
		console.log('    $ srt2raw -f /path/to/file.srt -o /path/to/dist/filename -l -t');
		console.log('    $ srt2raw -f /path/to/file.srt -l -t');
		console.log('');
	})
	.parse(process.argv);

// 检查输入，输出路径
if (!program.file) {
	console.error('ERROR: Re-run using the -h to output usage information！');
	process.exit(1);
}

var file = path.normalize(program.file), output;

if (!program.output) {
	var p = path.parse(file);
	output = [p.dir, p.name].join(path.sep);
} else {
	output = path.normalize(program.output);
}
output += program.extname; // 加上文件后缀名

if (!program.output) {
	console.log('Use the default output path: ');
	console.log(path.resolve(output));
}

// var reg = /(\d+)\r\n(\d{2}:\d{2}:\d{2},\d{3})\s{1}-->\s{1}(\d{2}:\d{2}:\d{2},\d{3})\r\n([^\r\n]*)\r\n/g;
// 以上正则匹配的方法会存在以下问题，故采用字符串切割方法。
// 1. 无法匹配多行字幕（多语言，存在换行的字幕）

var reg = /(\d+)\r\n(\d{2}:\d{2}:\d{2},\d{3})\s{1}-->\s{1}(\d{2}:\d{2}:\d{2},\d{3})\r\n/;

// 读入srt字幕文件内容
var content;
try{
	content = fs.readFileSync(file, {
		encoding: 'utf8'
	});
} catch(e) {
	console.error('ERROR: File read failed！', e);
	process.exit(1);
}

if(!content) {
	console.error('ERROR: Empty file！');
	process.exit(1);
}

// 使用正则切割srt字符串，得到类似下列字符串：
// [
// 	'',
// 	'1',
// 	'00:00:51,470',
// 	'00:00:57:369',
// 	'我是第一条字幕',
// 	'2',
// 	'00:00:85,268',
// 	'00:01:01:190',
// 	'我是第二条字幕',
// ]

var arr = content.split(reg);

// 解析字幕内容
var lines = [], tempStr;
for (var i = 1, len = arr.length; i < len; i+=4) {
	tempStr = "";

	var index = arr[i];
	var startTime = arr[i+1];
	var endTime = arr[i+2];
	var word = arr[i+3];

	// 加上字幕序号
	if(program.linenumber) {
		tempStr += index + '.';
	}
	// 加上时间轴
	if(program.timeline) {
		tempStr += ' '+ startTime + ' - ' + endTime + ' ';
	}

	// 加上字幕
	tempStr += word;
	lines.push(tempStr);
}

// 将字幕信息拼接为一个完整的字符串
var data = lines.join('');

// 将字符串写入文件
try{
	fs.writeFileSync(output, data);
} catch(e) {
	console.error('ERROR: File writing failed！', e);
	process.exit(1);
}

console.log('Total ' + lines.length + ' records. writing succeeded!');
