const formatDate = function(obj, pattern) {
	var date;
	if (obj.constructor === Date) {
		date = obj;
	} else if (typeof obj === "number") {
		date = new Date(obj);
	} else {
		return false;
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m > 9 ? m : ('0' + m);
	var d = date.getDate();
	d = d > 9 ? d : ('0' + d);
	var h = date.getHours();
	h = h > 9 ? h : ('0' + h);
	var str = '';
	pattern = pattern || 'yyyy-mm-dd';
	return pattern.toLowerCase().replace("yyyy", y).replace("mm", m).replace("dd", d).replace("hh", h);
}
const user = {}; 
const serverUrl = '/workplatform';
const session = {
	set(key,value){
		sessionStorage.setItem(key, JSON.stringify(value));
	},
	get(key){
		return JSON.parse(sessionStorage.getItem(key));
	},
	remove(key){
		sessionStorage.removeItem(key);
	}
}
export default {  
	user,
	serverUrl,
	session,
	formatDate
} 