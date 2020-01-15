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

export class Navigation extends Component {
    render() {
        return (
            <div id={"viewport"}>

                <div id={"sidebar"}>
                    <header>
                        <a href="#">Atcor</a>
                    </header>

                    <ul className={"nav"}>
                        <NavItem path="/tasks" name="Tasks" />
                        <NavItem path="/items" name="Items" />
                        <NavItem path="/invoices" name="Invoices" />
                    </ul>
                </div>
            </div>

        );
    }
}

export default Navigation;