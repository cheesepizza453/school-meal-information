import { useEffect, useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import parse from "html-react-parser";
import DatePicker from "react-datepicker";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

function SchoolInfo() {
  const [startDate, setStartDate] = useState(new Date());
  const [mainData, setMainData] = useState([]);
  const [searchDateString, setSearchDateString] = useState();

  const schoolName = useSelector((state) => state.school.schoolName);
  const schoolNameCode = useSelector((state) => state.school.schoolNameCode);

  useEffect(() => {
    setSearchDateString(dateToString(startDate));
  }, [startDate]);

  const handleMealSearchButton = () => {
    if (!schoolName) {
      alert("학교를 선택해주세요.");
    } else {
      axios
        .get(
          `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=${schoolNameCode}&MLSV_YMD=${searchDateString}`
        )
        .then((response) => {
          response.data.hasOwnProperty("mealServiceDietInfo")
            ? setMainData(response.data.mealServiceDietInfo[1].row)
            : setMainData("검색 결과가 없습니다.");
        })
        .catch((error) => {
          console.log(error);
          setMainData("검색 결과가 없습니다.");
        });
    }
  };

  const dateToString = (date) => {
    return date.getFullYear().toString().slice(2, 4) + (date.getMonth() + 1).toString().padStart(2, "0");
  };

  const handleCopyClipBoard = async (text) => {
    const textToCopy = text.filter((item, index) => index % 2 === 0).join("");
    try {
      await navigator.clipboard.writeText(textToCopy);

      alert("메뉴가 복사되었습니다.");
    } catch (error) {
      alert("복사에 실패했습니다.");
    }
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="w-200 h-60 text-20 rounded-10 border-solid border-[4px] border-gray-600 bg-white"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1280px] mobile:w-[90vw]">
        <div className="flex flex-col items-center mt-150 mobile:mt-60 p-120 mobile:py-60 mobile:px-30 bg-[#f2f2f2] rounded-50">
          <h2 className="flex justify-center mb-60">
            <img className="mobile:w-[80%]" src={"img/search_title2.png"} alt="날짜를 선택해 주세요" />
          </h2>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            customInput={<CustomDateInput />}
          />
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-center items-center my-100 mobile:my-60">
          <button
            className="flex items-center justify-center w-200 mobile:w-[100%] h-60 px-20 py-10 bg-[#f0541e] hover:bg-[#ff341e] text-white rounded-10 border-solid border-[4px] border-gray-600"
            onClick={handleMealSearchButton}
          >
            <img src={process.env.PUBLIC_URL + "img/searh_btn2.png"} alt="급식 검색하기" />
          </button>
        </div>

        {/* 급식정보 */}
        <div className="flex flex-wrap justify-center mb-200 mobile:mb-100">
          {typeof mainData === "object"
            ? mainData.map((item, index) => (
                <div
                  key={index}
                  className="relative min-w-240 rounded-40 bg-[#f2f2f2] hover:bg-[#eee] pt-30 pb-50 px-30 mx-10 mb-40"
                >
                  <p className="rounded-60 bg-white px-10 py-5 text-center font-bold mb-15 text-16">
                    {item.MLSV_FROM_YMD}
                  </p>
                  <p className="leading-[1.6] text-14" key={item.id}>
                    {parse(item.DDISH_NM.replace(/\([^)]+\)/g, ""))}
                  </p>
                  <button
                    className="absolute bottom-[20px] right-[20px]"
                    onClick={() => {
                      handleCopyClipBoard(parse(item.DDISH_NM.replace(/\([^)]+\)/g, "")));
                    }}
                  >
                    <FontAwesomeIcon icon={faCopy} className="hover:text-[#f0541e]" />
                  </button>
                </div>
              ))
            : typeof mainData === "string" && <p>{`${mainData}`}</p>}
        </div>
      </div>
    </div>
  );
}
export default SchoolInfo;
