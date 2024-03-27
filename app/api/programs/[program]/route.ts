'use server';

import { getProgramYears } from '@/app/backend/Database';
import { ENABLED_PROGRAMS } from '@/app/Constants';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: any) {
    const { params } = context.program;
    const programName = params.charAt(0).toUpperCase() + params.slice(1).toLowerCase();

    if (!ENABLED_PROGRAMS[programName]) {
        return NextResponse.json({
            message: "Program not enabled",
        });
    }

    const programYears = await getProgramYears(programName);

    return NextResponse.json({
        message: "Available program start years for: " + params,
        data: programYears,
    });

}