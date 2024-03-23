'use server';

import { getProgramYears } from '@/app/backend/Database';
import scrapeProgram from '@/app/backend/Scrape';
import { ENABLED_PROGRAMS } from '@/app/Constants';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: "Enabled programs",
        data: Object.keys(ENABLED_PROGRAMS),
    });

}