let happy_emojis = {
	1: "☹️",
	2: "🙁",
	3: "😐",
	4: "🙂",
	5: "😀"
};

let showing_div = 1;

function add_decision_div() {
	if (!showing_div)
		return;

	// change size of header
	document.getElementById("mw-page-base").style.height = "10em";
	document.getElementById("right-navigation").style["margin-top"] = "7.5em";
	document.getElementById("left-navigation").style["margin-top"] = "7.5em";

	// calc proportions
	let menu_element = document.getElementById("p-personal").getElementsByClassName("vector-menu-content-list")[0];

	// remove menu_element padding to get width
	menu_element.style["padding-left"] = 0;
	let menu_width = menu_element.offsetWidth;
	menu_element.style["padding-left"] = 0;

	let left_panel_width = document.getElementById("mw-panel").offsetWidth;
	let page_width = document.getElementsByTagName("body")[0].offsetWidth;

	let wiki_page_name = document.getElementById("firstHeading").innerHTML;

	// create button levels
	let butt_arr = [];
	for (let create_button = 0; create_button < 5; create_button++) {
		butt_arr[create_button] = `<button class="user_decision_button" level="${create_button + 1}">${happy_emojis[create_button + 1]}</button>`;
	}

	let div_up_or_down = `
		<div class="user_decision_tag" style="
					width: calc(${page_width - menu_width - left_panel_width - 5}px - 1em);
					height: 120px;
					left: ${left_panel_width + 10}px;
					">
			<h2>Did you enjoy the article: <div style="display: inline; font-style: italic;">${wiki_page_name}</div>?</h2>
			<div>
				${butt_arr[4]}
				${butt_arr[3]}
				${butt_arr[2]}
				${butt_arr[1]}
				${butt_arr[0]}
			</div>
		</div>
	`;


	// add to the page
	let check_existence = document.getElementsByClassName("user_decision_tag")[0];
	if (check_existence)
		check_existence.remove();
	let xml_site_wiki_tag = document.getElementsByTagName("body")[0];

	xml_site_wiki_tag.innerHTML = div_up_or_down + xml_site_wiki_tag.innerHTML;



	// add click to the buttons
	let user_buttons = document.getElementsByClassName("user_decision_button");

	for (let add_event = 0; add_event < user_buttons.length; add_event++) {
		user_buttons[add_event].addEventListener("click", send_response);
	}

}

function add_error_div() {

	// change size of header
	document.getElementById("mw-page-base").style.height = "10em";
	document.getElementById("right-navigation").style["margin-top"] = "7.5em";
	document.getElementById("left-navigation").style["margin-top"] = "7.5em";

	// calc proportions
	let menu_element = document.getElementById("p-personal").getElementsByClassName("vector-menu-content-list")[0];

	// remove menu_element padding to get width
	menu_element.style["padding-left"] = 0;
	let menu_width = menu_element.offsetWidth;
	menu_element.style["padding-left"] = 0;

	let left_panel_width = document.getElementById("mw-panel").offsetWidth;
	let page_width = document.getElementsByTagName("body")[0].offsetWidth;

	let div_error = `
		<div class="user_decision_tag" style="
				width: calc(${page_width - menu_width - left_panel_width - 5}px - 1em);
				height: 120px;
				left: ${left_panel_width + 10}px;">
			<h2 style="text-align: center; overflow-y: auto">Required data is either missing or incorrect in the Wikireader</h2>
			Try changing the data in the extension popup and reloading the page.
		</div>
	`;

	let check_existence = document.getElementsByClassName("user_decision_tag")[0];
	if (check_existence)
		check_existence.remove();
	let xml_site_wiki_tag = document.getElementsByTagName("body")[0];

	xml_site_wiki_tag.innerHTML = div_error + xml_site_wiki_tag.innerHTML;



		// create suggestion feature
	let div_suggestor = `
		<div id="wiki-page-suggestor">
			<p id="wiki-page-surfer-p">Surf to</p>
			<div id="page-suggestor-button">
				<img id="page-suggestor-surfer" src="https://cutewiki.charlie.city/surfer.png"/>
				<div id="page-suggestor-send-container" class="container">
					<div id="page-suggestor-send" class="submit-feedback">another page</div>
				</div>
			</div>
		</div>
	`;

	let page_suggest_check = document.getElementById("wiki-page-suggestor");


	let xml_site_wiki_sidebar = document.getElementById("p-logo");
	xml_site_wiki_sidebar.style.height = "270px";
	if (page_suggest_check)
		page_suggest_check = div_suggestor;
	else
		xml_site_wiki_sidebar.innerHTML += div_suggestor;


	let check_taking_awhile_alive = document.getElementById("suggestor-taking-awhile-container");

	if (check_taking_awhile_alive)
		check_taking_awhile_alive.remove();

	document.getElementById("p-logo").innerHTML += taking_awhile_content;
	if (taking_awhile_bool)
		$("#suggestor-taking-awhile-container").addClass("display");

	document.getElementById("page-suggestor-send").addEventListener("mouseover", page_suggest_hover);
	document.getElementById("page-suggestor-send").addEventListener("mouseout", page_suggest_unhover);

	document.getElementById("page-suggestor-send").addEventListener("click", send_page_suggest);
}

function page_suggest_hover() {
	$("#page-suggestor-send").addClass("flow");
	$("#wiki-page-suggestor").addClass("flow");
}

let waiting_suggest = 0;

