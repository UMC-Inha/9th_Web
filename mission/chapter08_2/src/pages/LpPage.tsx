import { useEffect } from "react"
import { getLps } from "../apis/lps"
import LpCard from "../components/LpCard"
import { LpData } from "../types/lps";
import LpList from "../components/LpList";
import SearchBar from "../components/SearchBar";


const LpPage = () => {
    return (
        <div className="flex flex-col w-full h-dvh items-center text-center justify-center gap-5">
            <LpList />
        </div>
    )
}

export default LpPage
