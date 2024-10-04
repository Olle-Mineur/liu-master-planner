'use server';

import { ENABLED_PROGRAMS } from '@/app/Constants';
import { scrapeProgramYears } from '@/app/backend/Scrape';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: any) {
    const params = context.params;
    const programName = params["program"].charAt(0).toUpperCase() + params["program"].slice(1).toLowerCase();

    if (!ENABLED_PROGRAMS[programName]) {
        return NextResponse.json({
            message: "Program not enabled",
        });
    }

    const years = await scrapeProgramYears(programName) || {};
    const programYearsKeys = Object.keys(years) || [];

    //console.log("Years for program", programName, ":", programYearsKeys);
    //console.log("Years for program", programName, ":", years);

    return NextResponse.json({
        years
    });

}