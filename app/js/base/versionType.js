'use strict';

/**
 * Version Regex
 */
const VER_REG = /^v?(([0-9]+)(\.([0-9]+))?(\.([0-9]+))?(-([0-9]+))?( (.+))?)/;

/**
 * Version Container
 */
class VersionType {
	/**
	 * Version definition
	 * @param {VersionType|Object|string} data Version data
	 */
	constructor(data) {
		if (data && data.constructor === VersionType) {
			this.major = data.major;
			this.minor = data.minor;
			this.patch = data.patch;
			this.hotfix = data.hotfix;

			this.note = data.note;
		} else if (data && typeof data === 'object') {
			this.major = data.major || 0;
			this.minor = data.minor || 0;
			this.patch = data.patch || 0;
			this.hotfix = data.hotfix || 0;

			this.note = data.note || '';
		} else if (typeof data === 'string') {
			// Version regex
			const versionArray = VER_REG.exec(data);

			if (!Array.isArray(versionArray)) {
				this.major = 0;
				this.minor = 0;
				this.patch = 0;
				this.hotfix = 0;

				this.note = '';
				return;
			}

			this.major = Number(versionArray[2]);
			this.minor = Number(versionArray[4]) || 0;
			this.patch = Number(versionArray[6]) || 0;
			this.hotfix = Number(versionArray[8]) || 0;

			this.note = versionArray[10] || '';
		} else {
			throw new TypeError('Not valid version type');
		}
	}

	/**
	 * Version string
	 * @type {string}
	 */
	get string() {
		return (
			this.major + '.' +
			this.minor + '.' +
			this.patch +
			(this.hotfix ? '-' + this.hotfix : '') +
			(this.note ? ' ' + this.note : '')
		);
	}

	/**
	 * Get version string
	 * @return {string} Version string
	 */
	toString() {
		return this.string;
	}

	/**
	 * Numeric version
	 * Can be used to compare versions
	 *
	 * - major [infinite digits]
	 * - minor [4 digits]
	 * - patch [4 digits]
	 * - hotfix [2 digits]
	 * @type {number}
	 */
	get numeric() {
		return (
			this.major * 10000000000 +
			this.minor * 1000000 +
			this.patch * 100 +
			this.hotfix
		);
	}
}

// Node Export
if (module) {
	module.exports = {
		VersionType: VersionType,
	};
}
