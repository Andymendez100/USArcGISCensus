import axios from 'axios';

const statePopup = {

    "id": "{STATE}",
    "title": "{NAME}",
    "content": async function (event) {
        const { STATE } = event.graphic.attributes;

        /**
         * Retrieves data for selected state - returns object with language categories by state [estimate, label, state]
         * Return is of type promise 
         */
        const selectedStateCategories = axios.get(`https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:${STATE}&LAN7`)
            .then(resp => {
                const arr = resp.data.slice(1);

                if (arr) {
                    return arr.map(category => ({
                        estimate: category[0],
                        label: category[1],
                        state: category[2],
                    }))
                }
            });

        // use selectedState as a promise (returns all language categories)
        const selectedStateLanguages = axios.get(`https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:${STATE}&LAN`)
            .then(resp => {
                const data = resp.data.slice(1);

                if (data) {
                    return data
                        .sort((a, b, ) => b[0] - a[0])
                        .slice(0, 6)
                        .map(lang => ({
                            estimate: lang[0],
                            name: lang[1],
                            code: lang[3]
                        }));
                }
            });

        const categories = await selectedStateCategories;
        const languages = await selectedStateLanguages;

        if (categories && languages) {

            return "<p align='left'><strong>Language Categories</strong> </br>" +
                categories.map(category => `<strong>${category.label}: </strong> ${category.estimate} </br> `).join("") + "</p>" +
                "<p align='left'><strong>Top Spoken Languages (excluding English) </strong> </br>" +
                languages.map(language => `<strong>${language.name}: </strong> ${language.estimate} </br> `).join("") + "</p>"
        }
    }

}

export default statePopup;