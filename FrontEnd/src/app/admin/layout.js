import localFont from "next/font/local";
import "../globals.css";
import "./adminpage.css";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
      <div className="relative" style={{height: "100vh"}}>
        <Header />
        {children}
      </div>
  );
}
