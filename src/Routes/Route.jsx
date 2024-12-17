import { useRoutes } from "react-router-dom";
import Single from "../Components/Single-Track/Single";
import Likedsongs from "../Components/songlist/songlist";
import Homeapage from "../pages/Homepage";
import Login from "../Components/Login/Login";
import Signup from "../Components/Signup/Signup";
import Footer from "../Components/Footer/Footer";
import DataUploadPage from "../Dashboard/AdminPages/DataUploadPage/DataUploadPage";
import UserDataPage from "../Dashboard/AdminPages/UserDataPages/UserDataPage";
import History from "../Components/History/History";

const MyRoutes = () =>{
    let element = useRoutes([
        {path:"/" ,element:<Homeapage/>},
        {path:"/Single/:id" ,element:<Single/>},
        {path:"/songs" , element:<Likedsongs/>},
        {path:"/Login",element:<Login/>},
        {path:"/Signup",element:<Signup/>},
        {path:"/Footer",element:<Footer/>},
        {path:"/DataUploadPage",element:<DataUploadPage/>},
        {path:"/UserDataPage",element:<UserDataPage/>},
        {path:"/History",element:<History/>}
    ])

    return element;
}

export default MyRoutes;