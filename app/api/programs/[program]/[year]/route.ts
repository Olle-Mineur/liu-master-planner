'use server';

import { getProgramYears } from '@/app/backend/Database';
import { scrapeProgramByYear, scrapeProgramYears } from '@/app/backend/Scrape';
import { ENABLED_PROGRAMS } from '@/app/Constants';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: any) {
    const params = context.params;
    const programName = params["program"].charAt(0).toUpperCase() + params["program"].slice(1).toLowerCase();
    const year: number = parseInt(params["year"]);
    const yearString = "HT" + year;

    if (!ENABLED_PROGRAMS[programName]) {
        return NextResponse.json({
            message: "Program not enabled",
        });
    }

    if (isNaN(year)) {
        return NextResponse.json({
            message: "Year is not a number" + year,
        });
    }

    const programYears = await scrapeProgramYears(programName) || {};

    if (!Object.keys(programYears).includes(yearString)) {
        return NextResponse.json({
            message: "Year " + year + " not available for program: " + programName,
        });
    }

    const programCourses = await scrapeProgramByYear(programName, year);

    return NextResponse.json({
        programCourses,
    });

}