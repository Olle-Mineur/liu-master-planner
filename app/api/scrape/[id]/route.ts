'use server';

import scrapeProgram from '@/app/backend/Scrape';
import { ENABLED_PROGRAMS } from '@/app/Constants';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: any) {
    const { params } = context.id;
    const programName = params.charAt(0).toUpperCase() + params.slice(1).toLowerCase();

    if (!ENABLED_PROGRAMS[programName]) {
        return NextResponse.json({
            message: "Program not enabled",
        });
    }

    scrapeProgram(programName);

    return NextResponse.json({
        message: "Scraping program: " + programName,
    });

}