import Footer from "../Footer/Footer";
import Header from "../Header/Header";


export default function AppShell({ children, fallback }) {
    return (
        <div className="app">
            <Header />
       <main>{children ?? fallback}</main>
            <Footer />
        </div>
    );
}