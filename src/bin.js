#!/usr/bin/env node

import repl from 'repl';
import vm from 'vm';
import Module from 'module';
import path from 'path';

import * as babel from 'babel-core';
import commander from 'commander';
import pathIsAbsolute from 'path-is-absolute';
import register from 'babel-register';


var program = new commander.Command('57-node');
program.parse(process.argv);


if (program.args.length) {
    register({
        plugins: __dirname,
    });

    let args = program.args;
    let filename = args.splice(0, 1)[0];
    if (!pathIsAbsolute(filename)) {
        filename = path.join(process.cwd(), filename);
    }

    process.argv = [ 'node', filename ].concat(args);

    Module.runMain();
}
else {
    repl.start({
        eval(code, context, filename, callback) {

            var transpiledCode = babel.transform(code, {
                filename: filename,
                plugins: [
                    __dirname,
                    ({ types: t }) => ({
                        visitor: {
                            Directive(path) {
                                // Prevent non-returning statements from returning "use strict".
                                path.insertAfter(t.expressionStatement(t.identifier('undefined')));
                            },
                        },
                    }),
                ],
            }).code;

            var result = vm.runInThisContext(transpiledCode, { filename: filename });

            callback(null, result);
        },
    });
}
