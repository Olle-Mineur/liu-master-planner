import { STUDIE_INFO_URL, ENABLED_PROGRAMS } from "../backend/Scrape";
import Bar from "../components/ProgramBar/Bar";
import List from '../components/ProgramBar/List';
import Listitem from '../components/ProgramBar/Listitem';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Bar>
                <List>
                    <Listitem href={STUDIE_INFO_URL + ENABLED_PROGRAMS["Datateknik"]}>Datateknik</Listitem>
                    <Listitem href={STUDIE_INFO_URL + ENABLED_PROGRAMS["Mjukvaruteknik"]}>Mjukvaruteknik</Listitem>
                    <Listitem href={STUDIE_INFO_URL + ENABLED_PROGRAMS["Informationsteknologi"]}>Informationsteknologi</Listitem>
                </List>
            </Bar>
        </main>
    );
}
