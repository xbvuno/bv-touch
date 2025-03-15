
# bv-touch

`bv-touch` is a Node.js command-line tool that allows you to create files or directories at the specified path, automatically creating any missing directories along the way.

## Installation

To install `bv-touch` globally on your system, use the following command:

```bash
npm install -g bv-touch
```

## Usage

### Create a directory or file

```bash
bv-touch <path>
```

Where `<path>` is the relative or absolute path where you want to create a file or directory.

### Options

- `-v, --verbose`: Enable verbose output.
- `-a, --abs`: In case of relative path, show the absolute path.

### Example

#### Create a directory:

```bash
bv-touch myfolder/subfolder
```

If `myfolder` or `subfolder` does not exist, they will be created. 

#### Create a file:

```bash
bv-touch myfolder/myfile.txt
```

If `myfolder` does not exist, it will be created and then `myfile.txt` will be created inside it.

#### Enable verbose output:

```bash
bv-touch myfolder/subfolder -v
```

#### Show absolute path:

```bash
bv-touch myfolder/subfolder -a
```

### Output

When you run the command, it will output the following:
- If directories or files are created, it will log their creation.
- If directories or files already exist, it will log a warning.
- If a file exists when a directory is required (or vice versa), an error message will be shown.

### Example Output

```bash
[bv-touch] destination: /absolute/path/to/myfolder/subfolder
[bv-touch] created dir: ./myfolder/subfolder
[bv-touch] Done!
```

## License

MIT License
