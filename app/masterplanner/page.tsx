'use client';

import React, { useState, useEffect } from 'react';

import { ENABLED_PROGRAMS } from "@/app/Constants";
import Bar from "../../components/ProgramBar/Bar";
import List from '../../components/ProgramBar/List';
import Listitem from '../../components/ProgramBar/Listitem';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"


export default function Home() {
    const [programYears, setProgramYears] = useState([""]);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const handleClick = {
        program: (program: string) => () => {
            setSelectedProgram(program);
        },
        year: (year: string) => () => {
            setSelectedYear(year);
        },
    }

    // TODO: Need to fetch programYears through a backend API
    useEffect(() => {
        fetch("/api/programs/" + ENABLED_PROGRAMS[selectedProgram], { method: "GET" })
            .then(async (years) => {
                const yearsKeys = Object.keys(await years.json());
                setProgramYears(yearsKeys);
            })
            .catch((error) => {
                console.error("Error fetching program years:", error);
            });
    }, [selectedProgram]);

    return (
        <main className="flex flex-col min-h-screen justify-between p-24">
            <div className="flex flex-row justify-between">
                <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Program</h4>
                        {Object.keys(ENABLED_PROGRAMS)?.map((program, key) => (
                            <>
                                <Button key={key} className="text-xs" onClick={handleClick.program(program)}>
                                    {program}
                                </Button>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
                <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Startår</h4>
                        {programYears?.map((year, key) => (
                            <>
                                <Button key={key} className="text-xs" onClick={handleClick.year(year)}>
                                    {year}
                                </Button>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
                <Bar>
                    <List>
                        <Listitem>AI och maskininlärning</Listitem>
                        <Listitem>Autonoma system</Listitem>
                        <Listitem>Datorsystem</Listitem>
                        <Listitem>Elektronik</Listitem>
                        <Listitem>Industriell ekonomi</Listitem>
                        <Listitem>International Software Engineering</Listitem>
                    </List>
                </Bar>
            </div>
        </main>
    );
}
