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
		document.getElementById("ethnic_display").innerHTML = result.race_data ? result.race_data : "Not given";
		document.getElementById("institution_display").innerHTML = institution_reverse[result.institution_level];

		let doc_results = await pull_document_data();

		document.getElementById("wiki_documents_display").innerHTML = doc_results[0];
		document.getElementById("vote_documents_display").innerHTML = doc_results[1];
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

let institution_options = {
	"primary": 0,
	"secondary": 1,
	"undergraduate": 2,
	"graduate": 3,
	"postgraduate": 4,
	"nonschool": 5
};

let institution_reverse = {
	0: "primary",
	1: "secondary",
	2: "undergraduate",
	3: "graduate",
	4: "postgraduate",
	5: "nonschool"
};

function redefine_institution(inst) {
	return institution_options[inst];
}

document.getElementById("submit").addEventListener("click", function(event) {
	event.preventDefault();

	let results_data = {};

	results_data.age_data = parseInt(document.getElementById("age_data").value, 10);
	results_data.gender_data = document.getElementById("gender_data").value;
	results_data.race_data = document.getElementById("race_data").value;
	results_data.institution_level = document.getElementById("institution_level").value;

	results_data.institution_level = redefine_institution(results_data.institution_level);

	if (validate_data(results_data))
		chrome.storage.sync.set({
			"response_data": results_data
		}, function() {

			// reach to server to send the data
			chrome.storage.sync.get(["curr_backend_url"], (result) => {
				
				let send_request = new XMLHttpRequest();
				send_request.open("POST", result);

				send_request.onreadystatechange(() => {
					if (send_request.readyState == 4) {
						console.log(send_request.responseText);

						window.close();
					}
				});

				send_request.send(results_data);
			});
		});
});