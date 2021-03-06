/**
 * @fileoverview Tests for one-var.
 * @author Ian Christian Myers and Michael Paulukonis
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 * @copyright 2013 Michael Paulukonis. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/one-var", {
    valid: [
        "function foo() { var bar = true; }",
        "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",
        "var foo = function () { var bar = true; baz(); }",
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "always"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "never"]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { let a = 1; var c = true; if (a) {let c = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { const a = 1; var c = true; if (a) {const c = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { if (true) { const a = 1; }; if (true) {const a = true; } }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1; let b = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { const a = 1; const b = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "never"]
        },
        {
            code: "function foo() { let a = 1; const b = false; var c = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1, b = false; var c = true; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"]
        },
        {
            code: "function foo() { let a = 1; let b = 2; const c = false; const d = true; var e = true, f = false; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "never", const: "never"}]
        },
        {
            code: "let foo = true; for (let i = 0; i < 1; i++) { let foo = false; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "always", const: "never"}]
        }
    ],
    invalid: [
        {
            code: "function foo() { var bar = true; var baz = false; }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                },
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = function () { var bar = true; var baz = false; }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = () => { var bar = true; var baz = false; }",
            ecmaFeatures: { arrowFunctions: true },
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = function () { var bar = true; if (qux) { var baz = false; } }",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo; var bar;",
            errors: [
                {
                    message: "Combine this with the previous 'var' statement.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "function foo() { var bar = true, baz = false; }",
            args: [2, "never"],
            errors: [{
                message: "Split 'var' declaration into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var bar = true; var baz = false; }",
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { var a = [1, 2, 3]; var [b, c, d] = a; }",
            ecmaFeatures: {
                destructuring: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'var' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, "always"],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1; let b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {let: "always"}],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1; const b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {const: "always"}],
            errors: [{
                message: "Combine this with the previous 'const' statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { let a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {let: "never"}],
            errors: [{
                message: "Split 'let' declaration into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "function foo() { const a = 1, b = 2; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {const: "never"}],
            errors: [{
                message: "Split 'const' declaration into multiple statements.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "let foo = true; switch(foo) { case true: let bar = 2; break; case false: let baz = 3; break; }",
            ecmaFeatures: {
                blockBindings: true
            },
            args: [2, {var: "always", let: "always", const: "never"}],
            errors: [{
                message: "Combine this with the previous 'let' statement.",
                type: "VariableDeclaration",
                line: 1,
                column: 73
            }]
        }
    ]
});
