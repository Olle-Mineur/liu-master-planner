'use client';

import React, { useState, useEffect, use } from 'react';

import { ENABLED_PROGRAMS } from "@/app/Constants";
import Bar from "../../components/ProgramBar/Bar";
import List from '../../components/ProgramBar/List';
import Listitem from '../../components/ProgramBar/Listitem';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"


export default function Home() {
    const [programYears, setProgramYears] = useState([""]);
    const [yearsLoading, setYearsLoading] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedCourses, setSelectedCourses] = useState([""]);

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
        if (!selectedProgram) {
            console.error("No program selected");
            return;
        }
        if (selectedProgram){
            setYearsLoading(true);
            console.log("Selected program:", selectedProgram);
        }
        fetch("/api/programs/" + selectedProgram, { method: "GET" })
            .then(async (years) => {
                const yearsJson = await years.json();
                console.log("Program years for", selectedProgram, ":", Object.keys(yearsJson.years));
                if (!yearsJson.ok) {
                    setYearsLoading(false);
                    console.error("Error fetching program years:", yearsJson);
                    return;
                }
                setProgramYears(Object.keys(yearsJson.years));
                setYearsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching program years:", error);
            });
    }, [selectedProgram]);

    useEffect(() => {
        if (!selectedProgram || !selectedYear) {
            console.error("No program or year selected");
            return;
        }
        fetch("/api/programs/" + selectedProgram + "/" + selectedYear, { method: "GET" })
            .then(async (courses) => {
                const coursesJson = await courses.json();
                console.log("Program courses for", selectedProgram, selectedYear, ":", coursesJson);
                if (!coursesJson.ok) {
                    console.error("Error fetching program courses:", coursesJson);
                    return;
                }
                setSelectedCourses(coursesJson.programCourses);
            })
            .catch((error) => {
                console.error("Error fetching program courses:", error);
            });
    }, [selectedProgram, selectedYear]);

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

                {selectedProgram &&
                    <ScrollArea className="h-72 w-48 rounded-md border">
                        {yearsLoading ? <p className="text-sm font-medium">Loading available years...</p> :
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
                        }
                    </ScrollArea>
                }
                <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Profiler</h4>
                        <Button className="text-xs">AI och maskininlärning</Button>
                        <Separator className="my-2" />
                        <Button className="text-xs">Autonoma system</Button>
                        <Separator className="my-2" />
                        <Button className="text-xs">Datorsystem</Button>
                        <Separator className="my-2" />
                        <Button className="text-xs">Elektronik</Button>
                        <Separator className="my-2" />
                        <Button className="text-xs">Industriell ekonomi</Button>
                        <Separator className="my-2" />
                        <Button className="text-xs">International Software Engineering</Button>
                        <Separator className="my-2" />
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
}
