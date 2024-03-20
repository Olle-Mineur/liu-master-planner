import { ENABLED_PROGRAMS } from "../backend/Scrape";
import Bar from "../../components/ProgramBar/Bar";
import List from '../../components/ProgramBar/List';
import Listitem from '../../components/ProgramBar/Listitem';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"


export default function Home() {
    return (
        <main className="flex flex-col min-h-screen justify-between p-24">
            <div className="flex flex-row justify-between">
                <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Program</h4>
                        {Object.keys(ENABLED_PROGRAMS).map((program, key) => (
                            <>
                                <Button key={key} className="text-xs">
                                    {program}
                                </Button>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
                <Bar>
                    <List>
                        <Listitem>HT2024</Listitem>
                        <Listitem>HT2023</Listitem>
                        <Listitem>HT2022</Listitem>
                        <Listitem>HT2021</Listitem>
                        <Listitem>HT2020</Listitem>
                        <Listitem>HT2019</Listitem>
                    </List>
                </Bar>
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
