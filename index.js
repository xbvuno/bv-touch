#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { program } = require("commander");

const working_path = process.cwd();
const to_relative_path = (abs_path) => '.' + path.sep + path.relative(working_path, abs_path);
const to_absolute_path = (rel_path) => path.resolve(rel_path);

let is_abs_path = false;
let is_target_a_dir = false;
let verbose = false;
let print_abs = false;

const logger = {
  print_prefix: "[bv-touch] ",
  log: (text) => console.log(logger.print_prefix + text),
  warn: (text) => console.warn(logger.print_prefix + text),
  error: (text) => console.error(logger.print_prefix + text),
  info: (text) => {
    if (verbose) console.info(logger.print_prefix + text);
  },
  path: (abs_path) => {
    return (is_abs_path || print_abs) ? to_absolute_path(abs_path) : to_relative_path(abs_path)
  }
};

const do_dir = (x_path) => {
  const print_path = logger.path(x_path);
  if (fs.existsSync(x_path)) {
    if (fs.lstatSync(x_path).isFile()) {
      logger.error(`dir is a file: ${print_path}`);
      process.exit(1);
    } else {
      logger.warn(`dir already exists: ${print_path}`);
    }
  } else {
    fs.ensureDirSync(x_path);
    logger.info(`created dir: ${print_path}`);
  }
};

const do_last = (x_path) => {
  const print_path = logger.path(x_path);

  const wanted = is_target_a_dir ? "dir" : "file";

  if (fs.existsSync(x_path)) {
    const fund = fs.lstatSync(x_path).isDirectory() ? "dir" : "file";

    if (wanted === fund) {
      logger.warn(`${wanted} already exists: ${print_path}`);
    } else {
      logger.error(`${wanted} is a ${fund}: ${print_path}`);
      process.exit(1);
    }
  } else {
    (is_target_a_dir ? fs.ensureDirSync : fs.ensureFileSync)(x_path);
    logger.info(`created ${wanted}: ${print_path}`);
  }
};

program
  .name("bv-touch")
  .arguments("<path>")
  .option("-v, --verbose", "Enable verbose output")
  .option("-a, --abs", "In case of relative path, show the absolute one")
  .description(
    "Create a file or directory at the specified path, creating missing directories"
  )
  .action((input_path, cmd_args) => {
    input_path = input_path.replace(/\//g, path.sep);

    is_abs_path = path.isAbsolute(input_path);
    is_target_a_dir = input_path.endsWith(path.sep);

    verbose = cmd_args.verbose;
    print_abs = cmd_args.abs;
    console.log(print_abs)

    const abs_path = path.resolve(input_path);
    const rel_path = path.relative(working_path, abs_path);

    const target = is_target_a_dir ? path.sep : "";

    logger.log(`destination: ${abs_path + target}`);

    const parts = (is_abs_path ? abs_path : rel_path).split(path.sep)
    let current_path = is_abs_path ? parts.shift() : "";

    const last_part = parts.pop();

    parts.forEach((part) => {
      current_path = path.join(current_path, part);
      do_dir(current_path);
    });
    do_last(path.join(current_path, last_part));

    let dir_path = is_target_a_dir ? abs_path : path.dirname(abs_path);
    if (dir_path !== working_path) {
      if (is_target_a_dir) dir_path += path.sep;
      if (dir_path.includes(" ")) dir_path = `"${dir_path}"`;
      logger.log(`to the dir:  \n\n\tcd ${dir_path}\n`);
    }
    logger.log(`Done!`);
  });

program.parse(process.argv);
