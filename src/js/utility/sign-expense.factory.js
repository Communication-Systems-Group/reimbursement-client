app.factory('signExpenseFactory', [

	function() {
		"use strict";

		var USED_KEYPAIR_VERSION = "RSASSA-PKCS1-v1_5";
		var USED_HASH_ALGO = "SHA-256";
		var publicKey, privateKey;

		/**
		 * Constructor for signing and verifying a base64 string
		 * with a private / public key.
		 *
		 * @param base64
		 * @param pKey
		 * @param callback
		 */
		function construct(base64, pKey, callback) {
			importKey(pKey, function(result) {
				if(result) {
					sign(base64, function(signature) {
						callback(signature);
					});
				}
				else {
					callback(false);
				}
			});
		}

		/**
		 * Returns a signature based on the data and private
		 * key provided. If it fails to create a signature
		 * returns false.
		 *
		 * @param data
		 * @param callback
		 */
		function sign(data, callback) {
			// Prepare base64 value to be used by signing process.
			var dd = base64ToArrayBuffer(data);

			if(!dd) {
				callback(false);
			}

			window.crypto.subtle.sign({
					name: USED_KEYPAIR_VERSION
				},
				privateKey, // from generateKey or importKey above
				dd // ArrayBuffer of data you want to sign
			)
				.then(function(signature) {
					// returns an ArrayBuffer containing the signature
					callback(arrayBufferToBase64(signature));
				})
				.catch(function() {
					// console.log(err);
					callback(false);
				});
		}

		/**
		 * Verify if the provided signature matches the
		 * base64 string. Returns true if that's the case.
		 *
		 * @param base64
		 * @param signatureBase64
		 * @param callback
		 */
		function verify(base64, signatureBase64, callback) {
			// Prepare base64 value to be used by signing process.
			var data = base64ToArrayBuffer(base64);
			var signature = base64ToArrayBuffer(signatureBase64);

			window.crypto.subtle.verify(
				{
					name: USED_KEYPAIR_VERSION
				},
				publicKey, // from generateKey or importKey above
				signature, // ArrayBuffer of the signature
				data // ArrayBuffer of the data
			)
				.then(function(isvalid) {
					// returns a boolean on whether the signature is true or not
					callback(isvalid);
				})
				.catch(function() {
					callback(false);
				});
		}

		/**
		 * Import a base64 private-key to use it for the
		 * window.crypto services. Returns true / false if
		 * import worked / failed.
		 *
		 * @param key
		 * @param callback
		 */
		function importKey(key, callback) {
			if(key !== undefined && key !== "" && key !== null) {
				key = preparePrivateKey(key);
				var buffer = base64ToArrayBuffer(key);

				window.crypto.subtle.importKey(
					"pkcs8", // must be "pkcs8" (private only) to be used for document signing
					buffer, { // these are the algorithm options
						name: USED_KEYPAIR_VERSION,
						hash: { name: USED_HASH_ALGO } // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
					},
					false, // whether the key is extractable (i.e. can be used in exportKey)
					["sign"] // "verify" for public key import, "sign" for private key imports
				)
					.then(function(key) {
						// saves the privateKey
						privateKey = key;
						callback(true);
					})
					.catch(function() {
						// console.log(err);
						callback(false);
					});
			}
			else {
				callback(false);
			}
		}

		/**
		 * Converts a base64 string to an
		 * array-buffer.
		 *
		 * @param base64
		 * @returns {*}
		 */
		function base64ToArrayBuffer(base64) {
			try {
				var raw = window.atob(base64);
				var rawLength = raw.length;
				var array = new Uint8Array(new ArrayBuffer(rawLength));

				for(var i = 0; i < rawLength; i++) {
					array[i] = raw.charCodeAt(i);
				}
				return array.buffer;

			} catch(e) {
				return false;
			}
		}

		/**
		 * Converts an array-buffer to a base64
		 * string.
		 *
		 * @param arrayBuffer
		 * @returns {*}
		 */
		function arrayBufferToBase64(arrayBuffer) {
			var binary = "";
			var bytes = new Uint8Array(arrayBuffer);

			for (var i = 0; i < bytes.byteLength; i++) {
				binary += String.fromCharCode( bytes[ i ] );
			}
			return window.btoa(binary);
		}

		/**
		 * Prepares the private key to use for further
		 * transformation.
		 *
		 * @param pKey
		 * @returns {*}
		 */
		function preparePrivateKey(pKey) {
			var pB, pE, key;
			if(pKey.indexOf("KEY-----") !== -1) {
				pB = pKey.split("KEY-----");
				pE = pB[1].split("-----END");
				key = pE[0].replace(/\s/g, "");
			}
			else {
				key = pKey.replace(/\s/g, "");
			}

			return key;
		}

		return {
			construct: construct,
			verify: verify
		};

	}]);