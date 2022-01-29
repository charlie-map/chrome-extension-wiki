# chrome-extension-wiki
### Charlie Hall

This project creates a simple web browser extension on Google Chrome. It displays a simple UI that users can click to rank the wikipedia document:

![Wikipedia interest image](https://overfload.nyc3.cdn.digitaloceanspaces.com/6bea1680-c128-498d-af4e-482fc9ba0b83)

When hovered, each button thematically colors based on which emotion is labelled on that button (emotions between 1 (hated the page) and 5 (loved the page)). This data will then send to the backend (see [Wiki data collection](https://github.com/charlie-map/wiki_data_collection)) along with data on age, person pronouns, race / ethnic description, and current level of education. This data is easily collected within a UI that connects with the backend:

![Data collection popup UI](https://overfload.nyc3.cdn.digitaloceanspaces.com/e3bcea53-89b3-4ea4-bc68-b01cedd219b8)

Then, users can traverse Wikipedia articles (which will be tracked) and vote on each document if they would like.

# Next steps:
- [x] Creating a system to confirm consent from users to use data from wikipedia
- [x] Access and store data on (possibly) their age, gender, race, and current level of education
- [x] A backend system to store the wikipedia data in one localized place
- [x] Frontend send to that system (semi-constructured, but no current backend system to send to)
