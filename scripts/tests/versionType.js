'use strict';

// call with mocha
// require chai

const { describe, it } = require('mocha');
const { expect } = require('chai');
const { VersionType } = require('./../../app/js/base/versionType.js');

describe('VersionType', () => {
	const v1 = new VersionType('v1.2.3');
	const v2 = new VersionType('1.2.3');
	const v3 = new VersionType('v1.2.3-4');
	const v4 = new VersionType('1.2.3-4');

	const v5 = new VersionType('v1.2.3-4 note');
	const v6 = new VersionType('1.2.3-4 note');
	const v7 = new VersionType('v1.2.3 note');
	const v8 = new VersionType('1.2.3 note');

	const v9 = new VersionType(v7);
	const v10 = new VersionType({
		major: 1,
		minor: 2,
		patch: 3,
		hotfix: 4,
		note: 'note',
	});
	const v11 = new VersionType({});
	const v12 = new VersionType('invalid');
	const v13 = new VersionType('1');

	describe('.constructor(data)', () => {
		it('data {string}: v1.2.3', () => {
			expect(v1.major).to.equal(1);
			expect(v1.minor).to.equal(2);
			expect(v1.patch).to.equal(3);
			expect(v1.hotfix).to.equal(0);
			expect(v1.note).to.equal('');
		});

		it('data {string}: 1.2.3', () => {
			expect(v2.major).to.equal(1);
			expect(v2.minor).to.equal(2);
			expect(v2.patch).to.equal(3);
			expect(v2.hotfix).to.equal(0);
			expect(v2.note).to.equal('');
		});

		it('data {string}: v1.2.3-4', () => {
			expect(v3.major).to.equal(1);
			expect(v3.minor).to.equal(2);
			expect(v3.patch).to.equal(3);
			expect(v3.hotfix).to.equal(4);
			expect(v3.note).to.equal('');
		});

		it('data {string}: 1.2.3-4', () => {
			expect(v4.major).to.equal(1);
			expect(v4.minor).to.equal(2);
			expect(v4.patch).to.equal(3);
			expect(v4.hotfix).to.equal(4);
			expect(v4.note).to.equal('');
		});

		it('data {string}: v1.2.3-4 note', () => {
			expect(v5.major).to.equal(1);
			expect(v5.minor).to.equal(2);
			expect(v5.patch).to.equal(3);
			expect(v5.hotfix).to.equal(4);
			expect(v5.note).to.equal('note');
		});

		it('data {string}: 1.2.3-4 note', () => {
			expect(v6.major).to.equal(1);
			expect(v6.minor).to.equal(2);
			expect(v6.patch).to.equal(3);
			expect(v6.hotfix).to.equal(4);
			expect(v6.note).to.equal('note');
		});

		it('data {string}: v1.2.3 note', () => {
			expect(v7.major).to.equal(1);
			expect(v7.minor).to.equal(2);
			expect(v7.patch).to.equal(3);
			expect(v7.hotfix).to.equal(0);
			expect(v7.note).to.equal('note');
		});

		it('data {string}: 1.2.3 note', () => {
			expect(v8.major).to.equal(1);
			expect(v8.minor).to.equal(2);
			expect(v8.patch).to.equal(3);
			expect(v8.hotfix).to.equal(0);
			expect(v8.note).to.equal('note');
		});

		it('data {VersionType}', () => {
			expect(v9.major).to.equal(1);
			expect(v9.minor).to.equal(2);
			expect(v9.patch).to.equal(3);
			expect(v9.hotfix).to.equal(0);
			expect(v9.note).to.equal('note');
		});

		it('data {object}', () => {
			expect(v10.major).to.equal(1);
			expect(v10.minor).to.equal(2);
			expect(v10.patch).to.equal(3);
			expect(v10.hotfix).to.equal(4);
			expect(v10.note).to.equal('note');
		});

		it('data {object}: empty', () => {
			expect(v11.major).to.equal(0);
			expect(v11.minor).to.equal(0);
			expect(v11.patch).to.equal(0);
			expect(v11.hotfix).to.equal(0);
			expect(v11.note).to.equal('');
		});

		it('data {object}: invalid format', () => {
			expect(v12.major).to.equal(0);
			expect(v12.minor).to.equal(0);
			expect(v12.patch).to.equal(0);
			expect(v12.hotfix).to.equal(0);
			expect(v12.note).to.equal('');
		});

		it('data {object}: partial', () => {
			expect(v13.major).to.equal(1);
			expect(v13.minor).to.equal(0);
			expect(v13.patch).to.equal(0);
			expect(v13.hotfix).to.equal(0);
			expect(v13.note).to.equal('');
		});

		it('data (invalid)', () => {
			expect(() => new VersionType(null)).to.throw(
				TypeError,
				'Not valid version type'
			);
		});
	});

	describe('.string', () => {
		it('base version', () => {
			expect(v1.string).to.equal('1.2.3');
			expect(v2.string).to.equal('1.2.3');
		});

		it('version with hotfix', () => {
			expect(v3.string).to.equal('1.2.3-4');
			expect(v4.string).to.equal('1.2.3-4');
		});

		it('version with hotfix and note', () => {
			expect(v5.string).to.equal('1.2.3-4 note');
			expect(v6.string).to.equal('1.2.3-4 note');
			expect(v10.string).to.equal('1.2.3-4 note');
		});

		it('version with note', () => {
			expect(v7.string).to.equal('1.2.3 note');
			expect(v8.string).to.equal('1.2.3 note');
			expect(v9.string).to.equal('1.2.3 note');
		});

		it('empty version', () => {
			expect(v11.string).to.equal('0.0.0');
		});
	});

	describe('.toString()', () => {
		it('base version', () => {
			expect(v1.toString()).to.equal('1.2.3');
			expect(v2.toString()).to.equal('1.2.3');
		});

		it('version with hotfix', () => {
			expect(v3.toString()).to.equal('1.2.3-4');
			expect(v4.toString()).to.equal('1.2.3-4');
		});

		it('version with hotfix and note', () => {
			expect(v5.toString()).to.equal('1.2.3-4 note');
			expect(v6.toString()).to.equal('1.2.3-4 note');
			expect(v10.toString()).to.equal('1.2.3-4 note');
		});

		it('version with note', () => {
			expect(v7.toString()).to.equal('1.2.3 note');
			expect(v8.toString()).to.equal('1.2.3 note');
			expect(v9.toString()).to.equal('1.2.3 note');
		});

		it('empty version', () => {
			expect(v11.toString()).to.equal('0.0.0');
		});
	});

	describe('.numeric', () => {
		it('base version', () => {
			expect(v1.numeric).to.equal(10002000300);
			expect(v2.numeric).to.equal(10002000300);
		});

		it('version with hotfix', () => {
			expect(v3.numeric).to.equal(10002000304);
			expect(v4.numeric).to.equal(10002000304);
		});

		it('version with hotfix and note', () => {
			expect(v5.numeric).to.equal(10002000304);
			expect(v6.numeric).to.equal(10002000304);
			expect(v10.numeric).to.equal(10002000304);
		});

		it('version with note', () => {
			expect(v7.numeric).to.equal(10002000300);
			expect(v8.numeric).to.equal(10002000300);
			expect(v9.numeric).to.equal(10002000300);
		});

		it('empty version', () => {
			expect(v11.numeric).to.equal(0);
		});
	});
});
