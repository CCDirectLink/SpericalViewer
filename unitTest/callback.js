"use strict";

// call with mocha
// require chai

var expect = require("chai").expect;
const callHandler = require('./../app/lib/callHandler.js');

describe("Callback", function() {

	describe("Callback entry", function() {

		it("Create and call", function() {

			var cb1 = new callHandler.CallbackEntry(id => id + 1);
			expect(cb1.call(0)).to.equal(1);
			expect(cb1.call(1)).to.equal(2);
			expect(cb1.call(2)).to.equal(3);

			var cb2 = new callHandler.CallbackEntry(id => id * 5);
			expect(cb2.call(1)).to.equal(5);
			expect(cb2.call(2)).to.equal(10);
			expect(cb2.call(3)).to.equal(15);

		});

		it("Create fail", function() {

			expect(function(){new callHandler.CallbackEntry("fail")}).to.throw(TypeError, 'Param cb not a function');

		});

		it("Update", function() {

			var cb3 = new callHandler.CallbackEntry(id => id + 1);
			expect(cb3.call(1)).to.equal(2);

			cb3.update(id => id * 5);
			expect(cb3.call(1)).to.equal(5);

		});

		it("Update fail", function() {

			var cb4 = new callHandler.CallbackEntry(id => id + 1);
			expect(function(){cb4.update("fail")}).to.throw(TypeError, 'Param cb not a function');

		});

		it("Clone", function() {

			var cb5 = new callHandler.CallbackEntry(id => id + 1);
			expect(cb5.call(1)).to.equal(2);

			var cb6 = cb5.clone();

			cb5.update(id => id * 5);
			expect(cb5.call(1)).to.equal(5);
			expect(cb6.call(1)).to.equal(2);

		});

		it("To String", function() {

			var cb7 = new callHandler.CallbackEntry(id => id + 1);
			expect(cb7.toString()).to.equal("{}");

		});

	});

});