function page_suggest_unhover() {
	if (waiting_suggest) return;

	$("#page-suggestor-send").removeClass("flow");
	$("#wiki-page-suggestor").removeClass("flow");
}

function send_page_suggest() {
	waiting_suggest = 1;

	$("#page-suggestor-send").addClass("flow");
	$("#wiki-page-suggestor").addClass("flow");

	$("#page-suggestor-surfer").addClass("moving");
	$("#page-suggestor-send-container").addClass("moving");

	$("#wiki-page-surfer-p").html(`
		<img class="shells left" src="https://cutewiki.charlie.city/smallshell.png"/>
		<img class="shells mid" src="https://cutewiki.charlie.city/smallshell.png"/>
		<img class="shells right" src="https://cutewiki.charlie.city/smallshell.png"/>
	`);
	$("#page-suggestor-send").html("loading");

	setTimeout(taking_awhile, 800);
	$.post("https://suggestor.cutewiki.charlie.city/nn", {"unique-id": wiki_unique}, (res) => {
		window.location.href = "https://wikipedia.org/wiki/" + res;
	});
}

let taking_awhile_bool = 0;
let taking_awhile_content = `
	<div id="suggestor-taking-awhile-container">
		Taking awhile? Find out <a target="_blank" href="https://charlie.city/wikisuggest-slow"><button id="suggestor-taking-awhile-why">why.</button></a>
	</div>
`;

function taking_awhile() {
	taking_awhile_bool = 1;
	$("#suggestor-taking-awhile-container").addClass("display");
}

let curr_validation_status = 1;
let tab_url;
let wiki_unique;

let COUNT_TIME = 1;

function add_div() {
	chrome.storage.sync.get(["response_data"], function(result) {

		tab_url = window.location.href;
		chrome.storage.sync.set({ "curr_tab": tab_url });

		if (!validate_data(result.response_data)) {
			curr_validation_status = 0;

			add_error_div();
			return;
		}

		add_decision_div();

		let results_data = {};

		results_data.page_title = document.getElementById("firstHeading").innerHTML;
		results_data.wiki_code = get_wiki_code(document.getElementById("t-wikibase").getElementsByTagName("a")[0]);
		results_data.xml_body = document.getElementById("bodyContent").innerHTML;

		chrome.storage.sync.get(["unique_id", "curr_backend_url"], (result) => {

			results_data.unique_id = result.unique_id;

			send_request("POST", result.curr_backend_url + "open_page", results_data);

			wiki_unique = results_data.wiki_code;
		});
	});
}

function resize_div() {
	if (!curr_validation_status) {
		add_error_div();
		return;
	}

	add_decision_div();
}

window.onload = function() {
	wiki_unique = get_wiki_code(document.getElementById("t-wikibase").getElementsByTagName("a")[0])

	chrome.storage.sync.set({ curr_tab: window.href }, () => {
		add_div();
	});
};
window.onresize = resize_div;

function get_wiki_code(a_tag) {
	// grab url
	let full_url = a_tag.getAttribute("href").split("/");

	// search for the wiki id
	return full_url[full_url.length - 1];
}

function send_response() {
	// pull the level from the button and send the xml_body
	let level = this.getAttribute("level");
	showing_div = 0;

	// remove the message from the page
	document.getElementsByClassName("user_decision_tag")[0].remove();

	// change size of header
	document.getElementById("mw-page-base").style.height = "5em";
	document.getElementById("right-navigation").style["margin-top"] = "2.5em";
	document.getElementById("left-navigation").style["margin-top"] = "2.5em";

	// send level data with the user_unique_id and the page_unique_id
	chrome.storage.sync.get(["unique_id", "curr_backend_url"], (chrome_data) => {

		let data = {
			user_unique_id: chrome_data.unique_id,
			page_unique_id: wiki_unique,
			level: level
		};

		send_request("POST", chrome_data.curr_backend_url + "vote_page", data);
	});
}

function focus_count() {
	chrome.storage.sync.get(["curr_tab"], (check_global) => {

		COUNT_TIME = tab_url == check_global.curr_tab;

		if (!COUNT_TIME)
			return;

		chrome.storage.sync.get(["unique_id", "curr_backend_url"], (result) => {

			let data = {
				user_unique_id: result.unique_id,
				page_unique_id: wiki_unique,

				add_time: 48
			};

			if (data.user_unique_id && data.page_unique_id)
				send_request("POST", result.curr_backend_url + "focus_time", data);
		});
	});

	if (!curr_validation_status) { // keep checking for data updates
		chrome.storage.sync.get(["response_data"], function(result) {

			if (!validate_data(result.response_data)) {
				curr_validation_status = 0;

				add_error_div();
				return;
			}

			add_decision_div();
		});
	}
}

setInterval(focus_count, 48000);

let validaters = {
	age_check: function(test_age) {
		if (typeof test_age == "number" && test_age >= 13)
			return 1;

		return 0;
	},
	institution_check: function(test_institution) {
		if (typeof test_institution == "number" && test_institution >= 0 && test_institution <= 5)
			return 1;

		return 0;
	}
}

function validate_data(subject) {
	if (validaters.age_check(subject.age_data) && validaters.institution_check(subject.institution_level))
		return 1;

	return 0;
}

function send_request(type, url, data) {
	return new Promise((resolve, reject) => {
		let send_request = new XMLHttpRequest();
		send_request.open(type, url, true);
		send_request.setRequestHeader('Content-Type', 'application/json');

		send_request.onload = function(response) {
			resolve(response);
		}

		send_request.send(JSON.stringify(data));
	});
}