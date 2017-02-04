# srt2raw

Convert subtitle file (utf-8) to raw text.

## Installation

    $ npm install srt2raw -g

## Usage

```bash
$ srt2raw -f './test/Westworld S01E10.srt' -o ./test/dist -e .md -l -t
```

## Options
```bash
$ srt2raw -h

  Usage: srt2raw [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -f, --file <path>    *set srt file path
    -o, --output <path>  set output file path
    -l, --linenumber     show line number
    -t, --timeline       show timeline
    -e, --extname <extname>  set output file extname

  Examples:

    $ srt2raw -f /path/to/file.srt -o /path/to/dist/filename -l -t
    $ srt2raw -f /path/to/file.srt -l -t
```

## Tests
```bash
node run test
```

## License

MIT
