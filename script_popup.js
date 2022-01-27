function pull_document_data() {
	return new Promise((resolve, reject) => {
		let response = [];

		chrome.storage.sync.get(["documents_read"], resultRead => {
			response[0] = resultRead.documents_read;

			chrome.storage.sync.get(["document_votes"], resultVote => {
				response[1] = resultVote.document_votes;

				resolve(response);
			});
		});
	});
}

chrome.storage.sync.get(["response_data"], async (result) => {
	result = result.response_data;

	document.getElementById("data_good_div").style.display = "none";
	document.getElementById("need_data_div").style.display = "none";

	if (result) {
		document.getElementById("data_good_div").style.display = "block";

		// set data
		document.getElementById("age_display").innerHTML = result.age_data;
		document.getElementById("gender_display").innerHTML = result.gender_data ? result.gender_data : "Not given";
		document.getElementById("ethnic_display").innerHTML = result.ethnic_data ? result.ethnic_data : "Not given";
		document.getElementById("institution_display").innerHTML = result.institution_level;
	
		let doc_results = await pull_document_data();

		document.getElementById("wiki_documents_display").innerHTML = doc_results[0];
		document.getElementById("institution_display").innerHTML = doc_results[1];
	} else {
		document.getElementById("need_data_div").style.display = "block";
	}
});

let validaters = {
	age_check: function(test_age) {
		if (typeof test_age == "number" && test_age >= 13)
			return 1;

		return 0;
	},
	insitution_check: function(test_institution) {
		if (typeof test_institution == "number" && test_institution >= 0 && test_institution <= 3)
			return 1;

		return 0;
	}
}

function validate_data(subject) {
	if (validaters.age_check(subject.age_data) && validaters.insitution_check(subject.institution_level))
		return 1;

	return 0;
}

let institution_options = {
	"elementary": 0,
	"middle school": 0,
	"high school": 1,
	"secondary": 1,
	"college": 2,
	"unviersity": 2
}

function redefine_institution(inst) {
	let read_insts = Object.keys(institution_options);

	let lowest = calc_dist(read_insts[0], inst), lowest_index = 0;
	for (let check_insts = 1; check_insts < read_insts.length; check_insts++) {
		let calc_test_lowest = calc_dist(read_insts[check_insts], inst);

		if (calc_test_lowest < lowest) {
			lowest = calc_test_lowest;
			lowest_index = check_insts;
		}
	}

	let decision_point = institution_options[read_insts[lowest_index]];
	return decision_point ? decision_point : 3;
}

document.getElementById("send_data_form").addEventListener("click", function(event) {
	event.preventDefault();

	let results_data = {};

	results_data.age_data = parseInt(document.getElementById("age_data").value, 10);
	results_data.gender_data = document.getElementById("gender_data").value;
	results_data.ethnic_data = document.getElementById("ethnic_data").value;
	results_data.institution_level = document.getElementById("institution_level").value;

	results_data.institution_level = redefine_institution(results_data.institution_level);	

	console.log(results_data);
	console.log(validate_data(results_data));
	if (validate_data(results_data))
		chrome.storage.sync.set({ "response_data": results_data }, function () {
			console.log("done");
		});
});


function make_array(w1, w2) {
	let array = [];
	let columns_value = w1.length > w2.length ? w1.length : w2.length;
	let rows_value = w1.length > w2.length ? w2.length : w1.length;
	for (let y = 0; y < columns_value + 1; y++) { // build the columns based on w1 value
		array[y] = [];
		for (let x = 0; x < rows_value + 1; x++) { // build the rows based on the w2 value
			array[0][x] = x;
			array[y][0] = y;
			array[y][x] = 0;
		}
	}
	return array;
}

function min(values) {
	let min = 100000;
	for (value in values) {
		min = values[value] < min ? values[value] : min;
	}
	return min
}

function calc_dist(w1, w2) {
	let array = make_array(w1, w2);
	w1 = " " + w1;
	w2 = " " + w2;
	for (let y = 1; y < array.length; y++) { // go through the rows
		for (let x = 1; x < array[0].length; x++) { // go through that full column
			let sub_add = w1[y] == w2[x] ? 0 : 1; // check for adding onto sub case
			// check the transpose case
			let transpose = array[y - 2] && array[y - 2][x - 2] ? array[y - 2][x - 2] : 10000;
			array[y][x] = (w1[x] == w2[y - 1] && w1[x - 1] == w2[y]) ? array[y][x] = min([sub_add + array[y - 1][x - 1], 1 + array[y][x - 1], 1 + array[y - 1][x], 1 + transpose]) : min([sub_add + array[y - 1][x - 1], 1 + array[y][x - 1], 1 + array[y - 1][x]]);
		}
	}

	return array[array.length - 1][array[0].length - 1];
}