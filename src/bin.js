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
		plugins: '.',
	});

	let args = program.args;
	let filename = args[0];
	if (!pathIsAbsolute(filename)) {
		args[0] = path.join(process.cwd(), filename);
	}

	process.argv = [ 'node' ].concat(args);

	Module.runMain();
}
else {
	repl.start({
		eval(code, context, filename, callback) {

			var transpiledCode = babel.transform(code, {
				filename: filename,
				plugins: [
					'.',
					({ types: t }) => ({
						visitor: {
							Directive(path) {
								// Prevent non-returning statements from returning "use strict".
								path.insertAfter(t.expressionStatement(t.identifier('undefined')));
							},
						},
					})
				],
			}).code;

			var result = vm.runInThisContext(transpiledCode, { filename: filename });

			callback(null, result);
		},
	});
}
