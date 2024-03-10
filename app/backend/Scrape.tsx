import puppeteer from "puppeteer";

export const STUDIE_INFO_URL = "https://studieinfo.liu.se/program/";

export const ENABLED_PROGRAMS: {[key: string]: string} = {
    "Datateknik": "6CDDD",
    "Mjukvaruteknik": "6CMJU",
    "Informationsteknologi": "6CITE",
}


function getYear(option: string, program: string){
    return option.split(ENABLED_PROGRAMS[program] + "/")[1].split('"')[0];
}
function getSemester(option: string){
    return option.split('">')[1].split(",")[0].replace(/\s+/g, '');
}

function getYearCodes(options: Array<string>, program: string){
    let yearCodes: {[key: string]: string} = {}
    options.forEach(option => {
        if (option.includes(ENABLED_PROGRAMS[program]) || option.includes(program)) {
            yearCodes[getSemester(option)] = getYear(option, program);
        }
    });
    return yearCodes;
}


export default async function scrapeProgram(program: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[program]);
    const options = (await page.$eval('#related_entity_navigation', e => e.innerHTML)).split("</option>");
    let yearCodes: {[key: string]: string} = getYearCodes(options, program);


    // https://studieinfo.liu.se/program/6CDDD/5723#curriculum
    await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[program] + "/" + yearCodes["HT2024"] + "#curriculum");
    const semesters = (await page.$$eval('.specialization', specs => {
        return specs.map(spec => spec.innerHTML);
    }
    ));

    if (semesters.length > 0) {
        let master_semesters = semesters.slice(6);
        master_semesters = master_semesters.slice(0, master_semesters.length-1);
    }

    // let doc = courses[0]
    // let course_list = []
    // while (true){
    //     const start_c = doc.search("tbody");
    //     const end_c = doc.search("/tbody");
    //     if (start_c >= end_c) break; 
    //     console.log("start",start_c);
    //     console.log(end_c);
    //     let text = doc.slice(start_c, end_c);
    //     let period = [];
    //     while (true){
    //         const star = text.search('main-row') + 16;
    //         const en =  text.search('</a>');
    //         if (star > en) break; 
    //         period.push(text.slice(star,en));
    //         text = text.slice(en+4);
    //     }
    //     doc = doc.slice(end_c+5);
    //     course_list.push(period);
    // }
    // console.log(course_list);




    browser.close();
    return <p>hej</p>;
}