import "./index.css";

function Header() {
  return (
    <div className="flex justify-center items-center pt-50 h-[50vh] mobile:h-[40vh] flex-col">
      <p className="mb-25 text-18 font-light tracking-[10px] mobile:tracking-[3px]">
        간편하게 알아보는 우리학교 급식정보
      </p>
      <h1 className="flex justify-center">
        <img className="w-470 h-120 mobile:w-[60%] mobile:h-auto" src={"img/title.png"} alt="어쩔급식" />
      </h1>
    </div>
  );
}
export default Header;
