function pull_document_data() {
	return new Promise((resolve, reject) => {
		let response = [];

		browser.storage.sync.get(["unique_id", "curr_backend_url"], (id) => {
			let send_request = new XMLHttpRequest();
			send_request.open("POST", id.curr_backend_url + "pull_view_data", true);
			send_request.setRequestHeader('Content-Type', 'application/json');

			send_request.addEventListener("load", function() {
				let status = this.status;

				if (status == 0 || status == 200) {

					resolve(JSON.parse(this.responseText));
				}
			});

			send_request.send(JSON.stringify({
				user_unique_id: id.unique_id
			}));
		});
	});
}

let race_reverse = {
	"black": "Black or African American",
	"indian": "American Indian or Alaska Native",
	"asian": "Asian",
	"hawaiian": "Native Hawaiian or Other Pacific Islander",
	"white": "White",
	"none": "Not disclosed"
}

browser.storage.sync.get(["response_data"], async (result) => {
	result = result.response_data;

	document.getElementById("data_good_div").style.display = "none";
	document.getElementById("need_data_div").style.display = "none";

	if (result) {
		document.getElementById("data_good_div").style.display = "block";

		// set data
		document.getElementById("age_display").innerHTML = result.age_data;
		document.getElementById("gender_display").innerHTML = result.gender_data ? result.gender_data : "Not given";
		document.getElementById("ethnic_display").innerHTML = result.race_data ? race_reverse[result.race_data] : "Not given";
		document.getElementById("institution_display").innerHTML = institution_reverse[result.institution_level];

		let doc_results = (await pull_document_data())[0];

		document.getElementById("wiki_documents_display").innerHTML = doc_results.viewed_page;
		document.getElementById("wiki_read_amount_display").innerHTML = doc_results.total_time;
		document.getElementById("vote_documents_display").innerHTML = doc_results.voted_page;
	} else {
		document.getElementById("need_data_div").style.display = "block";
	}

	browser.storage.sync.get(["curr_backend_url"], (url) => {
		document.getElementById("privacy_policy_link").setAttribute("href", url.curr_backend_url + "privacy-policy");
	});
});

document.getElementById("privacy_policy").addEventListener("click", function() {
	window.open(document.getElementById("privacy_policy_link").getAttribute("href"), '_blank');
});

let changing_demographics = 0;

document.getElementById("change_demographics").addEventListener("click", function() {
	document.getElementById("data_good_div").style.display = "none";
	changing_demographics = 1;

	// fill in current data:
	browser.storage.sync.get(["response_data"], (data) => {

		let current_data = Object.keys(data.response_data);

		for (let copy_data = 0; copy_data < current_data.length; copy_data++) {
			if (current_data[copy_data] == "institution_level")
				document.getElementById(current_data[copy_data]).value = institution_form[data.response_data[current_data[copy_data]]];
			else
				document.getElementById(current_data[copy_data]).value = data.response_data[current_data[copy_data]];
		}

		document.getElementById("need_data_div").style.display = "block";
	});
});

let validaters = {
	age_check: function(test_age) {
		if (typeof test_age == "number" && test_age >= 13)
			return 1;

		return 0;
	},
	insitution_check: function(test_institution) {
		if (typeof test_institution == "number" && test_institution >= 0 && test_institution <= 5)
			return 1;

		return 0;
	}
}

function validate_data(subject) {
	if (validaters.age_check(subject.age_data) && validaters.insitution_check(subject.institution_level))
		return 1;

	return 0;
}

document.getElementById("close").addEventListener("click", function() {
	window.close();
});

let institution_options = {
	"primary": 0,
	"secondary": 1,
	"undergraduate": 2,
	"graduate": 3,
	"postgraduate": 4,
	"nonschool": 5
};

let institution_reverse = {
	0: "Primary",
	1: "Secondary",
	2: "Undergraduate",
	3: "Graduate",
	4: "Postgraduate",
	5: "Not currently enrolled"
};

let institution_form = {
	0: "primary",
	1: "secondary",
	2: "undergraduate",
	3: "graduate",
	4: "postgraduate",
	5: "nonschool"
}

function redefine_institution(inst) {
	return institution_options[inst];
}

document.getElementById("age_data").addEventListener("click", function() {
	this.select();
});

document.getElementById("submit").addEventListener("click", function(event) {
	event.preventDefault();

	let results_data = {};

	results_data.age_data = parseInt(document.getElementById("age_data").value, 10);
	results_data.gender_data = document.getElementById("gender_data").value;
	results_data.race_data = document.getElementById("race_data").value;
	results_data.institution_level = document.getElementById("institution_level").value;

	let miss_data_elem = document.getElementById("missing_data");
	let insert_miss_data_text = (isNaN(results_data.age_data) || !results_data.institution_level.length) ?
		`<p style="display: inline; color: red; font-size: 16px;">*</p>Please fill out at least age and level of school!` : results_data.age_data < 13 ?
		`<p style="display: inline; color: red; font-size: 16px;">*</p>You must be 13 or older to use Wikiread` : "";

	if (insert_miss_data_text.length) {
		miss_data_elem.innerHTML = insert_miss_data_text;
		miss_data_elem.classList.remove("warn");

		setTimeout(function() {
			miss_data_elem.classList.add("show");
			miss_data_elem.classList.add("warn");
		}, 40);

		return;
	}

	results_data.institution_level = redefine_institution(results_data.institution_level);

	if (validate_data(results_data))
		browser.storage.sync.set({
			"response_data": results_data
		}, function() {

			// reach to server to send the data
			browser.storage.sync.get(["unique_id", "curr_backend_url"], (result) => {

				if (!changing_demographics) {
					let send_request = new XMLHttpRequest();
					send_request.open("POST", result.curr_backend_url + "signup_user", true);
					send_request.setRequestHeader('Content-Type', 'application/json');

					send_request.addEventListener("load", function() {
						let status = this.status;

						if (status == 0 || status == 200) {
							browser.storage.sync.set({
								unique_id: this.responseText
							}, () => {
								window.close();
							});
						}
					});

					send_request.send(JSON.stringify(results_data));
				} else {
					results_data.user_unique_id = result.unique_id;

					let update_data = new XMLHttpRequest();
					update_data.open("POST", result.curr_backend_url + "change_user_data", true);
					update_data.setRequestHeader('Content-Type', 'application/json');

					update_data.addEventListener("load", function() {
						if (status == 0 || status == 200) {
							window.close();
						}
					});

					update_data.send(JSON.stringify(results_data));
				}
			});
		});
});