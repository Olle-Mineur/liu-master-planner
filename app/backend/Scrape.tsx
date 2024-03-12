import { Console } from "console";
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

function getCourseInfo(semester: string, period: string, semester_counter: string){
    // data_field_of_study is an array of strings, else are strings

    if (!semester) {
        console.error("Error occurred while parsing course information: semester is empty");
        return {};
    }
    let courseInfo: {[key: string]: any} = {};

    try {
        courseInfo["course_code"] = semester.split("course-code=")[1].split('"')[1];
        courseInfo["data_field_of_study"] = semester.split("data-field-of-study=")[1].split('"')[1].split("|");
        courseInfo["data_vof"] = semester.split("vof=")[1].split('"')[1];
        courseInfo["data_id"] = semester.split("data-id=")[1].split('"')[1];
        courseInfo["data_course_name"] = semester.split(courseInfo["course_code"] + '">')[1].split("</a>")[0];

        let rest_string = semester.split(courseInfo["course_code"] + '">')[1].split("</a>")[1];
        courseInfo["data_course_points"] = rest_string.split("td>")[2].split("</")[0];
        courseInfo["data_course_grade"] = rest_string.split("td>")[4].split("</")[0];
        courseInfo["data_course_block"] = rest_string.split("td>")[6].split(' ')[52][0];
        courseInfo["data_course_period"] = period;
        courseInfo["data_course_semester"] = semester_counter;
    } catch (error) {
        console.error("Error occurred while parsing course information:", error);
    }
    return courseInfo;
}


export default async function scrapeProgram(program: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[program]);
    const options = (await page.$eval('#related_entity_navigation', e => e.innerHTML)).split("</option>");
    let yearCodes: {[key: string]: string} = getYearCodes(options, program);


    // https://studieinfo.liu.se/program/6CDDD/5723#curriculum
    await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[program] + "/" + yearCodes["HT2024"] + "#curriculum");

    const semesters_number = (await page.$$eval('.accordion__head > h3', semesters => {
        return semesters.map(semester => semester.innerHTML);
    }
    ));

    const semesters = (await page.$$eval('.specialization', specs => {
        return specs.map(spec => spec.innerHTML);
    }
    ));

    let master_semesters: Array<string> = [];
    let master_semesters_number: Array<string> = [];

    if (semesters.length > 0) {
        master_semesters_number = semesters_number.slice(6);
        master_semesters_number = master_semesters_number.slice(0, master_semesters_number.length-1);

        master_semesters = semesters.slice(6);
        master_semesters = master_semesters.slice(0, master_semesters.length-1);
    }

    let doc = master_semesters[master_semesters.length-1];
    let course_list = await getCourseList(doc);

    let period_counter = 1;

    while (period_counter < 3) {
        // console.log(course_list);
        //console.log("Period " + period_counter + ": " + course_list["Period " + period_counter])
        const course_string =  course_list["Period " + period_counter];
        // console.log(course_string);
        if (course_string === undefined || course_string.length < 1) break;
        // TODO: Make so master_semesters_number is the correct semester

        // TODO: Maybe not the best way to store the course info. course_info is an array of dictionaries, where each dictionary is a course and each element in the array are one period.
        let course_info: any[] = [];
        course_string.forEach(course => {
            course_info.push(getCourseInfo(course, "Period " + period_counter, master_semesters_number[0]));
        });
        //const courseinfo = getCourseInfo(course_string, "Period " + period_counter, master_semesters_number[0]);
        console.log(course_info);
        period_counter++;
    }

    browser.close();
    return <p>hej</p>;
}

// Returns a dictionary with the courses of a semester, where the key is the period and the value is the course code.
// Example: { "Period 1": "TDDD77", "Period 2": "TDDD78" }
async function getCourseList(doc : string): Promise<{ [key: string]: string[]; }>{
    let course_list: {[key: string]: string[]} = {}
    let period_counter = 1;
    while (period_counter < 3){
        const start_period = doc.search("tbody");
        const end_period = doc.search("/tbody");
        if (start_period >= end_period) break;
        let text = doc.slice(start_period, end_period);
        let period = (await getCourseListOfPeriod(text))["Period " + period_counter];
        doc = doc.slice(end_period+5);
        course_list["Period " + period_counter] = period;
        period_counter++;
    }
    return course_list;
}

async function getCourseListOfPeriod(text: string): Promise<{ [key: string]: string[]; }>{

    let period_number = text.split('<th colspan="7">')[1].split('<')[0];
    let period: {[key: string]: string[]} = {};
    while (true){
        const star = text.search('main-row') + 16;
        const en =  text.search('<div class="other-information-column">');
        if (star > en) break;
        if (period[period_number] === undefined) period[period_number] = [];
        period[period_number].push((text.slice(star,en)));
        text = text.slice(en+4);
    }
    return period;
}