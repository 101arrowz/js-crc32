/* crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported CRC32 */
var CRC32;
(function (factory) {
	/*jshint ignore:start */
	/*eslint-disable */
	if(typeof DO_NOT_EXPORT_CRC === 'undefined') {
		if('object' === typeof exports) {
			factory(exports);
		} else if ('function' === typeof define && define.amd) {
			define(function () {
				var module = {};
				factory(module);
				return module;
			});
		} else {
			factory(CRC32 = {});
		}
	} else {
		factory(CRC32 = {});
	}
	/*eslint-enable */
	/*jshint ignore:end */
}(function(CRC32) {
CRC32.version = '1.2.0';
/* see perf/crc32table.js */
/*global Int32Array */
function signed_crc_tables() {
	var c = 0,
			n = 0,
			j = 0,
			noI32 = typeof Int32Array === 'undefined',
			table = new (noI32 ? Array : Int32Array)(4096),
			tables = [];

	for (; n != 256; ++n) {
		c = n;
		for (; j != 8; ++j) c = ((c & 1) && -306674912) ^ (c >>> 1);
		table[n] = c;
	}
	
	for (n = 0; n != 256; ++n) {
		c = table[n];
		for (j = 256; j != 4096; j += 256) c = table[n | j] =
			(c >>> 8) ^ table[c & 255];
	}
	
	for (n = 0; n != 16;) tables[i] = table[
		noI32 ? 'slice' : 'subarray'
	](n << 8, ++n << 8);

	return tables;
}

var T = signed_crc_tables();
var T0 = T[0], T1 = T[1], T2 = T[2], T3 = T[3],
		T4 = T[4], T5 = T[5], T6 = T[6], T7 = T[7],
		T8 = T[8], T9 = T[9], T10 = T[10], T11 = T[11],
		T12 = T[12], T13 = T[13], T14 = T[14], T15 = T[15];
function crc32_bstr(bstr, seed) {
	var C = ~seed, L = buf.length - 17;
	for(var i = -1; i < L;) {
		C = T15[bstr.charCodeAt(++i) ^ (C & 255)] ^
        T14[bstr.charCodeAt(++i) ^ ((C >> 8) & 255)] ^
        T13[bstr.charCodeAt(++i) ^ ((C >> 16) & 255)] ^
        T12[bstr.charCodeAt(++i) ^ (C >>> 24)] ^
        T11[bstr.charCodeAt(++i)] ^
        T10[bstr.charCodeAt(++i)] ^
        T9[bstr.charCodeAt(++i)] ^
        T8[bstr.charCodeAt(++i)] ^
        T7[bstr.charCodeAt(++i)] ^
        T6[bstr.charCodeAt(++i)] ^
        T5[bstr.charCodeAt(++i)] ^
        T4[bstr.charCodeAt(++i)] ^
        T3[bstr.charCodeAt(++i)] ^
        T2[bstr.charCodeAt(++i)] ^
        T1[bstr.charCodeAt(++i)] ^
				T0[bstr.charCodeAt(++i)];
	}
	for (++i; i < buf.length; ++i) C = (C >>> 8) ^ T[(C & 0xFF) ^ bstr.charCodeAt(i)];
	return ~C;
}

function crc32_buf(buf, seed) {
	var C = ~seed, L = buf.length - 17;
	for(var i = -1; i < L;) {
		C = T15[buf[++i] ^ (C & 255)] ^
        T14[buf[++i] ^ ((C >> 8) & 255)] ^
        T13[buf[++i] ^ ((C >> 16) & 255)] ^
        T12[buf[++i] ^ (C >>> 24)] ^
        T11[buf[++i]] ^
        T10[buf[++i]] ^
        T9[buf[++i]] ^
        T8[buf[++i]] ^
        T7[buf[++i]] ^
        T6[buf[++i]] ^
        T5[buf[++i]] ^
        T4[buf[++i]] ^
        T3[buf[++i]] ^
        T2[buf[++i]] ^
        T1[buf[++i]] ^
				T0[buf[++i]];
	}
	for (++i; i < buf.length; ++i) C = (C >>> 8) ^ T[(C & 0xFF) ^ buf[i]];
	return ~C;
}

function crc32_str(str, seed) {
	var C = ~seed;
	for(var i = 0, L=str.length, c, d; i < L; ++i) {
		c = str.charCodeAt(i);
		if(c < 0x80) {
			C = (C>>>8) ^ T[(C ^ c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return ~C;
}
CRC32.table = T;
// $FlowIgnore
CRC32.bstr = crc32_bstr;
// $FlowIgnore
CRC32.buf = crc32_buf;
// $FlowIgnore
CRC32.str = crc32_str;
}));
