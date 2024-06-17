import Sidebar from '../../components/sidebar/sidebar'
import Title from '../../components/title/title'
import { BsBarChart } from "react-icons/bs";


export default function DashboardAgua() {

    return (
        <div>
            <Sidebar />
            <main className='page-container'>
                <Title name={"Dashboard"}>
                    <BsBarChart size={25} />
                </Title>
                <iframe className='dashboard' title="tecsusBIFinal" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiOTViNzVjN2YtNGNjYy00Yzg1LWJlNDctNTUzNzY4NGQ1Y2JhIiwidCI6ImNmNzJlMmJkLTdhMmItNDc4My1iZGViLTM5ZDU3YjA3Zjc2ZiIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
                <button>baixar</button>
            </main>
        </div>
    )
}