import "./index.css";
import title from "./img/title.png";

function Header() {
  return (
    <div className="flex justify-center items-center pt-50 h-[50vh] flex-col">
      <p className="mb-25 text-18 font-light tracking-[10px]">간편하게 알아보는 우리학교 급식정보</p>
      <img className="w-470 h-120" src={title} alt="어쩔급식" />
    </div>
  );
}
export default Header;
