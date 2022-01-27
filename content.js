let happy_emojis = {
	1: "☹️",
	2: "🙁",
	3: "😐",
	4: "🙂",
	5: "😀"
};

function add_div() {
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

	let head_height = document.getElementById("mw-head").offsetHeight;
	let tag_height = document.getElementById("p-namespaces").offsetHeight;

	let wiki_page_name = document.getElementById("firstHeading").innerHTML;

	// create button levels
	let butt_arr = [];
	for (let create_button = 0; create_button < 5; create_button++) {
		butt_arr[create_button] = `<button class="user_decision_button" level="${create_button + 1}">${happy_emojis[create_button + 1]}</button>`;
	}

	let div_up_or_down = `
		<div id="user_decision_tag" style="
					width: calc(${page_width - menu_width - left_panel_width - 5}px - 1em);
					height: ${head_height - tag_height}px;
					left: ${left_panel_width + 10}px;
					">
			<h2>Were you interested in ${wiki_page_name}?</h2>
			<div>
				${butt_arr[4]}
				${butt_arr[3]}
				${butt_arr[2]}
				${butt_arr[1]}
				${butt_arr[0]}
			</div>
		</div>
	`;

	let check_existence = document.getElementById("user_decision_tag");
	if (check_existence)
		check_existence.remove();
	let xml_site_wiki_tag = document.getElementsByTagName("body")[0];

	xml_site_wiki_tag.innerHTML = div_up_or_down + xml_site_wiki_tag.innerHTML;

	// add click to the buttons
	let user_buttons = document.getElementsByClassName("user_decision_button");

	for (let add_event = 0; add_event < user_buttons.length; add_event++) {
		console.log(user_buttons[add_event]);
		user_buttons[add_event].addEventListener("click", send_response);
	}
}

let xml_body;

window.onload = function(){
	add_div();

	xml_body = document.getElementById("bodyContent");
	console.log(xml_body);
}

window.onresize = add_div;

function send_response() {
	// pull the level from the button and send the xml_body
	let level = this.getAttribute("level");

	console.log("level", level);

	// remove the message from the page
	document.getElementById("user_decision_tag").remove();

	// change size of header
	document.getElementById("mw-page-base").style.height = "5em";
	document.getElementById("right-navigation").style["margin-top"] = "2.5em";
	document.getElementById("left-navigation").style["margin-top"] = "2.5em";
}