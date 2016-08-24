import { test, skip } from 'qunit';

var isPhantom = !!window._phantom;
export default isPhantom ? skip : test;
