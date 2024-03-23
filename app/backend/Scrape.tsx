import { Console } from "console";
import puppeteer from "puppeteer";
import { updateProfile, updateProgram, updateCourse } from "./Database";
import { ENABLED_PROGRAMS, STUDIE_INFO_URL } from "@/app/Constants";



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
    const programName = program.charAt(0).toUpperCase() + program.slice(1).toLowerCase();
    if (!ENABLED_PROGRAMS[programName]) {
        console.error("Error occurred while scraping program:", programName, "is not enabled");
        return;
    }
    console.log("Scraping program:", programName);

    // Sleep function to avoid getting blocked by the website
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const browserYear = await puppeteer.launch({headless: true});
    const pageYear = await browserYear.newPage();
    await pageYear.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[programName]);

    console.log("----------------------------------------")
    const options = (await pageYear.$eval('#related_entity_navigation', e => e.innerHTML)).split("</option>");
    let yearCodes: {[key: string]: string} = getYearCodes(options, programName);

    browserYear.close();

    console.log(yearCodes);
    Object.keys(yearCodes).forEach(async (year) => {
        await sleep(3000);
        let browser: puppeteer.Browser | undefined;
        let page: puppeteer.Page | undefined;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                    ],
            });
            page = await browser.newPage();
        } catch (error) {
            browser.close();
            console.error("Error occurred while launching browser:", error);
        }

        try {
            await page.goto(STUDIE_INFO_URL + ENABLED_PROGRAMS[programName] + "/" + yearCodes[year] + "#curriculum");
            await page.waitForSelector(".main-container");
        } catch (error) {
            browser.close();
            console.error("Error occurred while waiting for main container:", error);
        }

        try {
            const semesters2 = await page.evaluate(() => {
                const semester_list = document.querySelectorAll(".semester");
                return Array.from(semester_list).map((semester) => {
                    const spec_list = semester.querySelectorAll(".specialization");
                    return Array.from(spec_list).map((spec) => {
                        const period_list = spec.querySelectorAll(".period");
                        return Array.from(period_list).map((period) => {
                            const course_list = period.querySelectorAll(".main-row");
                            return Array.from(course_list).map((course) => {
                                const spec_name = (spec?.querySelectorAll(".table-responsive > table > caption > span")[0]?.innerHTML) || "Ingen inriktning";
                                const semester_number = semester?.querySelector(".accordion__head > h3")?.innerHTML || "Ingen termin";
                                const period_number = period.querySelector("tr > th")?.innerHTML || "Ingen period";

                                const course_info_fields = course.querySelectorAll("td");

                                const data_field_of_study = course?.getAttribute("data-field-of-study")?.split("|") || ["Hittade inget ämne"];
                                const data_vof = course?.getAttribute("data-vof") || "Hittade inget vof";
                                const data_course_name = course.querySelector("td > a")?.innerHTML || "Hittade inget kursnamn";
                                const data_course_code = course_info_fields[0]?.innerHTML || "Hittade ingen kurskod";
                                const data_hp = course_info_fields[2]?.innerHTML || "Hittade ingen HP";
                                const data_course_level = course_info_fields[3]?.innerHTML || "Hittade ingen kursnivå";
                                const data_block = course_info_fields[5]?.innerHTML || "Hittade inget block";

                                //updateCourse(
                                //    programName,
                                //    year,
                                //    spec_name,
                                //    semester_number,
                                //    period_number,
                                //    data_course_code,
                                //    data_field_of_study,
                                //    data_vof,
                                //    data_block,
                                //    data_course_name,
                                //    data_hp,
                                //    data_course_level);
                                return {
                                    programName,
                                    year,
                                    spec_name,
                                    semester_number,
                                    period_number,
                                    data_course_code,
                                    data_field_of_study,
                                    data_vof,
                                    data_course_name,
                                    data_hp,
                                    data_course_level
                                }
                            });
                        });
                    })
                });
            });
            console.log(semesters2[semesters2.length-3][1]);
        } catch (error) {
            browser.close();
            console.error("Error occurred while scraping course information:", error);
        }

        browser?.close();
    });

    return <p>Hej</p>;
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