import React, { Component } from "react";
import { FaBeer } from 'react-icons/fa';
const NavItem = props => {
    const pageURI = window.location.pathname + window.location.search
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
        <li className={liClassName}>
            <a href={props.path} className={aClassName}>
                <FaBeer />
                {props.name}
                {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
            </a>
        </li>
    );
}



export class Navigation extends Component{
    render(){
        return(
            <nav style={{marginBottom :"150px" }}className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <a className="navbar-brand" href="#">Atcor</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav mr-auto">
              <NavItem path="/tasks" name="Tasks" />
                <NavItem path="/items" name="Items" />
                <NavItem path="/invoices" name="Invoices" />
              </ul>
             
            </div>
          </nav>
        );
    }
}


// export class Navigation extends Component {
//     render() {
//         return (
//             <div id={"viewport"}>

//                 <div id={"sidebar"}>
//                     <header>
//                         <a href="#">Atcor</a>
//                     </header>

//                     <ul className={"nav"}>
//                         <NavItem path="/tasks" name="Tasks" />
//                         <NavItem path="/items" name="Items" />
//                         <NavItem path="/invoices" name="Invoices" />
//                     </ul>
//                 </div>
//             </div>

//         );
//     }
// }

export default Navigation;