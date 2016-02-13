export default function({ types: t }) {

	function realEquals(left, right) {
		var expression = t.binaryExpression(
			'==',
			left,
			right
		);

		expression._transformed57Script = true;

		return expression;
	}

	function and(left, right, leftEquals, rightEquals) {
		return t.logicalExpression(
			'&&',
			realEquals(left, t.numericLiteral(leftEquals)),
			realEquals(right, t.numericLiteral(rightEquals))
		);
	}

	function ifReturnTrue(left, right, leftEquals, rightEquals) {
		return t.ifStatement(
			and(
				left,
				right,
				leftEquals,
				rightEquals
			),
			t.returnStatement(
				t.booleanLiteral(true)
			)
		);
	}

	function IIFE(body) {
		return t.callExpression(
			t.functionExpression(
				null,
				[],
				t.blockStatement(body)
			),
			[]
		);
	}

	return {
		visitor: {
			BinaryExpression(path) {
				if (path.node.operator === '==' && !path.node._transformed57Script) {
					path.replaceWith(
						IIFE([
							ifReturnTrue(
								path.node.left,
								path.node.right,
								5,
								7
							),
							ifReturnTrue(
								path.node.left,
								path.node.right,
								7,
								5
							),
							t.returnStatement(
								realEquals(
									path.node.left,
									path.node.right
								)
							),
						])
					);
				}
			},
		},
	};
}
