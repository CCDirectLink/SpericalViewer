/**
 * Version Container
 */
class VersionType {

	/**
	 * Version definition
	 * @param {VersionType|Object|string} Version data
	 */
	constructor(data) {

		if (data.constructor === VersionType) {

			/**
		     * Major (main) version
		     * [major].minor.patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.major = data.major;

			/**
		     * Minor version
		     * major.[minor].patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.minor = data.minor;

			/**
		     * Patch version
		     * major.minor.[patch](-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.patch = data.patch;

			/**
		     * Hotfix version
		     * major.minor.patch(-[hotfix])( note)
		     *
		     * @type {number}
		     */
			this.hotfix = data.hotfix;

			/**
		     * Version notes
		     * major.minor.patch(-hotfix)( [note])
		     *
		     * @type {string}
		     */
			this.note = data.note;
		}
		else if (typeof data === 'object') {

			/**
		     * Major (main) version
		     * [major].minor.patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.major = data.major || 0;

			/**
		     * Minor version
		     * major.[minor].patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.minor = data.minor || 0;

			/**
		     * Patch version
		     * major.minor.[patch](-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.patch = data.patch || 0;

			/**
		     * Hotfix version
		     * major.minor.patch(-[hotfix])( note)
		     *
		     * @type {number}
		     */
			this.hotfix = data.hotfix || 0;

			/**
		     * Version notes
		     * major.minor.patch(-hotfix)( [note])
		     *
		     * @type {string}
		     */
			this.note = data.note || "";
		}
		else if (typeof data === 'string') {

			// Version regex
			const versionArray = (/^(v)?(([0-9]+)\.([0-9]+)\.([0-9]+)(\-([0-9]+))?(( )(.+))?)/).exec(data);

			/**
		     * Major (main) version
		     * [major].minor.patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.major = Number(versionArray[3]) || 0;

			/**
		     * Minor version
		     * major.[minor].patch(-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.minor = Number(versionArray[4]) || 0;

			/**
		     * Patch version
		     * major.minor.[patch](-hotfix)( note)
		     *
		     * @type {number}
		     */
			this.patch = Number(versionArray[5]) || 0;

			/**
		     * Hotfix version
		     * major.minor.patch(-[hotfix])( note)
		     *
		     * @type {number}
		     */
			this.hotfix = Number(versionArray[7]) || 0;

			/**
		     * Version notes
		     * major.minor.patch(-hotfix)( [note])
		     *
		     * @type {string}
		     */
			this.note = (versionArray[10]) || "";
		}
	}

	/**
     * Version string
     * @type {string}
     */
	get string() {
		return (this.major + '.' +
				this.minor + '.' +
				this.patch +
				((this.hotfix) ? ('-' + this.hotfix) : '') +
				((this.note) ? (' ' + this.note) : ''));
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
     * major [infinite digits] minor [4 digits] patch [4 digits] hotfix [2 digits]
     * @type {number}
     */
	get numeric() {
		return ((this.major * 10000000000) +
				(this.minor * 1000000) +
				(this.patch * 100) +
				(this.hotfix));
	}
}

// Node Export
if (module) {
	module.exports = {
		VersionType: VersionType
	}
}