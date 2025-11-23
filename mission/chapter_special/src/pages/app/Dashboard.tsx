import { useLanguage } from '../../context/LanguageContext';
import { languageCopy } from '../../local';
import DashboardCards from '../../componets/dashboard/DashboardCards';
import SalesDetail from '../../componets/dashboard/SalesDetail';
import DealsDetail from '../../componets/dashboard/DealsDetail';
import { TOTAL_SALES } from '../../mocks/totalSales';

export default function Dashboard() {
    const { language } = useLanguage();

    return (
        <div className="flex flex-col sm:px-[31px] px-[10px] py-[31px] w-full h-fit bg-bg-white gap-[27px]">
            <h1 className="title-32 text-dark-gray-500 sm:px-0 px-[30px]">
                {languageCopy[language].Dashboard.title}
            </h1>
            <DashboardCards />
            <div className="flex flex-col gap-[27px]">
                <SalesDetail data={TOTAL_SALES} />
                <DealsDetail />
            </div>
        </div>
    );
}
