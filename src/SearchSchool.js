import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSchoolName, setSchoolNameCode } from "./slice";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import subTitle1 from "./img/search_title1.png";
import btnText1 from "./img/search_btn1.png";
import { ReactComponent as SelectArrow } from "./img/select_arrow.svg";
import "./index.css";

function SearchSchool() {
  const dispatch = useDispatch();

  const selectCityRef = useRef(null);
  const selectSchoolRef = useRef(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityNameCode, setCityNameCode] = useState("");
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [schoolNameInput, setSchoolNameInput] = useState("");
  const [searchSchoolBtnClicked, setSearchSchoolBtnClicked] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [numberOfSchools, setNumberOfSchools] = useState(0);
  const [searchSchoolList, setSearchSchoolList] = useState(`학교를 선택해주세요.(${numberOfSchools})`);

  const handleToggleCityDropdown = () => {
    setIsCityOpen(!isCityOpen);
  };

  const cityCode = [
    { 서울특별시: "B10" },
    { 부산광역시: "C10" },
    { 대구광역시: "D10" },
    { 인천광역시: "E10" },
    { 광주광역시: "F10" },
    { 대전광역시: "G10" },
    { 울산광역시: "H10" },
    { 세종특별자치시: "I10" },
    { 경기도: "J10" },
    { 강원특별자치도: "K10" },
    { 충청북도: "M10" },
    { 충청남도: "N10" },
    { 전라북도: "P10" },
    { 전라남도: "Q10" },
    { 경상북도: "R10" },
    { 경상남도: "S10" },
    { 제주특별자치도: "T10" },
  ];

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggleSchoolDropdown = () => {
    setIsSchoolOpen(!isSchoolOpen);
  };

  const handleOutsideClick = (event) => {
    if (selectCityRef.current && !selectCityRef.current.contains(event.target)) {
      setIsCityOpen(false);
    }
    if (selectSchoolRef.current && !selectSchoolRef.current.contains(event.target)) {
      setIsSchoolOpen(false);
    }
  };

  const handleSchoolSearchButton = () => {
    if (cityName.length === 0 || schoolNameInput.length === 0) {
      alert("지역과 학교명을 입력해주세요.");
    } else {
      axios
        .get(
          `https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.REACT_APP_API_KEY}&Type=json&pIndex=1&pSize=1000&ATPT_OFCDC_SC_CODE=${cityNameCode}&SCHUL_NM=${schoolNameInput}`
        )
        .then((response) => {
          const checkIncludeSchoolName = response.data.hasOwnProperty("schoolInfo")
            ? response.data.schoolInfo[1].row.filter((item) => {
                return item.SCHUL_NM.includes(schoolNameInput);
              })
            : "";
          setNumberOfSchools(checkIncludeSchoolName.length);
          setSchoolData(checkIncludeSchoolName.length === 0 ? [] : checkIncludeSchoolName);

          if (checkIncludeSchoolName.length >= 0) {
            setSearchSchoolList(`학교를 선택해주세요.(${checkIncludeSchoolName.length})`);
          }
        })
        .catch((error) => {
          console.log(`error : ${error}`);
        });

      cityName.length !== 0 && schoolNameInput.length !== 0 && setSearchSchoolBtnClicked(true);
    }
  };

  const onSchoolSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSchoolSearchButton();
    }
  };

  const handleCitySelect = (cityName, code) => {
    setCityName(cityName);
    setCityNameCode(code);
    setIsCityOpen(false);
  };

  const handleSchoolSelect = (schoolName, schoolcode) => {
    dispatch(setSchoolName(schoolName));
    dispatch(setSchoolNameCode(schoolcode));
    setIsSchoolOpen(false);
    setSearchSchoolList(schoolName);
  };

  const handleInput = (e) => {
    setSchoolNameInput(e.target.value);
  };

  return (
    <div className="flex flex-col items-center mt-50">
      <div className="w-[1280px] mobile:w-[90vw]">
        <div className="flex flex-col items-center rounded-50 p-120 mobile:py-60 mobile:px-30 bg-[#f2f2f2]">
          <h2 className="flex justify-center mb-60">
            <img className="mobile:w-[80%]" src={subTitle1} alt="지역과 학교를 검색해주세요" />
          </h2>
          {/* 지역 선택 셀렉트박스 */}
          <div className="flex mobile:flex-col mobile:w-[100%]">
            <div className="relative" ref={selectCityRef}>
              <div
                className="relative flex justify-start items-center w-200 mobile:w-[100%] h-60 px-10 py-4 mr-10 mobile:mb-20 bg-white rounded-10 border-solid border-[4px] border-gray-600"
                onClick={handleToggleCityDropdown}
              >
                {cityName || "지역을 선택해주세요."}
                <span className="absolute right-[10px] top-[18px]">
                  <SelectArrow className={`scale-75 ${!isCityOpen && `rotate-180`}`} />
                </span>
              </div>
              {isCityOpen && (
                <ul className="absolute top-[50px] left-0 w-[calc(100%-10px)] mobile:w-[100%] h-300 bg-white mt-10 py-15 px-30 rounded-10 overflow-y-scroll  border-solid border-[4px] border-[#e5e5e5] z-10">
                  {cityCode.map((item) => {
                    const cityName = Object.keys(item)[0];
                    const cityNameCode = item[cityName];

                    return (
                      <li
                        key={cityNameCode}
                        className="py-8 cursor-pointer hover:text-[#f0541e]"
                        onClick={() => handleCitySelect(cityName, cityNameCode)}
                      >
                        {cityName}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 학교명 입력 인풋 */}
            <input
              className="w-400 mobile:w-[100%] h-60 px-15 py-4 mr-10 mobile:mb-20 rounded-10 border-solid border-[4px] border-gray-600"
              onChange={handleInput}
              placeholder="학교명을 입력해주세요"
              onKeyPress={onSchoolSearchKeyPress}
            />
            {/* 학교명 검색 버튼 */}
            <button
              className="flex items-center justify-center w-200 mobile:w-[100%] h-60 px-20 py-10 bg-[#f0541e] hover:bg-[#f0241e] text-white rounded-10 border-solid border-[4px] border-gray-600"
              onClick={handleSchoolSearchButton}
            >
              <img src={btnText1} alt="학교 검색" />
            </button>
          </div>
          {/* 학교 검색 결과 */}
          <div className="mt-30 mobile:w-[100%]">
            <div className="flex items-center">
              {searchSchoolBtnClicked && typeof schoolData === "object" && (
                <div className={`relative ${isSchoolOpen ? "open" : ""} mobile:w-[100%]`} ref={selectSchoolRef}>
                  <div
                    className={`relative flex justify-start items-center w-820 mobile:w-[100%] h-60 px-10 py-4 mr-10 bg-white rounded-10 border-solid border-[4px] border-gray-600 ${
                      numberOfSchools !== 0 && `cursor-pointer`
                    }`}
                    onClick={handleToggleSchoolDropdown}
                  >
                    {searchSchoolList}
                    {numberOfSchools !== 0 && (
                      <span className="absolute right-[10px] top-[18px]">
                        <SelectArrow className={`scale-75 ${!isSchoolOpen && `rotate-180`}`} />
                      </span>
                    )}
                  </div>
                  {isSchoolOpen && (
                    <ul className="absolute top-[50px] left-0 w-[calc(100%-10px)] max-h-[300px] bg-white mt-10 px-30 py-15 rounded-10 overflow-y-scroll border-solid border-[4px] border-[#e5e5e5] z-10">
                      {schoolData.map((item) => {
                        const schoolName = item.SCHUL_NM;
                        const schoolNameCode = item.SD_SCHUL_CODE;

                        return (
                          <li
                            key={schoolNameCode}
                            className="py-8 cursor-pointer hover:text-[#f0541e]"
                            onClick={() => handleSchoolSelect(schoolName, schoolNameCode)}
                          >
                            {schoolName}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchSchool;
