import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Widget from "../Widget/";
import { Graph } from "../Widget/";

function Defaulter() {
    const { defaultersList } = useAuth();
    const { id } = useParams();
    const defaulterData = defaultersList.find(defaulter => defaulter._id === id);

    return (
        <>
            <main>
                <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm h-[500px]">
                    <div className="flex">
                        <Widget >
                            <Graph percentage={56} options={'Vyapar Score'} />
                        </Widget>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Defaulter
