// ==UserScript==
// @name         Create Booster for all Appids
// @version      0.1
// @description  Steam stuff
// @author       https://github.com/Flo4604
// @match        https://steamcommunity.com/tradingcards/boostercreator*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CONSTANTS = {
    SLEEP_TIME: 75,
    MAX_CRAFTS: 100 // Changes this to the amount of booster packs you want to craft
};

const craftBoosterPack = async (appId) => {
    const result = await $J.ajax({
        url: 'https://steamcommunity.com/tradingcards/ajaxcreatebooster/',
        type: 'POST',
        data: {
            sessionid: g_sessionID,
            appid: appId,
            series: 1, // no clue what this does
            tradability_preference: 1 // no clue what this does either
        },
        crossDomain: true,
        xhrFields: {withCredentials: true}
    });

    if(typeof result.purchase_eresult !== 'undefined') {
        return console.error(`[FAILURE] ${appId} Error crafting Booster Pack`, result);
    }

    console.log(`[SUCCESS] Bought Booster Pack for ${appId} | ${result.goo_amount} Gems Left`);
};

(async function() {
    'use strict';
    const selectElement = document.querySelector('#booster_game_selector');
    if(!selectElement.options) {
        return console.log("booster_game_selector not found");
    }

    const availableApps = [];
    for (const option of selectElement.options) {
        if (option.classList.contains('available')) {
           availableApps.push(option.value);
        }
    }

    availableApps.slice(0, CONSTANTS.MAX_CRAFTS);

    for await (const appId of availableApps) {
        craftBoosterPack(appId);

        await sleep(CONSTANTS.SLEEP_TIME);
    }
})();
