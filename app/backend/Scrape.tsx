import puppeteer from "puppeteer";

export const STUDIE_INFO_URL = "https://studieinfo.liu.se/program/";

export const ENABLED_PROGRAMS: {[key: string]: string} = {
    "Datateknik": "6CDDD",
    "Mjukvaruteknik": "6CMJU",
    "Informationsteknologi": "6CITE",
}


export default async function scrapeProgram(program: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[program]);
    const options = (await page.$eval('#related_entity_navigation', e => e.innerHTML)).split("</option>");

    console.log(options[1].split("6CDDD/")[1].split('">')[0]); // Fetch code for year
    console.log(options[1].split('">')[1].split(",")[0].replace(/\s+/g, '')); // Fetch which semester
    browser.close();
    return <p>hej</p>;
}