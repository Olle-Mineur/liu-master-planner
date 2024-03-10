import { STUDIE_INFO_URL, ENABLED_PROGRAMS } from "../backend/Scrape";
import Bar from "../components/ProgramBar/Bar";
import List from '../components/ProgramBar/List';
import Listitem from '../components/ProgramBar/Listitem';

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen justify-between p-24">
            <div className="flex flex-row justify-between">
                <Bar>
                    <List>
                        {Object.keys(ENABLED_PROGRAMS).map((program, key) => {
                            return <Listitem key={key}>{program}</Listitem>
                            })
                        }
                    </List>
                </Bar>
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
