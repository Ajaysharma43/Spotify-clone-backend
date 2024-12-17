import Navbar from "../Components/Navbar/Navbar";
import NewData from "../Components/Data/Data";
import Login from "../Components/Login/Login";
import Footer from "../Components/Footer/Footer";
function Homeapage()
{
    const Authenticated = sessionStorage.getItem('isAuthenticated')
    return(
        <>
        {
            Authenticated?
            (
                <div>
                    <Navbar/>
                    <NewData/>
                    <Footer/>
                </div>
            )
            :
            (
                <div>
                    <Login/>
                </div>
                
            )
        }
        
        </>
    )
}

export default Homeapage;